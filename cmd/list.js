const shell = require('shelljs')

module.exports = {
  desc: 'Lists all connected orgs.',
  command: ['list'],
  aliases: ['ls', 'l'],

  builder: yargs => {
    yargs.option('quiet', {
      alias: ['q'],
      describe: 'Quiet mode',
      type: 'boolean'
    })
  },

  handler: argv => {
    if (!argv) argv = {}
    if (!argv.quiet) console.log('Getting list of connected orgs...')
    const result = shell.exec('sfdx force:org:list')
    return result
  }
}
