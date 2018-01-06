const shell = require('shelljs')

module.exports = {
  desc: 'Gets info about the default user of an org.',
  command: ['userinfo [orgname] [alias|org|a],'],
  aliases: ['ui'],

  builder: yargs => {
    yargs
      .positional('orgname', {
        describe: 'Alias of the org to retrieve info on'
      })
      .option('alias', {
        alias: ['org', 'a'],
        describe: 'Alias of the org to retrieve info on'
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
      .example('$0 userinfo --alias MyOrg', "- Gets user info for the org 'MyOrg'")
      .example('$0 ui MyOrg', "- Gets user info for the org 'MyOrg'")
  },

  handler: argv => {
    if (!argv) argv = {}
    if (argv.json) argv.quiet = true
    let alias = argv.alias || argv.orgname
    let userInfoCommand = 'sfdx force:user:display'
    if (argv.json) userInfoCommand += ' --json'

    if (alias) userInfoCommand += ' --targetusername' + alias

    if (!argv.quiet) {
      console.log('Getting user info for ' + (alias ? "'" + alias + "'" : 'default org') + '...')
      console.log()
    }

    const result = shell.exec(userInfoCommand)

    return result
  }
}
