#!/bin/sh

# Run Django's local development server, along with parceljs in watch
# mode, and browser-sync for ultimate fanciness -- and expose it all to
# remarkably.ngrok.io. :-)

trap killchildren SIGINT

killchildren() {
    echo "\nShutting down dev processes..."
    kill -15 0
}

# Build our frontend assets
yarn webpack --progress --color --hide-modules --config=webpack.dev.js --watch &

# Run the django dev server (on 8000)
./manage.py runserver &

# Run the browser-sync fancy proxy *around* said django dev server
yarn browser-sync start --config './scripts/bs-ngrok-config.js' --no-open &

# Run ngrok outward
ngrok http --subdomain=remarkably --log=stdout 3000 > /dev/null &

wait

