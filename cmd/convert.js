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
      .option('quiet', {
        alias: ['q'],
        describe: 'Quiet mode'
      })
  },

  handler: async argv => {
    const outputdir = argv.outputdir || argv.outputdirectory || config.mdApiDir

    if (!outputdir) {
      console.error(err('No output directory specified.'))
      process.exit(1)
    }

    if (!argv.quiet) console.log('Converting local DX code into Metatdata API format...')

    let numResults = 0
    const results = []
    results[numResults++] = await shell.exec('rm -r -f "' + outputdir + '"')
    results[numResults++] = await shell.exec('mkdir "' + outputdir + '"')
    results[numResults++] = await shell.exec('sfdx force:source:convert --outputdir "' + outputdir + '"')

    return getResults(results)
  }
}
