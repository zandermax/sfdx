// Suppress warning in case the SFDX project does not override any variables
// process.env.SUPPRESS_NO_CONFIG_WARNING = true

const config = require('config')
const joinPath = require('path').join
const fs = require('fs')
const shell = require('shelljs')

const configPath = __dirname

// sfdx default settings
const mainDirExists = fs.existsSync(configPath)
console.log('checking path:', configPath)
if (mainDirExists) {
  console.log('main exists:', configPath)
  let configFileList = fs.readdirSync(configPath)
  for (let file of configFileList) {
    const configFile = require(joinPath(configPath, file))
    for (let prop in configFile) {
      config[prop] = configFile[prop]
    }
  }
  console.log('out of loop')
}
// Local, project-specific settings
// const localConfigPath = joinPath(shell.pwd().stdout, 'config')
// const localConfigExists = fs.existsSync(localConfigPath)
// if (fs.existsSync(localConfigPath)) {
  // console.log('local exists', localConfigPath)
  // let externalConfigFileList = []
  // externalConfigFileList = fs.readdirSync(localConfigPath)
  // externalConfigFileList = externalConfigFileList.filter(fileName => {
  //   return fileName.includes('sfdx')
  // })

  // for (let file of externalConfigFileList) {
  //   const extConfigFile = require(joinPath(localConfigPath, file))
  //   for (let prop in extConfigFile) {
  //     config[prop] = extConfigFile[prop]
  //   }
  // }
// }

module.exports = config
