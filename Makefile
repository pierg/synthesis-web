SHELL:=/usr/bin/env bash

.PHONY: conda-create
conda-create:
	conda-merge ../crome-cgg/environment-cgg.yml ../crome-contracts/environment-contracts.yml ../crome-logic/environment-logic.yml ../crome-synthesis/environment-synthesis.yml environment-web.yml > environment.yml


.PHONY: conda-install
conda-install:
	conda env create --force -f environment.yml


.PHONY: conda-activate
conda-activate:
	conda activate synthesis-web


.PHONY: conda-all
conda-all: conda-create conda-install conda-activate



#* Cleaning
.PHONY: pycache-remove
pycache-remove:
	find . | grep -E r"(__pycache__|\.pyc|\.pyo$$)" | xargs rm -rf

.PHONY: dsstore-remove
dsstore-remove:
	find . | grep -E ".DS_Store" | xargs rm -rf

.PHONY: mypycache-remove
mypycache-remove:
	find . | grep -E ".mypy_cache" | xargs rm -rf

.PHONY: ipynbcheckpoints-remove
ipynbcheckpoints-remove:
	find . | grep -E ".ipynb_checkpoints" | xargs rm -rf

.PHONY: pytestcache-remove
pytestcache-remove:
	find . | grep -E ".pytest_cache" | xargs rm -rf

.PHONY: build-remove
build-remove:
	rm -rf build/


.PHONY: cleanup
cleanup: pycache-remove dsstore-remove mypycache-remove ipynbcheckpoints-remove pytestcache-remove
