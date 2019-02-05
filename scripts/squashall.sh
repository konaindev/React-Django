#!/bin/sh

# Squash and rebuild all migraitons.
# WARNING WARNING this should only be used in early development stages.

find . -type d -name "migrations" | xargs rm -rf {}
./manage.py makemigrations users
./manage.py makemigrations projects
./manage.py makemigrations web
