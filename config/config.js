// Suppress warning in case the SFDX project does not override any variables
process.env.SUPPRESS_NO_CONFIG_WARNING = true

const config = require('config')
const joinPath = require('path').join
const fs = require('fs')
const shell = require('shelljs')

const configPath = __dirname
let configFileList = fs.readdirSync(configPath)

// sfdx default settings
for (let file of configFileList) {
  const configFile = require(joinPath(configPath, file))
  for (let prop in configFile) {
    config[prop] = configFile[prop]
  }
}

// Local, project-specific settings
const externalConfigPath = joinPath(shell.pwd().stdout, 'config')
let externalConfigFileList = fs.readdirSync(externalConfigPath)

externalConfigFileList = externalConfigFileList.filter(fileName => {
  return fileName.includes('sfdx')
})

for (let file of externalConfigFileList) {
  const extConfigFile = require(joinPath(externalConfigPath, file))
  for (let prop in extConfigFile) {
    config[prop] = extConfigFile[prop]
  }
}

module.exports = config
