const config = require('../config/config')

const getResults = require('../helpers/compileResults')
const err = require('../helpers/errorOutput')

const shell = require('shelljs')

module.exports = {
  desc: 'Convert local DX code into metadata format.',
  command: ['convert [outputdirectory] [outputdir|dir|d]'],
  aliases: [],

  builder: yargs => {
    yargs
      .positional('outputdirectory', {
        describe: 'Directory in which to place converted code into'
      })
      .option('outputdir', {
        alias: ['dir', 'd'],
        describe: 'Directory in which to place converted code into'
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
      .example("$0 convert 'outputdir'", "- Converts local Salesforce DX code into the directory named 'outputdir/'")
  },

  handler: async argv => {
    if (!argv) argv = {}
    if (argv.json) argv.quiet = true
    const outputdir = argv.outputdir || argv.outputdirectory || config.mdApiDir

    if (!outputdir) {
      let errorMsg = err('No output directory specified.')
      if (!argv.quiet) console.error(errorMsg)
      return { stderr: errorMsg }
    }

    if (!argv.quiet) console.log('Converting local DX code into Metatdata API format...')

    let numResults = 0
    const results = []
    results[numResults++] = await shell.exec('rm -r -f "' + outputdir + '"')
    results[numResults++] = await shell.exec('mkdir "' + outputdir + '"')
    let convertCommand = 'sfdx force:source:convert --outputdir "' + outputdir + '"'
    if (argv.json) convertCommand += ' --json'
    results[numResults++] = await shell.exec(convertCommand)

    return getResults(results)
  }
}
