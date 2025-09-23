#!/bin/bash
set -e

echo "Obtaining package and version from tag..."
PACKAGE_NAME="${CI_COMMIT_TAG%@*}"
VERSION="${CI_COMMIT_TAG##*@}"

echo "Package name: $PACKAGE_NAME"
echo "Version: $VERSION"

if [ "$PACKAGE_NAME" = "@loginid/websdk3" ]; then
  FILE_PATH="./packages/websdk3/dist/index.global.js"
  S3_PATH="sdk/js/web/$VERSION/web.min.js"
elif [ "$PACKAGE_NAME" = "@loginid/checkout-merchant" ]; then
  FILE_PATH="./packages/checkout/merchant/dist/index.global.js"
  S3_PATH="sdk/js/merchant/$VERSION/merchant.min.js"
elif [ "$PACKAGE_NAME" = "@loginid/checkout-wallet" ]; then
  FILE_PATH="./packages/checkout/wallet/dist/index.global.js"
  S3_PATH="sdk/js/wallet/$VERSION/wallet.min.js"
else
  echo "Unknown package: $PACKAGE_NAME"
  exit 1
fi

echo "Uploading $FILE_PATH to s3://$S3_BUCKET/$S3_PATH"
aws s3 cp "$FILE_PATH" "s3://$S3_BUCKET/$S3_PATH"

echo "Invalidate ${CF_DISTRIBUTION_ID} CloudFront distribution cache"
aws cloudfront create-invalidation --distribution-id "$CF_DISTRIBUTION_ID" --paths "/*"
