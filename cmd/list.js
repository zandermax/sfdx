const yargsBuilder = require('../lib/yargsBuilder')

const shell = require('shelljs')

module.exports = {
  desc: 'Lists all connected orgs.',
  command: ['list'],
  aliases: ['ls', 'l'],

  builder: yargs => {
    yargs = yargsBuilder.builder(yargs)
    yargs
      .example('$0 list', '- Lists all connected orgs')
  },

  handler: argv => {
    argv = yargsBuilder.handler(argv)
    if (!argv.quiet) console.log('Getting list of connected orgs...')

    let listCommand = 'sfdx force:org:list'
    if (argv.json) listCommand += ' --json'
    const result = shell.exec(listCommand)

    return result
  }
}
