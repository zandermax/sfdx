Also see configuration values [here](/docs/config.md).

## __ALL COMMANDS:__
###  _`RETURN VALUE`_ - All functions return a [shelljs](https://github.com/yargs/yargs) object:

  `result: {`

  `code: [ string ] : - exit code of shell commands that were executed`

  `stdout: [ string ] : - stdout result of shell commands that were executed`

  `stderr: [ string ] : - stderr result of shell commands that were executed`

  `}`

### Global Options

  These options can be applied to any command:

  `options.quiet` *[ boolean ]* - Supress output

## clearOrgs( _options_ ): Deletes all non-default scratch orgs without given aliases.
  `options.force` *[ boolean ]* - Do not confirm deletion of orgs

## convert( _options_ ): Convert local DX code into metadata format.
  `options.outputdirectory` *[ string ]* - Directory to use for converted code output ( _*DEFAULT*_: _config.mdApiDir_ )

## create( _options_ ): Create new scratch org(s).
  `options.alias | options.alias[]` *[ string | string[ ] ]* - Alias(es) of the org(s) to create

  `options.days` *[ integer ]* - Number of days before the org expires (max 30)

  `options.definitionfile` *[ string ]* - Definition file to use when creating the org ( _*DEFAULT*_: _config.scratchDefFile_ )

## delete( _orgList_, _options_ ): Deletes scratch org(s).
  **[REQUIRED]** `orgList | orgList[]` *[ string | string[ ] ]*- Alias(es) (or username(s)) of the org(s) to delete

  `options.force` *[ boolean ]* - Delete the org(s) without prompt ( _*DEFAULT*_: false)

## deploy( _options_ ): Deploys metadata code into an org.
  `options.alias` *[ string ]* - Alias of the org to deploy code into

  `options.outputdirectory` *[ string ]* - Directory containing the Metadata API source code to deploy ( _*DEFAULT*_: _config.mdApiDir_ )

## deployFlows( _options_ ): Deploys the flows to an org, ensuring that only one version is deployed and active.
  `options.alias` *[ string ]* - Alias of the org to deploy code into

  `options.forcedelete` *[ boolean ]* - Attempt to force delete any flow versions that are out-of-date ( _*DEFAULT*_: false)

  `options.forcepush` *[ boolean ]* - Attempt to force overwrite remote code with local changes ( _*DEFAULT*_: false)

## list( ): Lists all connected orgs.

## login( _options_ ): Connects an org to this project via web login.
  `options.alias` *[ string ]* - Alias of the org to log into

  `options.devhub` *[ boolean ]* - Specifies if the org being logged into is the new default DevHub ( _*DEFAULT*_: false)

  `options.sandbox` *[ boolean ]* - Specifies if the org being logged into is a sandbox ( _*DEFAULT*_: false)

## newProject( _options_ ): Creates a new Salesforce DX project.
  `options.outputdirectory` *[ string ]* - Directory in which to create the new Salesforce DX project ( _*DEFAULT*_: _config.projectPath_ )

  `options.projectname` *[ string ]* - Name of the new project to create ( _*DEFAULT*_: _config.projectDir_ )

## open( _options_ ): Opens the setup page of a connected org in a web browser.
  `options.alias` *[ string ]* - Alias of the org to open in the browser

## orgInfo( _options_ ): Gets info about an org.
  `options.alias` *[ string ]* - Alias of the org to retrieve info on

  `options.user` *[ boolean ]* - Also retrieve info on the default user

## pull( _options_ ): Pull code from a scratch org.
  `options.alias | options.pullfrom` *[ string ]*- Alias of the scratch org to pull code from

  `options.force` *[ boolean ]* - Force the remote code to overwrite local changes ( _*DEFAULT*_: false)

  ## push( _options_ ): Push local code to a scratch org.
  `options.alias | options.pushto` *[ string ]* - Alias of the scratch org to push code into

  `options.force` *[ boolean ]* - Force the local code to overwrite remote changes ( _*DEFAULT*_: false)

  `options.noflows` *[ boolean ]* - Do not check for updated flow versions ( _*DEFAULT*_: false)

## setDefaultDevHub( _options_ ): Sets the default developer hub org.
  **[REQUIRED]** `options.alias` *[ string ]*- Alias of the org to set as the default

## setDefaultOrg( _options_ ): Sets the default scratch org.
  **[REQUIRED]** `options.alias` *[ string ]*- Alias of the org to set as the default

## status( _options_ ): Lists the status of a connected org.
  `options.alias` *[ string ]* - Alias of the org of which to check status

  `options.local` *[ boolean ]* - Fetch only changes in code locally ( _*DEFAULT*_: false)

  `options.remote` *[ boolean ]* - Fetch only changes made remotely ( _*DEFAULT*_: false)

## update( ): Updates the local verison of SFDX CLI and documentation.

## userInfo( _options_ ): Gets info about the default user of an org.
  `options.alias` *[ string ]*- Alias of the org to retrieve info of the user on
