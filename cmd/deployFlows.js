const config = require('../config/config')

const err = require('../helpers/errorOutput')
const getResults = require('../helpers/compileResults')

const fs = require('fs')
const inquirer = require('inquirer')
const joinPath = require('path').join
const shell = require('shelljs')
const xml2js = require('xml2js')

// Set global variables
const defPath = joinPath(config.get('dxSourceDir'), 'flowDefinitions')
const flowPath = joinPath(config.get('dxSourceDir'), 'flows')

module.exports = {
  desc: 'Deploys the flows to an org, ensuring that only one version is deployed and active.',
  command: ['deployflows [orgname] [alias|org|a] [forcedelete|fd]'],
  aliases: ['flows'],

  builder: yargs => {
    yargs
      .positional('orgname', {
        describe: 'Alias of the org of which to deploy flows to'
      })
      .option('alias', {
        alias: ['org', 'a'],
        describe: 'Alias of the org of which to deploy flows to'
      })
      .option('forcedelete', {
        alias: ['fd'],
        describe: 'Attempt to force delete any flow versions that are out-of-date',
        type: 'boolean'
      })
      .option('forcepush', {
        alias: ['fp'],
        describe: 'Attempt to force overwrite remote code with local changes',
        type: 'boolean'
      })
      .option('quiet', {
        alias: ['q'],
        describe: 'Quiet mode',
        type: 'boolean'
      })
  },

  handler: argv => {
    argv.alias = argv.alias || argv.orgname

    let numResults = 0
    let results = []

    /* (Step 1) Push code to org first, to ensure correct flow version is active */
    if (!argv.quiet) {
      if (!argv.fromPush) console.log('Beginning code push...')
      console.log()
    }
    results[numResults++] = pushCode(argv)

    /* (Step 2) Next, delete any non-active flow definition files */
    results[numResults++] = deleteFlows(argv)

    return getResults(results)
  }
}

const deleteFlows = async argv => {
  let numResults = 0
  const results = []

  const filesToDelete = await getfilesToDelete(argv)
  if (filesToDelete.length > 0) {
    // Delete files that have been marked to delete
    for (const file of filesToDelete) {
      const fullPath = joinPath(flowPath, file)
      if (!argv.quiet) console.log("Deleting flow '" + file + "'...")
      fs.unlinkSync(fullPath)
    }

    /* (Step 3) Last step is to push again if needed */
    if (!argv.quiet) {
      console.log('Pushing updated flow versions to ' + (argv.alias ? "'" + argv.alias + "'" : 'default org') + '...')
      console.log()
    }

    results[numResults++] = pushCode(argv)
  } else {
    const output = 'All flows up to date!'
    if (!argv.quiet) console.log(output)
    results[numResults++] = {}
    results[numResults - 1].stdout = output
  }

  return getResults(results)
}

const getfilesToDelete = async argv => {
  if (!argv.quiet) {
    console.log()
    console.log('Checking for out-of-date flows...')
  }

  // Get list of files that define each flow and flow version
  const questions = []
  const filesToDelete = []

  // For the version number, look for the number at the end of the filename, after the '-', and before the extension ('.')
  const regexVersion = /(?!-)[0-9]+(?=\.)/

  // Attempt to check flow directories
  let defFileList = []
  let flowFileList = []
  if (fs.existsSync(defPath)) {
    try {
      defFileList = await fs.readdirSync(defPath)
      // Get list of flows ordered by version number
      flowFileList = await fs
        .readdirSync(flowPath)
        .map(file => {
          return {
            name: file,
            time: fs.statSync(joinPath(flowPath, file)).mtime.getTime(),
            version: parseInt(regexVersion.exec(file)[0])
          }
        })
        .sort((a, b) => {
          return a.version - b.version
        })
        .map(file => {
          return file.name
        })
    } catch (fileError) {
      console.error(config.get('stars') + 'ERROR:' + config.get('stars'))
      console.error(fileError)
      process.exit(1)
    }
  } else {
    // No flow directory
    return ''
  }

  const flowDefs = []
  const regexDefFilename = /.+(?=\.flowDefinition-meta\.xml)/
  for (const defFile of defFileList) {
    const defFilename = regexDefFilename.exec(defFile)[0]

    // Get active version number from definition files
    const parser = new xml2js.Parser()
    const fileData = await fs.readFileSync(joinPath(defPath, defFile))
    parser.parseString(fileData, (err, result) => {
      const defVersion = parseInt(result['FlowDefinition']['activeVersionNumber'])
      flowDefs[defFilename] = { activeVersion: defVersion }
    })
  }

  // For the filename, look at everything until '-' followed by a number
  const regexFlowFilename = /.+?(?=-[0-9]+\.)/

  let flowFile = ''
  let flowsToKeep = config.get('oldFlowsToKeep')

  if (isNaN(flowsToKeep)) {
    console.error(err('Invalid number of flow specified in configuration.'))
    process.exit(1)
  }

  for (let flowNum = flowFileList.length - 1; flowNum >= 0; flowNum--) {
    flowFile = flowFileList[flowNum]

    // Skip hidden files
    if (flowFile.startsWith('.')) continue

    const flowFilename = regexFlowFilename.exec(flowFile)[0]
    const flowVersion = parseInt(regexVersion.exec(flowFile)[0])

    if (flowDefs[flowFilename].activeVersion !== flowVersion) {
      if (argv.forcedelete) {
        if (flowDefs[flowFilename].activeVersion < flowVersion) {
          console.warn(
            config.get('stars') +
              'WARNING: Active flow version is less than latest flow file version.' +
              config.get('stars')
          )
          console.warn(
            config.get('stars') +
              "Please update the active flow version, run the 'deployflows' command without the '--forcedelete' option, or delete the file(s)." +
              config.get('stars')
          )
          process.exit(flowVersion)
        }
        if (flowsToKeep > 0) {
          flowsToKeep -= 1
        } else {
          const toDelete = flowFile
          filesToDelete.push(toDelete)
        }
      } else {
        if (flowsToKeep > 0) {
          flowsToKeep -= 1
        } else {
          questions.push({
            default: false,
            message: 'Delete ' + flowFile + '?',
            name: flowFilename + '-' + flowVersion,
            type: 'confirm'
          })
        }
      }
    }
  }

  if (!argv.forcedelete) {
    const promptResult = await inquirer.prompt(questions).then(answers => {
      for (toDelete in answers) {
        if (answers[toDelete]) filesToDelete.push(toDelete + '.flow-meta.xml')
      }
    })
  }
  return filesToDelete
}

const pushCode = argv => {
  let pushCommand = 'sfdx force:source:push'
  if (argv.forcepush) pushCommand += ' --forceoverwrite'
  if (argv.alias) pushCommand += ' --targetusername ' + argv.alias

  const result = shell.exec(pushCommand)
  if (result.stderr || result.stdout.indexOf('ERROR') != -1) {
    if (!argv.quiet) console.log()
    console.error(err('Could not deploy code. Check that the active flow versions have not been modified or deleted.'))
    process.exit(1)
  }

  return result
}
