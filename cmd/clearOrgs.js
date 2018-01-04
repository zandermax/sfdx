const config = require('../config/config')

const deleteOrgs = require('./delete').handler

const fs = require('fs')
const inquirer = require('inquirer')
const joinPath = require('path').join
const shell = require('shelljs')

module.exports = {
  desc: 'Deletes all non-default scratch orgs without given aliases.',
  command: ['clearorgs [force|f]'],
  aliases: ['cl'],

  builder: yargs => {
    yargs
      .option('force', {
        alias: ['f'],
        describe: 'Do not confirm deletion of orgs',
        type: 'boolean'
      })
      .option('quiet', {
        alias: ['q'],
        describe: 'Quiet mode'
      })
  },

  handler: argv => {
    if (!argv.quiet) console.log('Checking the list of scratch orgs...')

    const today = new Date()
    const outputfile = joinPath(
      config.get('projectPath'),
      'orglist-' + today.getHours() + today.getMinutes() + today.getSeconds() + '.json'
    )

    shell.exec('sfdx force:org:list --clean --noprompt --json > ' + outputfile)
    const output = fs.readFileSync(outputfile)
    const parsed = JSON.parse(output)
    const scratchOrgs = parsed.result.scratchOrgs

    // Remove output file at this point since it is no longer needed
    shell.exec('rm -rf ' + outputfile)

    let areOrgsToDelete = false
    let numOrgsToDelete = 0
    function checkOrgs (org) {
      const deletable = !org.alias && !org.isDefaultUsername
      if (deletable) {
        if (!areOrgsToDelete) {
          if (!argv.quiet) {
            console.log()
            console.log('\tScratch orgs to be deleted:')
          }
          areOrgsToDelete = true
        }
        if (!argv.quiet) console.log('\t' + (numOrgsToDelete + 1) + ':\t' + org.username)
        numOrgsToDelete += 1
      }
      return deletable
    }

    let orgsToDelete = scratchOrgs.filter(checkOrgs).map(org => {
      return org.username
    })

    if (!areOrgsToDelete) {
      if (!argv.quiet) console.log('No un-named non-default scratch orgs.')
      return
    }

    const deleteConfirmed = 'deleteAll'

    argv.alias = orgsToDelete

    if (!argv.force) {
      inquirer
        .prompt({
          default: false,
          message: 'Are you sure you want to delete all un-named non-default scratch orgs?',
          name: deleteConfirmed,
          type: 'confirm'
        })
        .then(answers => {
          if (answers[deleteConfirmed]) {
            argv.force = true
            deleteOrgs(argv)
          }
        })
    } else {
      deleteOrgs(argv)
    }
  }
}
