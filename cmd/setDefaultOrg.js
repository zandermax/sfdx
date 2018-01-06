const err = require('../helpers/errorOutput')
const getResults = require('../helpers/compileResults')

const shell = require('shelljs')

module.exports = {
  desc: 'Sets the default scratch org.',
  command: ['setdefaultorg [orgname] [alias|org|a]'],
  aliases: ['sdo'],

  builder: yargs => {
    yargs
      .positional('orgname', {
        describe: 'Alias of the org to set as the default'
      })
      .option('alias', {
        alias: ['org', 'a'],
        describe: 'Alias of the org to set as the default'
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
      .example('$0 sdo NewOrg', "- Sets default scratch org to 'NewOrg'")
  },

  handler: argv => {
    if (!argv) argv = {}
    if (argv.json) argv.quiet = true
    const alias = argv.alias || argv.orgname

    let numResults = 0
    const results = []
    if (!alias) {
      const errorMessage = err('No default org specified.')
      results[numResults++] = {}
      results[numResults - 1].stderr = errorMessage
      console.error(errorMessage)
    } else {
      if (!argv.quiet) console.log("Setting default scratch org to '" + alias + "'...")

      let setUserCommand = 'sfdx force:config:set defaultusername=' + alias
      if (argv.json) setUserCommand += ' --json'
      results[numResults++] = shell.exec(setUserCommand)
    }

    return getResults(results)
  }
}
