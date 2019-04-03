#!/bin/sh
set -e

if ! [ -x 'manage.py' ]; then
  echo "Not in root project directory!"
  exit 1
fi

rm -f /tmp/remark.sqlite3
pipenv run ./manage.py migrate
echo 'Loading fixture data.'
pipenv run ./manage.py loaddata data/dumped/latest.json

