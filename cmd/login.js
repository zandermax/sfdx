const yargsBuilder = require('../lib/yargsBuilder')

const shell = require('shelljs')

module.exports = {
  desc: 'Connects an org to this project via web login.',
  command: ['login [orgname] [alias|org|a] [sandbox|sb|s]'],
  aliases: [],

  builder: yargs => {
    yargs = yargsBuilder.builder(yargs)
    yargs
      .positional('orgname', {
        describe: 'Alias of the org to log into'
      })
      .option('alias', {
        alias: ['org', 'a'],
        describe: 'Alias of the org to log into'
      })
      .option('devhub', {
        alias: ['d'],
        describe: 'Specifies if the org being logged into is the new default DevHub',
        type: 'boolean'
      })
      .option('sandbox', {
        alias: ['sb', 's'],
        describe: 'Specifies if the org being logged into is a sandbox',
        type: 'boolean'
      })
      .example('$0 login', '- Logs in to a new org, setting it as the default scratch org')
      .example('$0 login MyOrg', "- Logs in to an org and names it 'MyOrg'")
      .example('$0 login --alias SandboxOrg --sandbox', "- Logs in to sandbox org named 'SandboxOrg'")
      .example('$0 login DevHub --devhub', '- Logs in to an org and sets it as the default developer hub')
  },

  handler: argv => {
    argv = yargsBuilder.handler(argv)
    const alias = argv.alias || argv.orgname
    const devhub = argv.devhub
    const sandbox = argv.sandbox

    if (!argv.quiet) {
      console.log(
        'Logging into ' + (argv.sandbox ? 'sandbox ' : '') + (alias ? "'" + alias + "'" : 'default org') + '...'
      )
    }

    let loginCommand =
      'sfdx force:auth:web:login ' +
      (alias ? '--setalias ' + alias : '--setdefaultusername') +
      (sandbox ? ' --instanceurl https://test.salesforce.com' : '') +
      (devhub ? ' --setdefaultdevhubusername' : '')
    if (argv.json) loginCommand += ' --json'
    const result = shell.exec(loginCommand)

    return result
  }
}
