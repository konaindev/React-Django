#!/bin/bash -eo pipefail

#### 
#  NOTES:
#    
#    - requires AWS creds as env-vars
#    - requires CLOUDFRONT_DIST_ID as env-var
#    - requires CERT_ARN as env-var
#### 

APROX_WEEK=605463
DAY=86400
NOW=$(date +%s)
DERATED=$(($NOW+$APROX_WEEK))

# get the "old" CERT_ARN, assuming that we only have 1 cert per domain...

OLD_CERT_ARN=$(aws acm list-certificates --region us-east-1 | \
  python -c "import sys, json; print(json.load(sys.stdin)['CertificateSummaryList'][0]['CertificateArn'])")

# get the expiration of the current cert from acm
EXPIRE=$(aws acm describe-certificate \
  --region us-east-1 \
  --certificate-arn $OLD_CERT_ARN | \
    grep NotAfter | \
      awk '{print substr($2, 1, length($2)-3)}')

# the certbot output dir in the container 
# will be mounted to the host's ~/letsencrypt
# dir hence the following declaration
PATH="letsencrypt/live/app-staging.remarkably.io"

if [ ${DERATED} -gt ${EXPIRE} ]
then
  echo 'we need to update the cert!'

  # run certbot in docker, mount output to host
  docker run -it \
    --rm \
    -e AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID \ 
    -e AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY \
    -v letsencrypt:/etc/letsencrypt \
    certbot/dns-route53 \
      certonly -n \
        --dns-route53 \
        --agree-tos \
        --email jason@remarkably.io \
        --domains app-staging.remarkably.io \

  # import the new cert to acm
  CERT_ARN=$(aws acm import-certificate \
    --certificate "$PATH/cert.pem" \
    --private-key "$PATH/privkey.pem" \
    --certificate-chain "$PATH/fullchain.pem" | \
      python -c "import sys, json; print(json.load(sys.stdin)['CertificateArn'])")

  # find the current etag (version) of our distribution 
  CURRENT_ETAG=$(aws cloudfront get-distribution-config --id $CLOUDFRONT_DIST_ID | \
    python -c "import sys, json; print(json.load(sys.stdin)['ETag'])")
  
  # get the "old" config from cloudfront
  PREVIOUS_CFG=$(aws cloudfront get-distribution-config --id $CLOUDFRONT_DIST_ID)

  UPDATE_CFG=$(aws cloudfront get-distribution-config --id $AWS_CLOUDFRONT_DIST_ID | \
    python -c "import sys, json, ast; \
      distConfig=json.load(sys.stdin); \
      distConfig['DistributionConfig']['ViewerCertificate']['ACMCertificateArn']='"$CERT_ARN"'; \
      distConfig['DistributionConfig']['ViewerCertificate']['Certificate']='"$CERT_ARN"'; \
      print(json.dumps(distConfig['DistributionConfig']))")
  aws cloudfront update-distribution --if-match=''"$CURRENT_ETAG"'' --id $CLOUDFRONT_DIST_ID --distribution-config=''"$UPDATE_CFG"''

  # cleanup and remove the old cert
  aws acm delete-certificate --certificate-arn $OLD_CERT_ARN

  else
    # just log out how long we have left and continue...
    VALID_UNTIL=$((($EXPIRE-$NOW) / $DAY))
    echo "cert is valid for $VALID_UNTIL days"
fi
