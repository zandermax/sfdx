# **CONFIGURATION VALUES:**

All values may be overridden by placing any javasript-readable file in your projects `'config'` directory with a name containing `'sfdx'` (e.g. `'config/sfdx.js'` or `'config/sfdx-default.json'`, etc.)

## dxSourceDir _[ string ]_: Default Salesforce DX project source path

_*DEFAULT*_: config.projectPath + '/force-app/main/default'

## mdApiDir _[ string ]_: Directory to use for Metadata API converted source

_*DEFAULT*_: config.projectPath + '/mdapioutput'

## inactiveFlowsToKeep _[ integer ]_: Number of incative flow versions to keep

_*DEFAULT*_: 1

## projectDir _[ string ]_: Directory of SFDX project

_*DEFAULT*_: Current working directory

## projectPath _[ string ]_: Full Path of SFDX project

_*DEFAULT*_: Path of current working directory

## scratchDefFile _[ string ]_: Full path of default scratch org definition file

_*DEFAULT*_: config.projectPath + '/config/project-scratch-def.json'
