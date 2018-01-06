const config = require('../config/config')

const getResults = require('../helpers/compileResults')

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
      .example('$0 deploy --deployto DeployTest', "- Deploys Metadata API code into org with the alias 'DeployTest'")
      .example(
        '$0 deploy -a DeployTest -d myOutputDir',
        "- Deploys Metadata API code from the directory 'myOutputDir' into 'DeployTest'"
      )
  },

  handler: argv => {
    if (!argv) argv = {}
    if (argv.json) argv.quiet = true
    const alias = argv.deploytoalias || argv.deployto
    const outputdir = argv.outputdirectory || config.get('mdApiDir')

    if (!argv.quiet) {
      console.log('Deploying metadata into' + (alias ? " '" + alias + "'" : ' default org') + '...')
    }

    if (!argv.quiet) console.log()

    let numResults = 0
    const results = []
    let deployCommand =
      'sfdx force:mdapi:deploy --deploydir ' + outputdir + (alias ? ' --targetusername ' + alias : '') + ' --wait 100'
    if (argv.json) deployCommand += ' --json'
    results[numResults++] = shell.exec(deployCommand)

    // Do not delete converted code if there is an error
    if (!results[numResults - 1].stderr) results[numResults++] = shell.exec('rm -r -f ' + outputdir)

    return getResults(results)
  }
}
