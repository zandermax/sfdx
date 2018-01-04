const config = require('../config/config')

const joinPath = require('path').join
const shell = require('shelljs')

module.exports = {
  desc: 'Creates a new Salesforce DX project.',
  command: ['newproject [newprojectname] [projectname|name|n] [outputdirectory|dir|d]'],
  aliases: [],

  builder: yargs => {
    yargs
      .positional('newprojectname', {
        describe: 'Name of the new project to create'
      })
      .option('projectname', {
        alias: ['name', 'n'],
        describe: 'Name of the new project to create'
      })
      .option('outputdirectory', {
        alias: ['dir', 'd'],
        describe: 'Directory in which to create the new Salesforce DX project',
        default: config.get('projectPath')
      })
      .option('quiet', {
        alias: ['q'],
        describe: 'Quiet mode'
      })
  },

  handler: argv => {
    const dir = argv.outputdirectory || config.get('projectPath')
    const projectName = argv.projectname || argv.newprojectname || config.get('projectDir')

    if (!argv.quiet) console.log('Creating new Salesforce DX project named' + projectname + ' in ' + dir + '...')

    const result = shell.exec('sfdx force:project:create --projectname ' + projectName + ' --outputdir ' + dir)

    return result
  }
}
