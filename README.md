# Synthesis-web

Web Interface for the Synthesis package.

## System Requirements

[Strix](https://strix.model.in.tum.de) must be installed on the system. Alternatively, a
[docker](https://www.docker.com) must be installed and running.

### Dependencies
This project contains submodules.
To properly download them run :
```bash
git clone --recursive https://github.com/pierg/synthesis-web
```

## Installation

We use
[conda](https://docs.conda.io/projects/conda/en/latest/user-guide/install/index.html) to
manage the environment and dependencies.

We use [pdm](https://github.com/pdm-project/pdm) to manage 'development' dependencies
(e.g. linting, type checking).


You need to install `conda-merge` so that we can merge all the dependecies from the other repositories and create the `environment.yml`
```bash
pip install conda-merge
```

Once `conda-merge` is installed, you can create the `environment.yml` file, create the environment and activate it by running the following commands:
```bash
make env-create
make env-install
make env-activate
```

Or alternately `make env-all`
## Makefile

To discover Makefile commands or generate documentation you need install pdm dependancies and setup the Makefile :
```bash
pdm install
```
```bash
make setup
```
Check basic commands available by running 
```bash
make
```
### Documentation
You can generate the documentation of the project by running the following commands:

```bash
make docs
```


## Pre-commit tools

Run `make pre-commit` to run all the pre-commit tools

Check all the available commands in `Makefile`

## Docker

### Building the image

To build the image you can run the following command

`docker buildx build --platform linux/x86_64 -t [DOCKERUSERNAME]/[PROJECT]:[TAG] --push .`

## License

[MIT](https://github.com/piergiuseppe/crome-synthesis/blob/master/LICENSE)

## Features and Credits

- Fully typed with annotations and checked with mypy,
  [PEP561 compatible](https://www.python.org/dev/peps/pep-0o561/)

- This project has been initially generated with
  [`wemake-python-package`](https://github.com/wemake-services/wemake-python-package).
