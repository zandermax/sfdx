const joinPath = require('path').join
const shell = require('shelljs')

const regex = /[^\/]+/g
const projectPath = shell.pwd().stdout
const match = projectPath.match(regex)
const projectDir = match.pop()

module.exports = {
  // Default Salesforce DX project source path
  // DEFAULT: config.projectPath + '/force-app/main/default'
  dxSourceDir: joinPath(projectPath, 'force-app', 'main', 'default'),

  // Directory to use for Metadata API converted source
  // DEFAULT: config.projectPath + '/mdapioutput'
  mdApiDir: joinPath(projectPath, 'mdapioutput'),

  // Number of previous flow versions to keep
  oldFlowsToKeep: 1,

  // Directory of SFDX project
  // DEFAULT: Current working directory
  projectDir: projectDir,

  // Full Path of SFDX project
  // DEFAULT: Path of current working directory
  projectPath: projectPath,

  // Used for console alert output
  stars: ' ***** ',

  // Full path of default scratch org definition file
  // DEFAULT: config.projectPath + '/config/project-scratch-def.json'
  scratchDefFile: joinPath(projectPath, 'config', 'project-scratch-def.json'),

}
