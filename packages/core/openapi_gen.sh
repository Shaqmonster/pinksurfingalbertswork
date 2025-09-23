#!/bin/bash

# This script is used to generate the OpenAPI client code from the OpenAPI specification file.

set -e

# Remove the existing generated files if any
rm -rf ./loginid-fido2
rm -f ./mod-openapi.yaml

# Get the file from loginid-fido2 repo
git clone git@gitlab.com:loginid/software/loginid-fido2.git
cp ./loginid-fido2/api/rest/openapi3.yaml ./openapi.yaml

node ./pre_openapi_gen.js
mv ./mod-openapi.yaml ./openapi.yaml
npm run gen

rm -rf ./loginid-fido2
rm -rf ./mod-openapi.yaml
