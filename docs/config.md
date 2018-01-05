# __CONFIGURATION VALUES:__

All values may be overridden by placing any file in your projects `'config'` directory with a name containing `'sfdx'` (e.g. `'config/sfdx.js'` or `'config/sfdx-default.json'`, etc.)

This uses the [config](https://github.com/lorenwest/node-config) package, so follow the guidelines for configuration files outlined by its documentation (i.e., make sure to export values if using a javascript file, etc.).

## dxSourceDir *[ string ]*: Default Salesforce DX project source path

  _*DEFAULT*_: config.projectPath + '/force-app/main/default'

## mdApiDir *[ string ]*: Directory to use for Metadata API converted source

  _*DEFAULT*_: config.projectPath + '/mdapioutput'

## inactiveFlowsToKeep *[ integer ]*: Number of incative flow versions to keep

  _*DEFAULT*_: 1

## projectDir *[ string ]*: Directory of SFDX project

  _*DEFAULT*_: Current working directory

## projectPath *[ string ]*: Full Path of SFDX project

  _*DEFAULT*_: Path of current working directory

## scratchDefFile *[ string ]*: Full path of default scratch org definition file

  _*DEFAULT*_: config.projectPath + '/config/project-scratch-def.json'