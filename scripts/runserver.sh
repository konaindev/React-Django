#!/bin/sh

# Run Django's local development server along with parceljs in "watch" mode.

trap killchildren SIGINT

killchildren() {
    echo "\nShutting down dev processes..."
    kill -15 0
}

# In an ideal world, we'd have one invocation of parcel watch.
# But, see: https://github.com/parcel-bundler/parcel/issues/2407
yarn parcel watch src/css/main.postcss.scss --no-hmr &
yarn parcel watch src/js/index.js --no-hmr &

# Run the django dev server (on 8000)
./manage.py runserver &

# Run the browser-sync fancy proxy *around* said django dev server
yarn browser-sync start --proxy http://localhost:8000 --files 'dist' --files 'remark' &

wait
