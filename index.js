const COMMAND_DIR = 'cmd'

const config = require('./config/config')
const fs = require('fs')
const joinPath = require('path').join
const modulePath = joinPath(__dirname, COMMAND_DIR)

const fileList = fs.readdirSync(modulePath)

const fileName = /.*(?=\.)/

// Export all commands
for (file of fileList) {
  // Skip hidden files
  if (file.startsWith('.')) continue

  const exportFile = require(joinPath(modulePath, file))
  const exportFunction = fileName.exec(file)[0]

  // Create Promise for every command, so that they may be used asynchronously
  module.exports[exportFunction] = async argv => {
    const result = await exportFile.handler(argv)
    return new Promise(resolve => {
      resolve(result)
    })
  }

  module.exports[exportFunction]

  module.exports[exportFunction].yargs = exportFile
}
