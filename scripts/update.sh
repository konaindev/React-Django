#!/bin/sh
set -e

if ! [ -x 'manage.py' ]; then
  echo "Not in root project directory!"
  exit 1
fi

pipenv install --dev
if [ -f '/tmp/remark.sqlite' ]; then
  NEW_DB=1
else
  NEW_DB=0
fi
pipenv run ./manage.py migrate
pipenv run ./manage.py test
if [ "$NEW_DB" == '1' ]; then
  pipenv run ./manage.py loaddata scripts/data/2-lincoln-single-period.json
fi
pipenv run yarn install
pipenv run yarn build

