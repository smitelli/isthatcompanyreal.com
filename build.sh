#!/usr/bin/env bash
set -e

SELF_DIR="$( cd $( dirname "${BASH_SOURCE[0]}" ) && pwd )"

cd "$SELF_DIR"
npm install --prod
./node_modules/.bin/r.js -o ./src/js/build.js
cp -f ./build/css/style.css ./build/js/main.js ./public/
rm -rf ./build ./node_modules
