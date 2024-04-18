# govuk-notify-cli

<!-- toc -->
* [govuk-notify-cli](#govuk-notify-cli)
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->

# Usage

<!-- usage -->
```sh-session
$ npm install -g govuk-notify-cli
$ notifycli COMMAND
running command...
$ notifycli (--version)
govuk-notify-cli/0.4.0 darwin-arm64 node-v21.7.1
$ notifycli --help [COMMAND]
USAGE
  $ notifycli COMMAND
...
```
<!-- usagestop -->

# Commands

<!-- commands -->
* [`notifycli help [COMMAND]`](#notifycli-help-command)
* [`notifycli list SERVICENAME`](#notifycli-list-servicename)
* [`notifycli pdf SERVICENAME NOTIFICATIONID`](#notifycli-pdf-servicename-notificationid)
* [`notifycli service`](#notifycli-service)
* [`notifycli service add SERVICENAME APIKEY`](#notifycli-service-add-servicename-apikey)
* [`notifycli service remove SERVICENAME`](#notifycli-service-remove-servicename)
* [`notifycli status SERVICENAME NOTIFICATIONID`](#notifycli-status-servicename-notificationid)

## `notifycli help [COMMAND]`

Display help for notifycli.

```
USAGE
  $ notifycli help [COMMAND...] [-n]

ARGUMENTS
  COMMAND...  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for notifycli.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v6.0.21/src/commands/help.ts)_

## `notifycli list SERVICENAME`

List recent notifcations for a Notify service

```
USAGE
  $ notifycli list SERVICENAME [-t email|sms|letter] [-r <value>] [-j]

ARGUMENTS
  SERVICENAME  The name of the Notify service

FLAGS
  -j, --json               Output API JSON body instead of table of results
  -r, --reference=<value>  Filter notifications by reference
  -t, --type=<option>      Filter notifications by type
                           <options: email|sms|letter>

DESCRIPTION
  List recent notifcations for a Notify service

EXAMPLES
  $ notifycli list serviceName
```

_See code: [src/commands/list/index.js](https://github.com/gunjam/nofitfy-cli/blob/v0.4.0/src/commands/list/index.js)_

## `notifycli pdf SERVICENAME NOTIFICATIONID`

Get PDF for a letter notifcation

```
USAGE
  $ notifycli pdf SERVICENAME NOTIFICATIONID [-f <value>]

ARGUMENTS
  SERVICENAME     The name of the Notify service
  NOTIFICATIONID  The ID of the notification

FLAGS
  -f, --file=<value>  Set the output filename, default: $notificationId.pdf

DESCRIPTION
  Get PDF for a letter notifcation

EXAMPLES
  $ notifycli pdf pdf serviceName notificationId
```

_See code: [src/commands/pdf/index.js](https://github.com/gunjam/nofitfy-cli/blob/v0.4.0/src/commands/pdf/index.js)_

## `notifycli service`

List, add and remove Notify services

```
USAGE
  $ notifycli service [-v]

FLAGS
  -v, --verbose  Show service names and API keys

DESCRIPTION
  List, add and remove Notify services

EXAMPLES
  List configured Notify services:

  $ notifycli service
  myservice

  $ notifycli service -v
  myservice api-key
```

_See code: [src/commands/service/index.js](https://github.com/gunjam/nofitfy-cli/blob/v0.4.0/src/commands/service/index.js)_

## `notifycli service add SERVICENAME APIKEY`

Add a Notify service

```
USAGE
  $ notifycli service add SERVICENAME APIKEY

ARGUMENTS
  SERVICENAME  What to call the Notify service
  APIKEY       The API key of the Notify service

DESCRIPTION
  Add a Notify service

EXAMPLES
  $ notifycli service add myServiceName myApiKey
```

_See code: [src/commands/service/add.js](https://github.com/gunjam/nofitfy-cli/blob/v0.4.0/src/commands/service/add.js)_

## `notifycli service remove SERVICENAME`

Remove a Notify service

```
USAGE
  $ notifycli service remove SERVICENAME

ARGUMENTS
  SERVICENAME  The name of the Notify service to remove

DESCRIPTION
  Remove a Notify service

EXAMPLES
  $ notifycli service remove myServiceName
```

_See code: [src/commands/service/remove.js](https://github.com/gunjam/nofitfy-cli/blob/v0.4.0/src/commands/service/remove.js)_

## `notifycli status SERVICENAME NOTIFICATIONID`

Get the status of a notification

```
USAGE
  $ notifycli status SERVICENAME NOTIFICATIONID [-j]

ARGUMENTS
  SERVICENAME     The name of the Notify service
  NOTIFICATIONID  The ID of the notification

FLAGS
  -j, --json  Output API JSON body instead of table of data

DESCRIPTION
  Get the status of a notification

EXAMPLES
  $ notifycli status status serviceName notificationId
```

_See code: [src/commands/status/index.js](https://github.com/gunjam/nofitfy-cli/blob/v0.4.0/src/commands/status/index.js)_
<!-- commandsstop -->
