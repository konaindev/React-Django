# Remarkably

The Remarkably web application.

A Django 2.x website, with a React front-end, running on Python 3.7+ and Heroku.

## What's here?

The Django project (and all the django apps) live in the `remark/` subdirectory.

- `remark/users/` contains our user model and run-of-the-mill Django auth config.
- `remark/web/` is the generic app that can depend on all other apps and contains random pages (like the home page).

I've put some skeleton stuff in place for user auth, for auth emails, and for the Django admin site. It's pretty bare bones, though.

Frontend code lives in the `src/` directory.

## Development

For back-end code, we use `flake8` to validate code, and `python black` to enforce code style. For front-end code, we use various of `prettierjs` and `stylelint`.

## Running the project locally

- Run `pipenv install` and `pipenv shell` to get the back-end requirements installed.
- Run `yarn install` to get the front-end requirements installed.
- Then run `./manage.py test` to make sure there is sanity.
- Set up a local dev-only `.env` file; here's mine:

```
DEBUG=YES
SECURE_SSL_REDIRECT=NO
BASE_URL=http://localhost:8000
DEBUG_PRINT_LOGGER=YES
EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend
EMAIL_USE_TLS=NO
```

- Run a build of the front-end assets: `yarn build`.
- Run the django dev server: `./manage.py runserver`.

(TODO: `heroku local` will be the way forward, eventually)

### Running the project locally: fancy version.

Want some fancy magic to reload your web page any time any front or backend asset changes?

`./scripts/runserver.sh`

Warning: this is fancy magic. I imagine it is fragile. -Dave

## Sharp edges

### Known technical debt

Hey! We just started this app. Assume it's 100% technical debt. :-) -Dave
