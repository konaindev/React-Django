#!/bin/sh
set -e

if ! [ -x 'manage.py' ]; then
  echo "Not in root project directory!"
  exit 1
fi

# This assumes that in your local configuration, your git `prod` remote
# points to heroku. AKA, that this is in your .git/config file:
# [remote "prod"]
#   url = https://git.heroku.com/remarkably.git
#   fetch = +refs/heads/*:refs/remotes/heroku/*
echo 'Downloading all project data from the production heroku instance...'
# heroku run --remote prod python manage.py dumpdata projects.project projects.period projects.targetperiod geo.address > data/dumped/latest.json
heroku run python manage.py dumpdata projects email_app crm analytics auth users geo.address > data/dumped/latest.json
./scripts/clean_data_dump.py data/dumped/latest.json data/dumped/latest.json
echo 'The data/dumped/latest.json file is updated. You can commit this, if you like!'
