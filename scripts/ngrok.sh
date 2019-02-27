#!/bin/sh

# Run Django's local development server, along with parceljs in watch
# mode, and browser-sync for ultimate fanciness -- and expose it all to
# remarkably.ngrok.io. :-)

trap killchildren SIGINT

killchildren() {
    echo "\nShutting down dev processes..."
    kill -15 0
}

# In an ideal world, we'd have one invocation of parcel watch.
# But, see: https://github.com/parcel-bundler/parcel/issues/2407
yarn parcel watch src/css/main.scss --no-hmr &
yarn parcel watch src/js/index.js --no-hmr &

# Run the django dev server (on 8000)
./manage.py runserver &

# Run the browser-sync fancy proxy *around* said django dev server
yarn browser-sync start --config './scripts/bs-ngrok-config.js' --no-open &

# Run ngrok outward
ngrok http --subdomain=remarkably --log=stdout 3000 > /dev/null &

wait

