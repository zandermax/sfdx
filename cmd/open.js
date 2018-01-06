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
      .example('$0 o MyOrg', "- Opens the org with alias 'MyOrg'")
      .example('$0 open --alias MyOtherOrg', "- Opens the org with alias 'MyOtherOrg'")
  },

  handler: argv => {
    if (!argv) argv = {}
    if (argv.json) argv.quiet = true
    const alias = argv.alias || argv.orgname

    if (!argv.quiet) console.log('Opening ' + (alias ? "'" + alias + "'" : 'default org') + '...')

    let openCommand =
      'sfdx force:org:open ' + (alias ? '--targetusername ' + alias : '') + ' --path one/one.app#/setup/home'
    if (argv.json) openCommand += ' --json'
    const result = shell.exec(openCommand)

    return result
  }
}
