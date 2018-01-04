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
      .option('quiet', {
        alias: ['q'],
        describe: 'Quiet mode',
        type: 'boolean'
      })
  },

  handler: argv => {
    const orgList = argv.alias || argv.orgname

    if (isArray(argv.alias)) {
      let results = []
      for (org of orgList) {
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
    console.log(
      'Creating new scratch org' +
        (alias ? " named '" + alias + "'" : ' and setting it as the default scratch org') +
        (days ? ' that will expire after ' + days + (days > 1 ? ' days' : ' day') : '') +
        '...'
    )
  }

  let numResults = 0
  const results = []
  results[numResults++] = shell.exec(
    'sfdx force:org:create' +
      (days ? ' --durationdays ' + days : '') +
      ' --definitionfile ' +
      defFile +
      (alias ? ' --setalias ' + alias : ' --setdefaultusername')
  )

  if (results[numResults - 1].stderr || results[numResults - 1].stdout.indexOf('ERROR') != -1) {
    console.error(
      err('Could not create a new scratch org. Please ensure that the default developer hub is configured properly.')
    )
    process.exit(1)
  } else {
    if (!argv.quiet) console.log('Generating user password' + (alias ? " for org '" + alias + "'" : '') + '...')
    results[numResults++] = shell.exec('sfdx force:user:password:generate > /dev/null')
    if (!argv.quiet) console.log()
  }

  return getResults(results)
}
