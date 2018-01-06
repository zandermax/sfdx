// Suppress warning in case the SFDX project does not override any variables
process.env.SUPPRESS_NO_CONFIG_WARNING = true

const config = require('config')
const joinPath = require('path').join
const fs = require('fs')
const shell = require('shelljs')

const configPath = __dirname

// sfdx default settings
const mainDirExists = fs.existsSync(configPath)
if (mainDirExists) {
  let configFileList = fs.readdirSync(configPath)
  for (let file of configFileList) {
    const configFile = require(joinPath(configPath, file))
    for (let prop in configFile) {
      config[prop] = configFile[prop]
    }
  }
}
// Local, project-specific settings

const localConfigExists = fs.existsSync(joinPath(shell.pwd().stdout, 'config'))
if (localConfigExists) {
  const externalConfigPath = joinPath(shell.pwd().stdout, 'config')
  let externalConfigFileList = []
  externalConfigFileList = fs.readdirSync(externalConfigPath)
  externalConfigFileList = externalConfigFileList.filter(fileName => {
    return fileName.includes('sfdx')
  })

  for (let file of externalConfigFileList) {
    const extConfigFile = require(joinPath(externalConfigPath, file))
    for (let prop in extConfigFile) {
      config[prop] = extConfigFile[prop]
    }
  }
}

module.exports = config
