const joinPath = require('path').join
const shell = require('shelljs')

const regex = /[^\/]+/g
const projectPath = shell.pwd().stdout
const match = projectPath.match(regex)
const projectDir = match.pop()

module.exports = {
  /**
   * Default Salesforce DX project source path
   * @default config.projectPath + '/force-app/main/default'
   */
  dxSourceDir: joinPath(projectPath, 'force-app', 'main', 'default'),

  /**
   *  Directory to use for Metadata API converted source
   * @default config.projectPath + '/mdapioutput'
  */
  mdApiDir: joinPath(projectPath, 'mdapioutput'),

  /**
   * Number of inactive flow versions to keep
   * @default 1
   */
  inactiveFlowsToKeep: 1,

  /**
   * Directory of SFDX project.
   * @default Current working directory
   */
  projectDir: projectDir,

  /**
   * Full Path of SFDX project
   * @default Path of current working directory
   */
  projectPath: projectPath,

  /**
   * Used for console alert output
   */
  stars: ' ***** ',

  /**
   * Full path of default scratch org definition file
  * @default config.projectPath + '/config/project-scratch-def.json'
  */
  scratchDefFile: joinPath(projectPath, 'config', 'project-scratch-def.json'),

}
