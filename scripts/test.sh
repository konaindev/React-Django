#!/bin/sh
set -e

echo ""
echo "========================================================="
echo "Running backend tests..."
echo "========================================================="
echo ""
python manage.py test

echo ""
echo "========================================================="
echo "Running frontend tests..."
echo "========================================================="
echo ""
yarn test-ui
