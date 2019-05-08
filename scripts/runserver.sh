#!/bin/sh

# Run Django's local development server, along with webpack in watch
# mode, and browser-sync for ultimate fanciness.

# Basically, this re-creates the world in the smallest increment possible 
# every time a change is made to front *or* backend.

if [ "$DEBUG" == "" ]; then
    # This is an imperfect test, but it is useful for catching me when
    # I forget to `pipenv shell` ahead of time. You'll need either
    # `DEBUG=YES` or `DEBUG=NO` in your local `.env` file.
    echo "It doesn't look like you are in a dev shell."
    exit 1
fi

trap killchildren SIGINT

killchildren() {
    echo "\nShutting down dev processes..."
    kill -15 0
}

# Build our frontend assets
yarn webpack --progress --color --hide-modules --config=webpack.dev.js --watch &

./manage.py celery &

# Run the django dev server (on 8000)
./manage.py runserver &

# Run the browser-sync fancy proxy *around* said django dev server
yarn browser-sync start --proxy http://localhost:8000 --files 'dist' --files 'remark' --no-open &

wait
