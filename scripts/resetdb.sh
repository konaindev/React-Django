#!/bin/sh
set -e

if ! [ -x 'manage.py' ]; then
  echo "Not in root project directory!"
  exit 1
fi

echo 'Deleting local development database...'
rm -f /tmp/remark.sqlite3
echo 'Creating new local development database...'
pipenv run ./manage.py migrate
echo 'Loading latest dumped data...'
pipenv run ./manage.py loaddata data/dumped/latest.json
echo 'Loading test user (test@psl.com)...'
pipenv run ./manage.py loaddata data/dumped/test-user.json
echo 'Local database has been reset!'
