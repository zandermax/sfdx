const yargsBuilder = require('../lib/yargsBuilder')

const err = require('../helpers/errorOutput')
const getResults = require('../helpers/compileResults')

const shell = require('shelljs')

module.exports = {
  desc: 'Sets the default developer hub org.',
  command: ['setdefaultdevhub [orgname] [alias|org|a]'],
  aliases: ['setdevhub', 'sdh'],

  builder: yargs => {
    yargs = yargsBuilder.builder(yargs)
    yargs
      .positional('orgname', {
        describe: 'Alias of the org to set as the default'
      })
      .option('alias', {
        alias: ['org', 'a'],
        describe: 'Alias of the org to set as the default'
      })
      .example('$0 setdevhub NewDevHub', "- Sets default developer hub org to 'NewDevHub'")
  },

  handler: argv => {
    argv = yargsBuilder.handler(argv)
    const alias = argv.alias || argv.orgname

    let numResults = 0
    const results = []
    if (!alias) {
      const errorMessage = err('No default developer hub specified.')
      results[numResults++] = {}
      results[numResults - 1].stderr = errorMessage
      if (!argv.quiet) console.error(errorMessage)
    } else {
      if (!argv.quiet) console.log("Setting default developer hub org to '" + alias + "'...")

      let setDevHubCommand = 'sfdx force:config:set defaultdevhubusername=' + alias
      if (argv.json) setDevHubCommand += ' --json'
      results[numResults++] = shell.exec(setDevHubCommand)
    }

    return getResults(results)
  }
}
