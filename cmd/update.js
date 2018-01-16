const config = require('../config/config')
const yargsBuilder = require('../lib/yargsBuilder')

const getResults = require('../helpers/compileResults')
const err = require('../helpers/errorOutput')

const joinPath = require('path').join
const jsonfile = require('jsonfile')
const shell = require('shelljs')

module.exports = {
  desc: 'Updates the local verison of SFDX CLI and documentation.',
  command: ['update [nolocalhelp|nolocal|n]'],
  aliases: ['u'],

  builder: yargs => {
    yargs = yargsBuilder.builder(yargs)
    yargs
      .option('nolocalhelp', {
        alias: ['nolocal', 'n'],
        describe: 'Do not store local help files',
        type: 'boolean'
      })
      .example('$0 update', '- Updates the Salesforce DX CLI, and writes local help files')
      .example('$0 u --nolocal', '- Updates the Salesforce DX CLI, without local help files')
  },

  handler: argv => {
    argv = yargsBuilder.handler(argv)
    let numResults = 0
    const results = []

    results[numResults++] = shell.exec('sfdx update')

    if (!argv.nolocal) {
      const helpFile = joinPath(config.projectPath, 'docs', 'sfdx-help.txt')
      const refFile = joinPath(config.projectPath, 'docs', 'sfdx-ref.txt')

      if (!argv.quiet) console.log('Updating SFDX CLI reference file...')
      shell.exec('sfdx force:doc:commands:list > ' + refFile)

      results[numResults++] = outputFile(argv)

      if (!argv.quiet) console.log('Updating SFDX CLI help file...')
      results[numResults++] = shell.exec('sfdx force:doc:commands:display > ' + helpFile)
    }

    return getResults(results)
  }
}

async function outputFile (argv) {
  let numResults = 0
  const results = []
  const today = new Date()
  const outputfile = joinPath(
    config.projectPath,
    'docs',
    'sfdx-help-unformatted' + '-' + today.getHours() + today.getMinutes() + today.getSeconds() + '.json'
  )
  const newfile = joinPath(config.projectPath, 'docs', 'sfdx-help-extended.json')
  results[numResults++] = await shell.exec('sfdx force:doc:commands:display --json > ' + outputfile)

  try {
    await jsonfile.writeFileSync(newfile, jsonfile.readFileSync(outputfile), { spaces: 2 }, err => {
      if (!argv.quiet) console.error(err)
      throw new Error(err)
    })
  } catch (fileError) {
    results[numResults++] = { stderr: fileError }
  }

  results[numResults++] = shell.exec('rm -rf ' + outputfile)

  const result = getResults(results)
  if (result.stderr) {
    if (!argv.quiet) {
      console.error(err('Unable to complete update.'))
      console.error(result.stderr)
    }
  } else {
    if (!argv.quiet) console.log('Update completed.')
  }

  return result
}
