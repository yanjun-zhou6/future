# Start in tasks/ even if run from root directory
cd "$(dirname "..")"

# Exit the script on any command with non 0 return code
# We assume that all the commands in the pipeline set their return code
# properly and that we do not need to validate that the output is correct
set -e

# Echo every command being executed
set -x

# install package dependences
if [[ -e "yarn.lock" ]]; then
  yarn install --frozen-lockfile
else
  yarn install
fi

# Compile
yarn build

# move package.json & yarn.lock to build directory
cp package.json build
cp yarn.lock build