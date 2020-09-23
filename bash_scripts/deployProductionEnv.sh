#!/bin/bash


echo "This code uses Twilio CLI, CURL, GCP CLI"
echo "For Twilio CLI do \"brew install twilio\" or upgrade to latest version \"brew upgrade twilio\""
echo using twilio plugins:install @twilio-labs/plugin-serverless
echo DO NOT FORGET TO CHANGE Twilio CLI profile to the account you want to use for production
echo
echo "$ACCOUNTSID_PRODUCTION"
echo "$TOKEN_PRODUCTION"
echo
echo Deploying Strapi
strapi_db="https://csat.ngrok.io/csat-forms?token=abcdefghijk" #deploy in production - test and generate access token
logger_db="https://csat.ngrok.io/logs?token=abcdefghijk"
echo "CSAT DB: $strapi_db"
echo "LOGS DB: $logger_db"
echo
echo
echo Deploying the logger Twilio Function
echo
npm uninstall cypress
npm uninstall ngrok
npm uninstall concurrently
npm uninstall custom-env
rm .twilio-functions ## comment out if deployed in a new account or a different service is needed (50 services per account max)
twilio profiles:use csat-production
twilio serverless:deploy  --force --service-name=logger --environment=production --env='.env.production'  > logger-production.out 

tput setaf 2
echo
echo Extract serviceSid environmentSid functionSid functionURL from output
echo   
input="logger-production.out"
while IFS= read -r line
do
    tmp_url="${line/public \/logger /}"
    echo "$line"
    if  [ "$line" != "$tmp_url" ]; then
       
        logger_url="$tmp_url"
    else 
        tmp_url2="${line/environmentSid /}"
        if  [ "$line" != "$tmp_url2" ]; then
            environmentSid="$tmp_url2"
        else 
            tmp_url3="${line/serviceSid /}"
            if  [ "$line" != "$tmp_url3" ]; then
                serviceSid="$tmp_url3"
            fi 
        fi
    fi
done < "$input"

rm logger-production.out
twilio api:serverless:v1:services:functions:list --service-sid "$serviceSid" > logger-production.out
input="logger-production.out"
while IFS= read -r line
do
    tmp_url4="${line/\/logger /}"
    #echo $line
    if  [ "$line" != "$tmp_url4" ]; then
        functionSid=$(echo $tmp_url4 | cut -d' ' -f 1 )
        
    fi
done < "$input"

echo
echo "Logger URL: $logger_url"
echo "Logger environmentSid: $environmentSid"
echo "Logger serviceSid: $serviceSid"
echo "Logger functionSid: $functionSid"
echo

echo Deploying Twilio Studio Flow

echo Fetch Studio Flow, Update and Upload to production Environment

twilio profiles:use csat-dev
#//we pass the URL of the  and the function as arguments 0 and 1; env_sid; function_sid; service_sid
npm install custom-env
echo "node ./studio/fetchStudioFlow.js $strapi_db $serviceSid $environmentSid $functionSid $logger_url   "
echo
output=$(node ./studio/fetchStudioFlow.js $strapi_db $serviceSid $environmentSid $functionSid $logger_url production)
webhook=$(echo $output | cut -d' ' -f 1 )
flowId=$(echo $output | cut -d' ' -f 2 )
echo $output
echo $webhook
echo $flowId
tput setaf 2
echo
echo "Attach Flow to a phone number +33 6 44 64 33 21"
echo

phone="+33644643321"
twilio profiles:use csat-production
twilio phone-numbers:update $phone --sms-url=$webhook
