#!/bin/bash
export AWS_PROFILE=resinbunch_web
aws s3 sync out s3://resinbunch.com
echo "Creating Invalidation"
aws cloudfront create-invalidation --distribution-id E3VKFSTYERN9MP --paths "/*"
