#!/bin/bash

cd "$(dirname "$0")"

cd ..

(
cd ui/gee-ui-mobile
npm run dev
)&

(
cd project/gt-mobile-4
npm run start
)&

wait