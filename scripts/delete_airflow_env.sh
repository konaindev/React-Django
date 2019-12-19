#!/bin/sh

# Delete composer environment in remarkably-airflow-development project
# Environment name is the same as the branch name

# Set project
gcloud config set project $COMPOSER_PROJECT

export COMPOSER_ENV=$(git symbolic-ref --short HEAD | sed s/_/-/g)

# Create environment (takes up to 30 minutes)
gcloud composer environments delete $COMPOSER_ENV \
    --location us-central1 
