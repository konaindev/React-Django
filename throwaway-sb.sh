#!/usr/bin/env bash

HASH=$(git rev-parse --abbrev-ref HEAD)

aws s3 mb s3://${HASH}-storybook

aws s3 website s3://${HASH}-storybook --index-document index.html

cat > policy.json << __EOF__
{
  "Version":"2012-10-17",
  "Statement":[{
	"Sid":"PublicReadGetObject",
        "Effect":"Allow",
	  "Principal": "*",
      "Action":["s3:GetObject"],
      "Resource":["arn:aws:s3:::${HASH}-storybook/*"
      ]
    }
  ]
}
__EOF__

aws s3api put-bucket-policy --bucket ${HASH}-storybook --policy file://policy.json

./node_modules/.bin/build-storybook -o ${HASH}-storybook

aws s3 sync ${HASH}-storybook s3://${HASH}-storybook 

echo "created storybook at http://${HASH}-storybook.s3-website-us-east-1.amazonaws.com"
