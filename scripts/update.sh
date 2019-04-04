#!/bin/sh
set -e

if ! [ -x 'manage.py' ]; then
  echo "Not in root project directory!"
  exit 1
fi

pipenv install --dev
if [ -f '/tmp/remark.sqlite' ]; then
  NEW_DB=0
else
  NEW_DB=1
fi
pipenv run ./manage.py migrate
pipenv run ./manage.py test
if [ "$NEW_DB" -eq '1' ]; then
  echo 'Loading fixture data.'
  pipenv run ./manage.py loaddata data/dumped/latest.json
fi
pipenv run yarn install
pipenv run yarn build

