#!/bin/bash

echo "Moving node_modules from cache to app folder..."
cp -r /usr/src/cache/node_modules/. /usr/src/app/node_modules/
exec pnpm dev
