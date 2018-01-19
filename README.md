# sfdx

[![NPM version][npm-version-image]][npm-version-url]
[![NPM version][npm-downloads-image]][npm-downloads-url]

[npm-downloads-url]: https://www.npmjs.com/package/sfdx
[npm-downloads-image]: https://img.shields.io/npm/dt/sfdx.svg
[npm-version-url]: https://www.npmjs.com/package/sfdx
[npm-version-image]: https://img.shields.io/npm/v/sfdx.svg

sfdx is a node module used to interact with Salesforce DX commands, hopefully in a more intuitive way than with the DX CLI itself. sfdx is meant to take some of the nuances of using Salesforce DX and make common operations easier.

## Installation

Make sure you have the [Salesforce DX CLI](https://developer.salesforce.com/tools/sfdxcli) installed first! This module will let you know if you don't, but it will leave it up to you to actually install it.

```bash
npm i sfdx --save
```

## Examples

(Sample project [here](https://github.com/axlemax/sfdx-example).)

Here is a function that one might use to spin up an org and push code into it:

````javascript
const sfdx = require('sfdx')

// options - all options to use for the relevant commands
//   (see sfdx config documentation)
function spinup(options) {
  // Create a new scratch org
  sfdx.create(options)
  // Push local code into the newly-created scratch org
  sfdx.push(options)
  // Open the newly-created scratch org in a browser window
  sfdx.open(options)
}
````

As another example, here is a function that pulls code from a scratch org, converts the local Salesforce DX code into Metadata API format, and deploys the converted code into a production (i.e. non-scratch) org.

````javascript
const sfdx = require('sfdx')

// options - all options to use for the relevant commands
//   (see sfdx config documentation)
function toproduction(options) {
  // Pull code from the scratch org
  sfdx.pull(options)
  // Convert local Salesforce DX code into Metadata API format
  sfdx.convert(options)
  // Deploy the formatted code into a non-scratch org
  //   'deployto' specifies to deploy to the org named 'MySandbox'
  sfdx.deploy({
    deployto: 'MySandbox'
  })
}
````

## To import all commands to be used in a CLI

  > All of the commands have a relevant terminal command (*including shortcuts!*), thanks to [yargs](https://github.com/yargs/yargs). To import all of them, simply use the `.yargs` property of each to create the relevant command.

For example, to import all of the commands, do the following (ensure you have [yargs](https://github.com/yargs/yargs) installed):

````javascript
#!/usr/bin/env node

const sfdx = require('sfdx')
const yargs = require('yargs')

// Import all commands
for (let command of Object.keys(sfdx)) {
  yargs.command(sfdx[command].yargs)
}

// Initialize yargs commands
yargs.argv
````

Then, if you save that file as `"cli.js"` and you add something like the following to your `package.json` and then run `"npm link"`, the command `"dx l"` will list all connected orgs (for example)!

````json
...
"bin": {
    "dx": "cli.js"
  },
...
````

## Help / Documentation

* [Node command API reference here](https://github.com/axlemax/sfdx/blob/master/docs/api.md).
* [Configuration values reference here](https://github.com/axlemax/sfdx/blob/master/docs/config.md).

** For help with the terminal commands, which includes seeing a command's shortcuts, use `--help` (or `-h`) on any command. To see help for ALL commands, use `--help` (or `-h`) on the root command (for example `dx -h`)!
