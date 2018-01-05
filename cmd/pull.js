const shell = require('shelljs')

module.exports = {
  desc: 'Pull code from a scratch org.',
  command: ['pull [pullfrom|from|a] [forceoverwrite|force|f]'],
  aliases: [],

  builder: yargs => {
    yargs
      .positional('orgname', {
        describe: 'Alias of the scratch org to pull code from'
      })
      .option('pullfrom', {
        alias: ['from', 'a'],
        describe: 'Alias of the scratch org to pull code from'
      })
      .option('forceoverwrite', {
        alias: ['force', 'f'],
        describe: 'Force the remote code to overwrite local changes',
        type: 'boolean'
      })
      .option('quiet', {
        alias: ['q'],
        describe: 'Quiet mode',
        type: 'boolean'
      })
      .example('$0 pull --pullfrom MyOrg', "- Pulls source from 'MyOrg'")
      .example('$0 pull MyOrg -f', "- Forcibly pulls source from 'MyOrg'")
  },

  handler: argv => {
    if (!argv) argv = {}
    const alias = argv.alias || argv.pullfrom
    const force = argv.force

    if (!argv.quiet) {
      console.log(
        (argv.force ? 'Force pulling ' : 'Pulling ') + 'code from ' + (alias ? "'" + alias : 'default org') + '...'
      )
    }

    let pullCommand = 'sfdx force:source:pull'
    if (force) pullCommand += ' --forceoverwrite'
    if (alias) pullCommand += ' --targetusername ' + alias

    if (!argv.quiet) console.log()
    const result = shell.exec(pullCommand)

    return result
  }
}
