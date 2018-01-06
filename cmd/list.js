const shell = require('shelljs')

module.exports = {
  desc: 'Lists all connected orgs.',
  command: ['list'],
  aliases: ['ls', 'l'],

  builder: yargs => {
    yargs
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
      .example('$0 list', '- Lists all connected orgs')
  },

  handler: argv => {
    if (!argv) argv = {}
    if (argv.json) argv.quiet = true
    if (!argv.quiet) console.log('Getting list of connected orgs...')

    let listCommand = 'sfdx force:org:list'
    if (argv.json) listCommand += ' --json'
    const result = shell.exec(listCommand)

    return result
  }
}
