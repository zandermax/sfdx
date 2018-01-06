const config = require('../config/config')

const getResults = require('../helpers/compileResults')
const err = require('../helpers/errorOutput')

const isArray = require('util').isArray
const shell = require('shelljs')

module.exports = {
  desc: 'Create new scratch org(s).',
  command: ['create [orgname] [alias|org|name|a] [days|d] [definitionfile|def|e]'],
  aliases: ['n'],

  builder: yargs => {
    yargs
      .positional('orgname', {
        describe: 'Alias of the org to create'
      })
      .option('alias', {
        alias: ['org', 'name', 'a'],
        describe: 'Alias(es) of the org(s) to create',
        type: 'array'
      })
      .option('days', {
        alias: ['d'],
        describe: 'Number of days before the org expires (max 30)',
        type: 'number'
      })
      .option('definitionfile', {
        alias: ['def', 'e'],
        default: config.get('scratchDefFile'),
        describe: 'Definition file to use when creating the org'
      })
      .option('defaultorg', {
        alias: ['f'],
        describe: 'Sets the newly-created scratch org as the default',
        type: 'boolean'
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
      .example(
        '$0 create --alias NewOrg --days 8',
        "- Creates a new scratch org with the alias 'NewOrg' that will expire in 8 days"
      )
      .example(
        "$0 n --def 'config/mydeffile.json'",
        "- Creates a new defalt scratch org using definition file 'config/mydeffile.json'"
      )
      .example('$0 n', '- Creates a new default scratch org with no alias')
  },

  handler: argv => {
    if (!argv) argv = {}
    if (argv.json) argv.quiet = true
    const orgList = argv.alias || argv.orgname

    if (isArray(argv.alias)) {
      let results = []
      for (let org of orgList) {
        results.push(createOrg(org, argv))
      }
      return getResults(results)
    } else {
      return createOrg(argv.alias, argv)
    }
  }
}

function createOrg (orgname, argv) {
  const alias = orgname || argv.alias
  const days = argv.days
  const defFile = argv.definitionfile || config.get('scratchDefFile')

  if (!argv.quiet) {
    let output = 'Creating new scratch org'
    output += alias ? " named '" + alias + "'" : ' and setting it as the default scratch org'
    output += argv.defaultorg && alias ? ' and setting it as the default scratch org' : ''
    output += days ? ' that will expire after ' + days + (days > 1 ? ' days' : ' day') : ''
    output += '...'
    console.log(output)
  }

  let numResults = 0
  const results = []
  let createCommand = 'sfdx force:org:create' + (days ? ' --durationdays ' + days : '') + ' --definitionfile ' + defFile
  createCommand += alias ? ' --setalias ' + alias : ''
  if (!alias || argv.defaultorg) createCommand += ' --setdefaultusername'
  if (argv.json) createCommand += ' --json'

  results[numResults++] = shell.exec(createCommand)

  if (results[numResults - 1].stderr || results[numResults - 1].stdout.indexOf('ERROR') != -1) {
    console.error(
      err('Could not create a new scratch org. Please ensure that the default developer hub is configured properly.')
    )
    process.exit(1)
  } else {
    if (!argv.quiet) console.log('Generating user password' + (alias ? " for org '" + alias + "'" : '') + '...')

    // Supress output of user password, since it displays redundant information
    const silentState = shell.config.silent
    shell.config.silent = true
    results[numResults++] = shell.exec('sfdx force:user:password:generate')
    shell.config.silent = silentState // restore old silent state

    if (!argv.quiet) console.log()
  }

  return getResults(results)
}
