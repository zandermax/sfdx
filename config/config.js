const joinPath = require('path').join
const fs = require('fs')
const shell = require('shelljs')

const localConfigPath = joinPath(shell.pwd().stdout, 'config')

// Load default config
const config = require('./default')

// Load all local files
let externalConfigFileList = []
if (fs.existsSync(localConfigPath)) {
  externalConfigFileList = fs.readdirSync(localConfigPath)
  externalConfigFileList = externalConfigFileList.filter(fileName => {
    return fileName.includes('sfdx')
  })
}

for (let file of externalConfigFileList) {
  const configFile = require(joinPath(localConfigPath, file))
  for (let prop in configFile) {
    config[prop] = configFile[prop]
  }
}

module.exports = config
