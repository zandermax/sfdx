## __CONFIGURATION VALUES:__

All values may be overridden by placing any file in your projects `'config'` directory with a name containing `'sfdx-ez'` (e.g. `'config/sfdx-ez.js'` or `'config/sfdx-ez-default.json'`, etc.)

## dxSourceDir *[ string ]*: Default Salesforce DX project source path
  _*DEFAULT*_: config.projectPath + '/force-app/main/default'

## mdApiDir *[ string ]*: Directory to use for Metadata API converted source
  _*DEFAULT*_: config.projectPath + '/mdapioutput'

## oldFlowsToKeep *[ integer ]*: Number of previous flow versions to keep
  _*DEFAULT*_: 1

## projectDir *[ string ]*: Directory of SFDX project
  _*DEFAULT*_: Current working directory

## projectPath *[ string ]*: Full Path of SFDX project
  _*DEFAULT*_: Path of current working directory

## scratchDefFile *[ string ]*: Full path of default scratch org definition file
  _*DEFAULT*_: config.projectPath + '/config/project-scratch-def.json'