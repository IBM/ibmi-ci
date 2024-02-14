# ibmi-ci

ibmi-ci is a command line tool to make it easier to work with IBM i from pipelines, like GitHub Actions, GitLab CICD, etc.

## Installation

[Install via npm](https://www.npmjs.com/package/@ibm/ibmi-ci):

```sh
npm i @ibm/ibmi-ci
```

<details>
<summary>Use in a GitHub Action</summary>

```yaml
      - run: npm i -g @ibm/ibmi-ci
      - name: Deploy to IBM i
        run: | 
          ici \
            --cmd "mkdir -p './builds/ics_${GITHUB_HEAD_REF}'" \
            --rcwd "./builds/ics_${GITHUB_HEAD_REF}" \
            --push "." \
            --cmd "/QOpenSys/pkgs/bin/gmake BIN_LIB=CMPSYS"
        env:
          IBMI_HOST: ${{ secrets.IBMI_HOST }}
          IBMI_USER: ${{ secrets.IBMI_USER }}
          IBMI_PASSWORD: ${{ secrets.IBMI_PASSWORD }}
          IBMI_SSH_PORT: ${{ secrets.IBMI_SSH_PORT }}
```

</details>



## How to use

After installation, **run `ici` to see the help text and available parameters**. 

ibmi-ci is made up of steps and steps are built up from parameters, with the default step of connecting to the remote system, which always takes a place.

The steps `ici` will take is based on the parameters used on the CLI. For example:

```sh
ici \
  --rcwd "./builds/myproject" \
  --push "." \
  --cmd "/QOpenSys/pkgs/bin/gmake BIN_LIB=MYLIB"
```

This command will run 3 steps:

1. Set the remote working directory to `./builds/myproject`
2. Upload the local working directory to the remote working directory (`.`)
3. Run a shell command

### Default steps

By default, ibmi-ci will always:

1. Connect to the remote IBM i via SSH. Connection configuration is based on environment variables. Use `ici` to see more info.
2. Set the environment variables on the remote IBM i to those of the host runner (with some exceptions like `SHELL`, `HOME`, etc)

### Ignoring errors

You can use a special ignore flag to suppress errors on certain steps: `--ignore`. This means if the following step errors, execution will continue nonetheless.

```sh
ici \
  --rcwd "./builds/myproject" \
  --push "." \
  --ignore --cl "CRTLIB $LIB"
  --cmd "/QOpenSys/pkgs/bin/gmake BIN_LIB=MYLIB"
```

## Development

After cloning the repo, there are two options:

1. `npm run local` to install `ici`
2. Open in VS Code and debug

## Todo ✅

* [ ] **Step for creating chroot** automatically as the first step, or to specify which chroot to use
* [x] **Ignore errors** for certain steps. Sometimes we don't care if `mkdir` or `CRTLIB` failed.
* [ ] **Daemon mode** so `ici` can be run multiple times but use the same connection