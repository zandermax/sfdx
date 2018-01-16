const shell = require('shelljs')

function checkSilent (argv) {
  shell.config.silent = argv.silent || false
}

module.exports.handler = argv => {
  argv = argv || {}
  if (argv !== {}) {
    checkSilent(argv)
    if (argv.silent) {
      argv.quiet = true
    }
    // Check for JSON option after setting shell to silent, since
    // JSON option requires output from the shell
    if (argv.json) argv.quiet = true
  }
  return argv
}

module.exports.builder = yargs => {
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
    .version(false)
    .help()
    .alias('h', 'help')
    .strict()

  return yargs
}
