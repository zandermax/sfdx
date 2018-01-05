const getResults = require('../helpers/compileResults')

const userInfo = require('./userInfo').handler

const shell = require('shelljs')

module.exports = {
  desc: 'Gets info about an org.',
  command: ['orginfo [orgname] [alias|org|a]'],
  aliases: ['i'],

  builder: yargs => {
    yargs
      .positional('orgname', {
        describe: 'Alias of the org to retrieve info on'
      })
      .option('alias', {
        alias: ['org', 'a'],
        describe: 'Alias of the org to retrieve info on'
      })
      .option('quiet', {
        alias: ['q'],
        describe: 'Quiet mode',
        type: 'boolean'
      })
      .option('user', {
        alias: ['u'],
        describe: 'Also retrieve info on the default user',
        type: 'boolean'
      })
      .example('$0 orginfo --alias MyOrg', "- Gets info on the org with alias 'MyOrg'")
      .example('$0 i MyOrg -u', "- Gets org and user info on the org with alias 'MyOrg'")
  },

  handler: argv => {
    if (!argv) argv = {}
    const alias = argv.alias || argv.orgname
    let orgInfoCommand = 'sfdx force:org:display'

    if (alias) {
      orgInfoCommand += ' --targetusername ' + alias
    }

    if (!argv.quiet) console.log('Getting org info for ' + (alias ? "'" + alias + "'" : 'default org') + '...')

    if (!argv.quiet) console.log()
    let result = shell.exec(orgInfoCommand)
    if (!argv.quiet) console.log()

    if (argv.user) {
      result = getResults([result, userInfo(argv)])
    }

    return result
  }
}
