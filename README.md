# Remarkably

The Remarkably web application.

A Django 2.x website, with a React front-end, running on Python 3.7+ and Heroku.

## What's here?

The Django project (and all the django apps) live in the `remark/` subdirectory.

- `remark/users/` contains our user model and run-of-the-mill Django auth config.
- `remark/projects/` contains the data model and views for a "project", which is an engagement around a specific property
- `remark/web/` is the generic app that can depend on all other apps and contains random pages (like the home page).

I've put some skeleton stuff in place for user auth, for auth emails, and for the Django admin site. It's pretty bare bones, though.

Frontend code lives in the `src/` directory.

## Development

For back-end code, we use `flake8` to validate code, and `python black` to enforce code style. For front-end code, we use various of `prettierjs` and `stylelint`.

## Running the project locally

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
```

- Run a build of the front-end assets: `yarn build`.
- Set up database: `./manage.py migrate`
- Load sample data: `./manage.py loaddata data/dumped/2-lincoln.json`
- Run the django dev server: `./manage.py runserver`.

(TODO: `heroku local` will be the way forward, eventually)

### Running the project locally: fancy version.

Want some fancy magic to reload your web page any time any front or backend asset changes?

`./scripts/runserver.sh`

Warning: this is fancy magic. I imagine it is fragile. -Dave

## Sharp edges

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

### Tailwind CSS

CSS layout framework.
https://tailwindcss.com/docs/what-is-tailwind/
