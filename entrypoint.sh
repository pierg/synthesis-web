#!/usr/bin/env bash

echo "...updating repository from server..."

cd /home/synthesis-web
git reset --hard
git config pull.rebase true
git submodule foreach git pull origin main
git pull

echo "repositoriy updated"

if [ $# -eq 0 ]
  then
    source run.sh
else
    source run.sh "$@"
fi
