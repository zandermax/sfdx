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
      .option('quiet', {
        alias: ['q'],
        describe: 'Quiet mode',
        type: 'boolean'
      })
  },

  handler: argv => {
    if (!argv) argv = {}
    let alias = argv.alias || argv.orgname
    let userInfoCommand = 'sfdx force:user:display'

    if (alias) {
      userInfoCommand += ' --targetusername ' + alias
    }

    if (!argv.quiet) {
      console.log('Getting user info for ' + (alias ? "'" + alias + "'" : 'default org') + '...')
      console.log()
    }

    const result = shell.exec(userInfoCommand)

    return result
  }
}
