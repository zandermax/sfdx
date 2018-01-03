# sfdx-ez

sfdx-ez is a node module used to interact with Salesforce DX commands, hopefully in a more intuitive way than with the DX CLI itself. sfdx-ez is meant to take some of the nuances of using Salesforce DX and make common operations easier.

## Installation

```bash
npm i sfdx-ez --save
```

## Examples
Here is a function that one might use to spin up an org and push code into it:
````javascript
const dxez = require('sfdx-ez')

// argv - all options to use for the relevant commands (see sfdx-ez API)
function spinup(argv) {
  // Create a new scratch org
  dxez.create(argv)
  // Push local code into the newly-created scratch org
  dxez.push(argv)
  // Open the newly-created scratch org in a browser window
  dxez.open(argv)
}
````

As another example, here is a function that pulls code from a scratch org, converts the local Salesforce DX code into Metadata API format, and deploys the converted code into a production (i.e. non-scratch) org.
````javascript
const dxez = require('sfdx-ez')

// argv - all options to use for the relevant commands (see sfdx-ez API)
function toproduction(argv) {
  // Pull code from the scratch org
  dxez.pull(argv)
  // Convert local Salesforce DX code into Metatdata API format
  dxez.convert(argv)
  // Deploy the formatted code into a non-scratch org named 'MySandbox'
  dxez.deploy({
    deployto: 'MySandbox'
  })
}
````

## To import all commands to be used in a CLI

  > All of the commands have a relevant terminal command (*including shortcuts!*), thanks to [yargs](https://github.com/yargs/yargs). To import all of them, simply use the `.yargs` property of each to create the relevant command.

For example, to import all of the commands, do the following (ensure you have [yargs](https://github.com/yargs/yargs) installed):

````javascript
#!/usr/bin/env node

const dxez = require('sfdx-ez')
const yargs = require('yargs')

// Import all commands
for (command of Object.keys(dxez)) {
  yargs.command(dxez[command].yargs)
}

// Add help option
yargs
  .help()
  .alias('h', 'help').argv
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
* [Node command API reference here](https://github.com/axlemax/sfdx-ez/blob/master/docs/api.md).
* [Configuration values reference here](https://github.com/axlemax/sfdx-ez/blob/master/docs/config.md).

** For help with the terminal commands, which includes seeing a command's shortcuts, use `--help` (or `-h`) on any command. To see help for ALL commands, use `--help` (or `-h`) on the root command (for example `dx -h`)!
