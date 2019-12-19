#!/bin/sh

# Create composer environment in remarkably-airflow-development project
# Environment name is the same as the branch name

# Set project
gcloud config set project $COMPOSER_PROJECT

export COMPOSER_ENV=$(git symbolic-ref --short HEAD | sed s/_/-/g)

# Create environment (takes up to 30 minutes)
gcloud composer environments create $COMPOSER_ENV \
    --location us-central1 \
    --python-version 3 \
    --image-version composer-1.8.2-airflow-1.10.3 \
    --oauth-scopes=https://www.googleapis.com/auth/analytics,https://www.googleapis.com/auth/cloud-platform


# Looks for existing COMPOSER_ENV with current branch value in .env file. If not, it'll add/replace value with current branch
if grep "COMPOSER_ENV=$COMPOSER_ENV" .env
then
    exit
else
    sed -i.bak '/COMPOSER_ENV/d' .env
    echo "\nCOMPOSER_ENV=$COMPOSER_ENV" >> .env
    echo "Exit pipenv and pipenv install again to have COMPOSER_ENV included/updated in environment variables"
fi
 

