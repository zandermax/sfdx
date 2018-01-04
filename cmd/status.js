const shell = require('shelljs')

module.exports = {
  desc: 'Lists the status of a connected org.',
  command: ['status [alias|org|a] [remote|r] [local|l]'],
  aliases: ['check'],

  builder: yargs => {
    yargs
      .positional('orgname', {
        describe: 'Alias of the org of which to check status'
      })
      .option('alias', {
        alias: ['org', 'a'],
        describe: 'Alias of the org of which to check status'
      })
      .option('remote', {
        alias: ['r'],
        describe: 'Fetch only changes made remotely',
        conflicts: 'local'
      })
      .option('local', {
        alias: ['l'],
        describe: 'Fetch only changes in code locally',
        conflicts: 'remote'
      })
      .option('quiet', {
        alias: ['q'],
        describe: 'Quiet mode',
        type: 'boolean'
      })
  },

  handler: argv => {
    if (!argv) argv = {}
    const alias = argv.alias
    let output = 'Checking '
    let statusCommand = 'sfdx force:source:status'

    if (argv.remote) {
      output += 'remote '
      statusCommand += ' --remote'
    } else if (argv.local) {
      output += 'local '
      statusCommand += ' --local'
    } else {
      statusCommand += ' --all'
    }
    if (alias) statusCommand += ' --targetusername ' + alias

    output += 'status of ' + (alias ? "'" + alias + "'" : 'default org') + '...'
    if (!argv.quiet) shell.echo(output)

    const result = shell.exec(statusCommand)

    return result
  }
}
