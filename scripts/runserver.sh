#!/bin/sh

# Run Django's local development server, along with parceljs in watch
# mode, and browser-sync for ultimate fanciness.

if [ "$DEBUG" == "" ]; then
    echo "It doesn't look like you are in a dev shell."
    exit 1
fi

trap killchildren SIGINT

killchildren() {
    echo "\nShutting down dev processes..."
    kill -15 0
}

# TODO figure out how to convince parcel to watch a dependent file it may not know exists
yarn parcel watch src/js/index.js --no-hmr --no-cache &

# Run the django dev server (on 8000)
./manage.py runserver &

# Run the browser-sync fancy proxy *around* said django dev server
yarn browser-sync start --proxy http://localhost:8000 --files 'dist' --files 'remark' --files 'tailwind.js' --no-open &

wait
