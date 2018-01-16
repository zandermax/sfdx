const yargsBuilder = require('../lib/yargsBuilder')

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
    yargs = yargsBuilder.builder(yargs)
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
      .example('$0 delete --alias DeleteMe -f', "- Forcibly deletes the org with the alias 'DeleteMe'")
      .example('$0 del -a DeleteMe AndMe', "- Deletes the orgs with the aliases 'DeleteMe' and 'AndMe'")
      .example('$0 d DeleteMe', "- Deletes the org with the alias 'DeleteMe'")
  },

  handler: async argv => {
    argv = yargsBuilder.handler(argv)
    const orgList = argv.alias || argv.orgname
    if (!orgList) {
      const errorMsg = err('No org name specified for deletion.')
      if (!argv.quiet) console.error(errorMsg)
      return { stderr: errorMsg }
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
  const errorMsg = err('Deletion failed.')
  console.error(errorMsg)
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
    let errorMsg = err('No org name specified to delete.')
    if (!argv.quiet) console.error(errorMsg)
    return { stderr: errorMsg }
  }

  if (!argv.quiet) console.log("Deleting org '" + alias + "'...")
  let deleteCommand = 'sfdx force:org:delete' + ' --targetusername ' + alias + ' --noprompt'
  if (argv.json) deleteCommand += ' --json'
  const result = await shell.exec(deleteCommand)

  return result
}
