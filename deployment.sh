#!/bin/bash
echo This code uses Twilio CLI, CURL, GCP CLI
echo "For Twilio CLI do \"brew install twilio\" or upgrade to latest version \"brew upgrade twilio\""
echo using twilio plugins:install @twilio-labs/plugin-serverless
echo DO NOT FORGET TO CHANGE Twilio CLI profile to the account you want to use 

echo "$TWILIO_ACCOUNT_SID"

echo Deploying Strapi
strapi_db="http://csat.ngrok.io"
echo "Strapi DB: $strapi_db"


echo Deploying the logger Twilio Function
# rm .twilio-functions ## comment out if deployed in a new account or a different service is needed (50 services per account max)
twilio profiles:use csat-integration
twilio serverless:deploy  --service-name=logger --environment=stage > logger.out 
input="logger.out"
while IFS= read -r line
do
    tmp_url="${line/public \/logger /}"
    if  [ "$line" != "$tmp_url" ]; then
        echo "Logger URL: $tmp_url"
        logger_url="$tmp_url"
    fi   
done < "$input"
echo "$logger_url"

echo Deploying the Twilio Studio Flow

twilio profiles:use signal2020

dev_studio_flow=FW38e17c463fa48587708810f3b184b974

twilio api:studio:v2:flows:fetch --sid "$dev_studio_flow" > ./studio/csat-sms-form.json