const shell = require('shelljs')

module.exports = {
  desc: 'Connects an org to this project via web login.',
  command: ['login [orgname] [alias|org|a] [sandbox|sb|s]'],
  aliases: [],

  builder: yargs => {
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
      .option('quiet', {
        alias: ['q'],
        describe: 'Quiet mode',
        type: 'boolean'
      })
      .option('sandbox', {
        alias: ['sb', 's'],
        describe: 'Specifies if the org being logged into is a sandbox',
        type: 'boolean'
      })
  },

  handler: argv => {
    if (!argv) argv = {}
    const alias = argv.alias || argv.orgname
    const devhub = argv.devhub
    const sandbox = argv.sandbox

    if (!argv.quiet) {
      console.log(
        'Logging into ' + (argv.sandbox ? 'sandbox ' : '') + (alias ? "'" + alias + "'" : 'default org') + '...'
      )
    }

    const result = shell.exec(
      'sfdx force:auth:web:login ' +
        (alias ? '--setalias ' + alias : '--setdefaultusername') +
        (sandbox ? ' --instanceurl https://test.salesforce.com' : '') +
        (devhub ? ' --setdefaultdevhubusername' : '')
    )

    return result
  }
}
