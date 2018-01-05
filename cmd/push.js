const err = require('../helpers/errorOutput')
const getResults = require('../helpers/compileResults')

const deployFlows = require('./deployFlows').handler

const shell = require('shelljs')

module.exports = {
  desc: 'Push local code to a scratch org.',
  command: ['push [pushto|to|t|a] [forceoverwrite|force|f] [noflows|nf|n]'],
  aliases: [],

  builder: yargs => {
    yargs
      .positional('orgname', {
        describe: 'Alias of the scratch org to push code into'
      })
      .option('pushto', {
        alias: ['alias', 'to', 't', 'a'],
        describe: 'Alias of the scratch org to push code into'
      })
      .option('forceoverwrite', {
        alias: ['force', 'f'],
        describe: 'Force the local code to overwrite remote changes',
        type: 'boolean'
      })
      .option('noflows', {
        alias: ['nf', 'n'],
        describe: 'Do not check for updated flow versions',
        type: 'boolean'
      })
      .option('quiet', {
        alias: ['q'],
        describe: 'Quiet mode',
        type: 'boolean'
      })
      .example('$0 push --pushto MyOrg', "- Pulls source into 'MyOrg'")
      .example('$0 push MyOrg -f', "- Forcibly pushes source into 'MyOrg'")
      .example('$0 push MyOrg --noflows', "- Pushes source into 'MyOrg', without checking flow versions")
  },

  handler: async argv => {
    if (!argv) argv = {}
    argv.pushto = argv.alias || argv.orgname

    let numResults = 0
    const results = []

    if (!argv.quiet) {
      console.log('Pushing code into ' + (argv.pushto ? "'" + argv.pushto + "'" : 'default org') + '...')
      console.log()
    }

    if (argv.noflows) {
      let pushCommand = 'sfdx force:source:push'
      if (argv.forceCode) pushCommand += ' --forceoverwrite'
      if (argv.alias) pushCommand += ' --targetusername ' + argv.alias

      results[numResults++] = await shell.exec(pushCommand)
      if (results[numResults - 1].stderr || results[numResults - 1].stdout.indexOf('ERROR') != -1) {
        console.error(
          err('Could not deploy code. Check that the active flow versions have not been modified or deleted.')
        )
        process.exit(1)
      }
    } else {
      argv.fromPush = true
      results[numResults++] = deployFlows(argv)
    }

    return getResults(results)
  }
}
