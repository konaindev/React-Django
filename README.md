# Remarkably

The Remarkably web application.

A Django 2.x website, with a React front-end, running on Python 3.7+ and Heroku.

CircleCI --> Heroku (Staging) [![CircleCI](https://circleci.com/gh/remarkably-io/remarkably/tree/staging.svg?style=svg&circle-token=21d63293e5d7a26405fb5ba0be14443fe616aae0)](https://circleci.com/gh/remarkably-io/remarkably/tree/staging)

## What's here?

The Django project (and all the django apps) live in the `remark/` subdirectory.

- `remark/users/` contains our user model and run-of-the-mill Django auth config.
- `remark/projects/` contains the data model and views for a "project", which is an engagement around a specific property
- `remark/web/` is the generic app that can depend on all other apps and contains random pages (like the home page).

I've put some skeleton stuff in place for user auth, for auth emails, and for the Django admin site. It's pretty bare bones, though.

Frontend code lives in the `src/` directory.

## Development

For back-end code, we use `flake8` to validate code, and `python black` to enforce code style. For front-end code, we use various of `prettierjs` and `stylelint`.

### Core Dependencies

- node
- yarn
- python3
- pipenv
- postgres (including cli tools, such as `pg_config`)
- openssl-dev (make sure the libs are in `$PATH`)
- cairo
- redis
- postgres

### Exceptions

Remarkably uses a hosted exception tracking platform, currently Sentry.io,
which you can run [locally](https://hub.docker.com/r/amd64/sentry) via docker.

Sentry provides the ability to [add contextual data](https://docs.sentry.io/enriching-error-data/context/?platform=javascript#tagging-events) via tagging. This
will enchance the debugging experience.

## Fixtures

Test fixtures for loading the database are stored in aws s3. The following yarn commands are provided to help update and manage the fixture file until which time a better solution can be implemented:

Dump a copy of your local database into the fixture json

```
$ yarn dump-local-fixtures
```

Upload your local fixtures as `<short-hash>.latest.json`. NOTE: the current git commit will be used for the `short-hash`...so know where you are!

```
$ yarn upload-s3-fixtures
```

Overwrite the the main fixture file in s3 with the file you uploaded with `upload-s3-fixtures`. NOTE: the current git commit will be used for the `short-hash`...so know where you are!

```
$ yarn update-s3-fixtures
```

Attempt to fetch the fixtures for the current commit. NOTE: this will overwrite your local `data/dumped/latest.json`

```
$ yarn fetch-s3-fixtures
```

Attempt to fetch the `latest` fixtures from s3. NOTE: this will overwrite your local `data/dumped/latest.json`

```
$ yarn fetch-latest-fixtures
```

- Ensure you have all system deps running (postgres, redis, etc)
- Run `pipenv install` and `pipenv shell` to get the back-end requirements installed.
- Run `yarn install` to get the front-end requirements inst alled.
- Then run `./manage.py test` to make sure there is sanity.
- Set up a local dev-only `.env` file; here's mine:

```
DEBUG=YES
SECURE_SSL_REDIRECT=NO
BASE_URL=http://localhost:8000
DEBUG_PRINT_LOGGER=YES
EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend
EMAIL_USE_TLS=NO
GOOGLE_APPLICATION_CREDENTIALS=(*see Credentials in Airflow Deployment feature branch section*)
GOOGLE_COMPOSER_PROJECT=remarkably-airflow-development
REDIS_URL=redis://127.0.0.1:6379/
SENTRY_URL=https://<hash>@sentry.io/<path>
API_VER=v1
```

- Run a build of the front-end assets: `yarn build`.
- Set up database: `./manage.py migrate`
- Load sample data: `./manage.py loaddata data/dumped/latest.json`
- Run the django dev server: `./manage.py runserver`.
- Navigate to `http://localhost:8000` (navgating to `127.0.0.1:8000` could encounter CORS issues)

(TODO: `heroku local` will be the way forward, eventually)

### Running the project locally: fancy version.

Want some fancy magic to reload your web page any time any front or backend asset changes?

`./scripts/runserver.sh`

Warning: this is fancy magic. I imagine it is fragile. -Dave

### Running the Frontend React Application

`$ yarn run-build-ui` will start the `webpack-dev-server`, with the `development` environment and `webpack.dev.js` config file.

### Airflow Deployment for feature branch
For airflow development and testing while working on branch. The environment will have the same name as your branch within the `remarkably-airflow-development` project in Google Cloud

Create a Google Composer Environment for your feature branch:

`./scripts/create_airflow_env.sh`

Delete the Google Composer Environment for your feature branch:

`./scripts/delete_airflow_env.sh`

May need to run `gcloud auth login` if it's your first time. 

*GOOGLE_APPLICATION_CREDENTIALS can be found in Remarkably's Dropbox > engineering > credentials. Copy and paste the entire json as the value for GOOGLE_APPLICATION_CREDENTIALS. 

### Storybook

This project uses Storybook for viewing react components. The primary storybook is published at:

[https://storybook.remarkably.io](https://storybook.remarkably.io)

Additionally, there is a script (`throwaway-sb.sh`) that, if you have proper AWS credentials, will create
a "throwaway" storybook deployment to a static site host s3 bucket matching the following schema:

`http:://<short git hash at HEAD of branch>-storybook.s3-website-us-east-1.amazonaws.com`

such as:

http://c2a8b49a-storybook.s3-website-us-east-1.amazonaws.com

#### note: be a good aws buddy and delete old storybook buckets _after_ you are done with them!

You can envoke the script from the root project directory with `bash throwaway-sb.sh` and it will take care of the rest.

## Sharp edges

### Caching

#### Cache Key & Behavior

Currently caching is implemented on a per-route-per-method-handler basis. As such, `/dashboard` caches
based on what is assumed to be it's core usecase. With that thinking, the cache key is composed from:

- the user object `public_id`
- the request object `path`
- the request object `query_string`

Going forward it will be highly worthwhile to consolidate all caching in a
middleware, and apply a consistent strategy across handlers/routes.

#### TTL

TTL is defaulted in the django cache configuration with an arbitrary value. Since each handler sets the
key and TTL during the `cache.set()` call it is completely possible to set wildly different expirations.
This could, on occasion, result in some wacky troubleshooting.

You can now set the default TTL by specifying `REDIS_TTL` in your `.env` file.

#### Invalidation

Currently there is not a centeralized mechanism to bust a redis cache. This should be implemented via a header
(`X-Remark-Cache: bust`) or similar, and applied in a middleware.

### Known technical debt

This is a young app, so there's both very little technical debt, and the assumption (for now) that _all_ of it is debt. -Dave

### Things to contemplate 2: where data and schema lives

Eventually, we'll want our schema, and our computations, to be a dynamic property of the service. Or, at least, I suspect we will?

Engagements with customers are a moving target; the set of questions we ask of each customer, and the specifics of each visualization we produce, are (at least today) in flux. I'm fine with the engineering response to "hey, we should ask two new questions of each client" in months 1-N (for small values of N) to be "no problem, we'll just make a change" (updates code, migrates, deploys to heroku).

But somewhere down the road, it should be "no problem, you can make this change yourself". How far this goes in the context of Remarkably, I'm not sure. Does it go to visualization computations? Layout and design? Does that seem too far? -Dave

## Documentation Links

### Django

The web framework.
https://docs.djangoproject.com/en/2.1/

### Storage for images, excel spreadsheets, etc.

We use Django's FileField and ImageField to store references to uploaded files in our database.

In production and staging, we use django-storages and Amazon S3 to store uploaded files. There are a number of settings that have to be "just right" for this all to work, including:

- `DEFAULT_FILE_STORAGE`: identifies a `Storage` class in use by default, including for all `FileField` and `ImageField` by default. In production, this should be `storages.backends.s3boto3.S3Boto3Storage`.

- `AWS_ACCESS_KEY_ID`: The public key for a AWS IAM user with read/write permissions to the target bucket. (Ideally, this user should not have permissions beyond those absolutely necessary to do its work.)

- `AWS_SECRET_ACCESS_KEY`: The private key for the same AWS IAM user.

- `AWS_STORAGE_BUCKET_NAME`: The fully-qualified target S3 bucket name.

- `AWS_S3_REGION_NAME`: The region for the target S3 bucket, like `us-east-1`.

- `MEDIA_ROOT`: The root, on the target filesystem, for all uploaded (media) files. By default, `django-storage`'s `S3Boto3Storage` uses `''`.

- `MEDIA_URL`: The public base URL that corresponds to the `MEDIA_ROOT`. This is used by Django's storages system. (A `Storage` is a class that maps a filesystem, potentially a remote one, to a URL; see [here for details](https://davepeck.org/2015/02/06/django-storage-minutia/).) In the case of production, this could either be the public S3 URL (like https://s3.amazonaws.com/production-storage.remarkably.io/) or, if we like, we can place a Cloudfront distribution on top of it later; in that case, `MEDIA_URL` should refer to the distribution.

### What about media storage for local development?

1. You can create your own S3 bucket if you like. (Mine is called `dave-dev-storage.remarkably.io`) You probably should create a new IAM user and group+policy to give you just read/write access to that bucket.

2. You can just store stuff on the local filesystem. Update your `.env` as follows:

- `DEFAULT_FILE_STORAGE=django.core.files.storage.FileSystemStorage`
- `MEDIA_ROOT=/tmp/some-directory-you-create`
- `MEDIA_URL=/media/`

This will only work when `DEBUG=YES`.
