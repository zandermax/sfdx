const shell = require('shelljs')

module.exports = {
  desc: 'Opens the setup page of a connected org in a web browser.',
  command: ['open [alias|org|a]'],
  aliases: ['o'],

  builder: yargs => {
    yargs
      .positional('orgname', {
        describe: 'Alias of the org to open in the browser'
      })
      .option('alias', {
        alias: ['org', 'a'],
        describe: 'Alias of the org to open in the browser'
      })
      .option('quiet', {
        alias: ['q'],
        describe: 'Quiet mode',
        type: 'boolean'
      })
  },

  handler: argv => {
    if (!argv) argv = {}
    const alias = argv.alias || argv.orgname

    if (!argv.quiet) console.log('Opening ' + (alias ? "'" + alias + "'" : 'default org') + '...')

    const result = shell.exec(
      'sfdx force:org:open ' + (alias ? '--targetusername ' + alias : '') + ' --path one/one.app#/setup/home'
    )

    return result
  }
}
