const config = require('../config/config')

const getResults = require('../helpers/compileResults')

const convert = require('./convert').handler

const shell = require('shelljs')

module.exports = {
  desc: 'Deploys metadata code into an org.',
  command: ['deploy [deploytoalias] [deployto|to|t|a] [outputdir|dir|d]'],
  aliases: [],

  builder: yargs => {
    yargs
      .positional('deploytoalias', {
        describe: 'Alias of the org to deploy code into'
      })
      .option('deployto', {
        alias: ['to', 't', 'a'],
        describe: 'Alias of the org to deploy code into'
      })
      .option('outputdirectory', {
        alias: ['outputdir', 'dir', 'd'],
        describe: 'Directory containing the Metadata API source code to deploy',
        default: config.get('mdApiDir')
      })
      .option('quiet', {
        alias: ['q'],
        describe: 'Quiet mode',
        type: 'boolean'
      })
      .example('$0 deploy --deployto DeployTest', "- Deploys Metadata API code into org with the alias 'DeployTest'")
      .example("$0 deploy -a DeployTest -d myOutputDir", "- Deploys Metadata API code from the directory 'myOutputDir' into 'DeployTest'")
  },

  handler: argv => {
    if (!argv) argv = {}
    const alias = argv.deploytoalias || argv.deployto
    const outputdir = argv.outputdirectory || config.get('mdApiDir')

    if (!argv.quiet) {
      console.log('Deploying metadata into' + (alias ? " '" + alias + "'" : ' default org') + '...')
    }

    if (!argv.quiet) console.log()

    let numResults = 0
    const results = []
    results[numResults++] = shell.exec(
      'sfdx force:mdapi:deploy --deploydir ' + outputdir + (alias ? ' --targetusername ' + alias : '') + ' --wait 100'
    )

    // Do not delete converted code if there is an error
    if (!results[numResults - 1].stderr) results[numResults++] = shell.exec('rm -r -f ' + outputdir)

    return getResults(results)
  }
}
