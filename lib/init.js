const err = require('../helpers/errorOutput')

const shell = require('shelljs')

module.exports = () => {
  // Check that Salesforce DX CLI is installed
  const result = shell.which('sfdx')
  if (!result) {
    console.error(
      err(
        `Salesforce DX CLI is not available in the current directory.
        Download and install it at https://developer.salesforce.com/tools/sfdxcli`
      )
    )

    process.exit(1)
  }
}
