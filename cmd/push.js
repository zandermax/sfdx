const yargsBuilder = require('../lib/yargsBuilder')

const err = require('../helpers/errorOutput')
const getResults = require('../helpers/compileResults')

const deployFlows = require('./deployFlows').handler

const shell = require('shelljs')

module.exports = {
  desc: 'Push local code to a scratch org.',
  command: ['push [pushto|to|t|a] [forceoverwrite|force|f] [noflows|nf|n]'],
  aliases: [],

  builder: yargs => {
    yargs = yargsBuilder.builder(yargs)
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
      .example('$0 push --pushto MyOrg', "- Pulls source into 'MyOrg'")
      .example('$0 push MyOrg -f', "- Forcibly pushes source into 'MyOrg'")
      .example('$0 push MyOrg --noflows', "- Pushes source into 'MyOrg', without checking flow versions")
  },

  handler: async argv => {
    argv = yargsBuilder.handler(argv)
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
      if (argv.json) pushCommand += ' --json'

      results[numResults++] = await shell.exec(pushCommand)
      const lastResult = results[numResults - 1]
      if (lastResult.stderr || lastResult.stdout.indexOf('ERROR') != -1) {
        const errorMsg = err(
          'Could not deploy code. Check that the active flow versions have not been modified or deleted.'
        )
        if (!argv.quiet) console.error(errorMsg)
        return { stderr: errorMsg }
      }
    } else {
      argv.fromPush = true
      results[numResults++] = deployFlows(argv)
    }

    return getResults(results)
  }
}
