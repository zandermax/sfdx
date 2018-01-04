const config = require('../config/config')

const getResults = require('../helpers/compileResults')

const fs = require('fs')
const joinPath = require('path').join
const jsonfile = require('jsonfile')
const shell = require('shelljs')

module.exports = {
  desc: 'Updates the local verison of SFDX CLI and documentation.',
  command: ['update [nolocal|n]'],
  aliases: ['u'],

  builder: yargs => {
    yargs
      .option('nolocal', {
        alias: ['n'],
        describe: 'Do not store local help files'
      })
      .option('quiet', {
        alias: ['q'],
        describe: 'Quiet mode',
        type: 'boolean'
      })
  },

  handler: argv => {
    let numResults = 0
    const results = []

    results[numResults++] = shell.exec('sfdx update')

    if (!argv.nolocal) {
      const helpFile = joinPath(config.get('projectPath'), 'docs', 'sfdx-help.txt')
      const refFile = joinPath(config.get('projectPath'), 'docs', 'sfdx-ref.txt')

      if (!argv.quiet) console.log('Updating SFDX CLI reference file...')
      shell.exec('sfdx force:doc:commands:list > ' + refFile)

      results[numResults++] = outputFile()

      if (!argv.quiet) console.log('Updating SFDX CLI help file...')
      results[numResults++] = shell.exec('sfdx force:doc:commands:display > ' + helpFile)
    }

    return getResults(results)
  }
}

async function outputFile () {
  let numResults = 0
  const results = []
  const today = new Date()
  const outputfile = joinPath(
    config.get('projectPath'),
    'docs',
    'sfdx-help-unformatted' + '-' + today.getHours() + today.getMinutes() + today.getSeconds() + '.json'
  )
  const newfile = joinPath(config.get('projectPath'), 'docs', 'sfdx-help-extended.json')
  results[numResults++] = await shell.exec('sfdx force:doc:commands:display --json > ' + outputfile)

  await jsonfile.writeFileSync(newfile, jsonfile.readFileSync(outputfile), { spaces: 2 }, err => {
    console.error(err)
    process.exit(1)
  })

  results[numResults++] = shell.exec('rm -rf ' + outputfile)

  const result = getResults(results)
  if (result.stderr) {
    console.error(err('Unable to complete update.'))
  } else {
    console.log('Update completed.')
  }

  return result
}
