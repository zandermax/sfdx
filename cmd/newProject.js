const config = require('../config/config')
const joinPath = require('path').join

const shell = require('shelljs')

const defaultPath = joinPath(config.projectPath, '..')

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
        default: defaultPath
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
      .example('$0 newproject --name MyProject', "- Creates a new Salesforce DX project named 'MyProject'")
      .example(
        '$0 newproject NewProject --dir myDirectory',
        "- Creates a new Salesforce DX project named 'NewProject' in 'myDirectory/'"
      )
  },

  handler: argv => {
    if (!argv) argv = {}
    if (argv.json) argv.quiet = true

    let dir = argv.outputdirectory || config.projectPath
    let projectName = argv.projectname || argv.newprojectname
    // If a name is given, but not a directory, make sure to create a directory in the current one
    if (projectName && dir === defaultPath) {
      dir = shell.pwd().stdout
    } else {
      projectName = config.projectDir
    }

    if (!argv.quiet) console.log("reating new Salesforce DX project named '" + projectName + "' in " + dir + '...')

    let newProjectCommand = 'sfdx force:project:create --projectname ' + projectName + ' --outputdir ' + dir
    if (argv.json) newProjectCommand += ' --json'
    const result = shell.exec(newProjectCommand)

    return result
  }
}
