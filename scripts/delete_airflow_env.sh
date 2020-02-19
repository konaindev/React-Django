#!/bin/sh

# Delete composer environment in remarkably-airflow-development project
# Environment name is the same as the branch name

# Set project
gcloud config set project $GOOGLE_PROJECT_ID

export COMPOSER_ENV=$(git symbolic-ref --short HEAD | sed s/_/-/g)

# Create environment (takes up to 30 minutes)
gcloud composer environments delete $COMPOSER_ENV \
    --location us-central1


# Delete bucket associated with environment
get_bucket=$(gcloud composer environments describe $COMPOSER_ENV \
              --location us-central1 \
              --format="get(config.dagGcsPrefix)" | sed -e 's/gs:\/\///g' -e's/\/dags//g')

gsutil rm -r $get_bucket
