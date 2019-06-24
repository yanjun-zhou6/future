cd "$(dirname "$0")"
cd ../project/gt-mobile-4
yarn build

cp package.json build
tar -cvf build.tar build