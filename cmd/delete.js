const err = require('../helpers/errorOutput')
const getResults = require('../helpers/compileResults')

const inquirer = require('inquirer')
const isArray = require('util').isArray
const shell = require('shelljs')

module.exports = {
  desc: 'Deletes scratch org(s).',
  command: ['delete [orgname] [alias|a] [force|f]'],
  aliases: ['del', 'd'],

  builder: yargs => {
    yargs
      .positional('orgname', {
        describe: 'Alias (or username) of the org to delete',
        type: 'array'
      })
      .option('alias', {
        alias: ['a'],
        describe: '[Additional] Alias(es) (or username(s)) of the org(s) to delete',
        type: 'array'
      })
      .option('force', {
        alias: ['f'],
        describe: 'Delete the org(s) without prompt',
        type: 'boolean'
      })
      .option('json', {
        alias: ['j'],
        describe: 'Output in JSON format',
        type: 'boolean'
      })
      .option('quiet', {
        alias: ['q'],
        describe: 'Quiet mode',
        type: 'boolean'
      })
      .example('$0 delete --alias DeleteMe -f', "- Forcibly deletes the org with the alias 'DeleteMe'")
      .example('$0 del -a DeleteMe AndMe', "- Deletes the orgs with the aliases 'DeleteMe' and 'AndMe'")
      .example('$0 d DeleteMe', "- Deletes the org with the alias 'DeleteMe'")
  },

  handler: async argv => {
    if (!argv) argv = {}
    const orgList = argv.alias || argv.orgname
    if (!orgList) {
      console.error(err('No org name specified for deletion.'))
      process.exit(1)
    }

    let numResults = 0
    const results = []
    if (isArray(orgList)) {
      for (let org of orgList) {
        results[numResults++] = await deleteOrg(org, argv)
        let lastResult = results[numResults - 1]
        if (lastResult.stderr) return problemsHappened(lastResult)
      }
    } else {
      results[numResults++] = await deleteOrg(orgList, argv)
      let lastResult = results[numResults - 1]
      if (lastResult.stderr) return problemsHappened(lastResult)
    }

    return await getResults(results)
  }
}

function problemsHappened (result) {
  console.error(err('Deletion failed.'))
  return result
}

async function deleteOrg (orgName, argv) {
  if (!argv.force) {
    const deleteConfirmed = 'deleteOrg'
    const answers = await inquirer.prompt({
      default: false,
      message: "Do you want to delete the org '" + orgName + "'?",
      name: deleteConfirmed,
      type: 'confirm'
    })

    if (answers[deleteConfirmed]) {
      return await performDeletion(orgName, argv)
    } else {
      return {}
    }
  } else {
    return await performDeletion(orgName, argv)
  }
}

async function performDeletion (alias, argv) {
  if (!alias) {
    console.error(err('No org name specified to delete.'))
    process.exit(1)
  }

  if (!argv.quiet) console.log("Deleting org '" + alias + "'...")
  let deleteCommand = 'sfdx force:org:delete' + ' --targetusername ' + alias + ' --noprompt'
  if (argv.json) deleteCommand += ' --json'
  const result = await shell.exec(deleteCommand)

  return result
}
