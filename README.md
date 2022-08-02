# Synthesis-web

Web Interface for the Synthesis package.

## System Requirements

[Strix](https://strix.model.in.tum.de) must be installed on the system.

### Dependencies

Clone crome-logic, crome-contracts, crome-cgg and crome-synthesis from git in the same
folder where synthesis-web is located

```bash
git clone https://github.com/pierg/crome-logic.git
```

```bash
git clone https://github.com/pierg/crome-contracts.git
```

```bash
git clone https://github.com/pierg/crome-cgg.git
```

```bash
git clone https://github.com/pierg/crome-synthesis.git
```

Append it to PYTHONPATH

```bash
export PYTHONPATH=$PYTHONPATH:../crome-logic/:../crome-contracts/:../crome-cgg/:../crome-synthesis/
```

## Installation

We use
[conda](https://docs.conda.io/projects/conda/en/latest/user-guide/install/index.html) to
manage the environment and dependencies.

We use [pdm](https://github.com/pdm-project/pdm) to manage 'development' dependencies
(e.g. linting, type checking).

You need to install `conda-merge` so that we can merge all the dependecies from the
other repositories and create the `environment.yml`

```bash
pip install conda-merge
```

Once `conda-merge` is installed, you can create the `envioronment.yml` file, create the
environment and activate it by runnin the following commands:

```bash
make conda-create
make conda-install
make conda-activate
```

Install the other dependencies with pdm (optional):

```bash
pdm install
```
## One magic command

Run `make pre-commit` to run all the pre-commit tools

Check all the available commands in `Makefile`

## Documentation

You can generate the documentation of the project by running the following commands:

```bash
make setup
make docs
```

The documentation can then be found in a folder named "site" at the root of the project

## License

[MIT](https://github.com/piergiuseppe/crome-synthesis/blob/master/LICENSE)

## Features and Credits

- This project has been initially generated with
  [`wemake-python-package`](https://github.com/wemake-services/wemake-python-package).
