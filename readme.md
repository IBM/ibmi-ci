# ibmi-ci

[![NPM Version](https://img.shields.io/npm/v/@ibm/ibmi-ci.svg?label=version)](https://www.npmjs.com/package/@ibm/ibmi-ci)
[![NPM Downloads](https://img.shields.io/npm/dm/@ibm/ibmi-ci.svg)](https://www.npmjs.com/package/@ibm/ibmi-ci)

`ibmi-ci` is a command line tool that makes it easier to work with IBM i from pipelines like GitHub Actions, GitLab CICD, etc. A call to this tool will perform the following:

1. Connect to a remote IBM i via SSH. [Connection configuration](#connection-configuration) is based on environment variables.
2. Set the environment variables on the remote IBM i to those of the host runner (with some exceptions like `SHELL`, `HOME`, etc)
3. Execute a series of steps based on the [parameters](#usage) passed to this CLI tool.

## Installation

[Install via npm](https://www.npmjs.com/package/@ibm/ibmi-ci):

```sh
npm i @ibm/ibmi-ci
```

## Connection Configuration

The following environment variables must be set:
- `IBMI_HOST`
- `IBMI_SSH_PORT`
- `IBMI_USER`

At least one of these environment variables is required:
- `IBMI_PASSWORD`
- `IBMI_PRIVATE_KEY`

## Usage

After installation, **run `ici` to see the help text and available parameters**.

| Parameter                                              | Description                                                                                        |
|--------------------------------------------------------|----------------------------------------------------------------------------------------------------|
| `--lcwd <localDirectory>`                              | Sets the current local working directory on the local system.                                      |
| `--rcwd <remoteDirectory>`                             | Sets the current working directory on the remote system. It will be created if it does not exist.  |
| `--push <remoteRelativeDirectory>`                     | Pushes the current local working directory to a chosen directory on the IBM i                      |
| `--pull <remoteRelativeDirectory>`                     | Pulls a directory from IBM i to the current local working directory                                |
| `--get <remoteRelativeDirectory> <localRelativePath>`  | Gets a specific file from IBM i                                                                    |
| `--cmd <shellCommand>`                                 | Execute a PASE command on the remote system                                                        |
| `--cl <clCommand>`                                     | Execute a CL command on the remote system                                                          |
| `--ghasset <owner/repo> <tag> <assetName>`             | Pulls assets from a GitHub release to the local current working directory                          |
| `--ignore`                                             | When placed immediately before any step flag, execution continues even if that step fails          |

## Examples

## Building An Application Using gmake

A local project can be deployed to an IBM i and built using `gmake` with ease.

```sh
ici \
  --rcwd "./builds/myproject" \
  --push "." \
  --cmd "/QOpenSys/pkgs/bin/gmake BIN_LIB=MYLIB"
```

This command will run 3 steps:

1. Set the remote working directory to `./builds/myproject`
2. Upload the local working directory to the remote working directory (`.`)
3. Run a shell command to build the application using `gmake`.

### Ignoring Errors

You can use the special `--ignore` flag to suppress errors on certain steps. This means if the following step errors, execution will continue nonetheless.

```sh
ici \
  --rcwd "./builds/myproject" \
  --push "." \
  --ignore --cl "CRTLIB $LIB"
  --cmd "/QOpenSys/pkgs/bin/gmake BIN_LIB=MYLIB"
```

### GitHub Actions

An extension of the first example is to make use of `ibmi-ci` in a GitHub Actions workflow.

```yaml
- run: npm i -g @ibm/ibmi-ci
- name: Deploy and Build on IBM i
  run: | 
    ici \
      --cmd "mkdir -p './builds/ics_${GITHUB_HEAD_REF}'" \
      --rcwd "./builds/ics_${GITHUB_HEAD_REF}" \
      --push "." \
      --ignore --cl "CRTLIB CMPSYS" \
      --ignore --cl "CLRLIB CMPSYS" \
      --cmd "/QOpenSys/pkgs/bin/gmake BIN_LIB=CMPSYS"
  env:
    IBMI_HOST: ${{ secrets.IBMI_HOST }}
    IBMI_USER: ${{ secrets.IBMI_USER }}
    IBMI_PASSWORD: ${{ secrets.IBMI_PASSWORD }}
    IBMI_SSH_PORT: ${{ secrets.IBMI_SSH_PORT }}
```

This command will run 6 steps:
1. Create a remote working directory on the IBM i. [GITHUB_HEAD_REF](https://docs.github.com/en/actions/reference/workflows-and-actions/variables) is a GitHub Actions environment variable that contains the name of the branch and will be populated at runtime. For example, if the branch name is `feature/my-cool-feature`, the remote working directory will be `./builds/ics_feature/my-cool-feature`.
2. Set the remote working directory.
3. Upload the local working directory to the remote working directory.
4. Create a library on the IBM i called `CMPSYS`. Execution will continue even if this step fails (the library already exists).
5. Clear the library on the IBM i called `CMPSYS`.
6. Run a shell command to build the application using `gmake`.

Note: The connection configuration is set using GiHub Action [secrets](https://docs.github.com/en/actions/how-tos/write-workflows/choose-what-workflows-do/use-secrets).