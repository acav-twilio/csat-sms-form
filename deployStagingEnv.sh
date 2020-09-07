#!/bin/bash
tput setaf 2
echo "This code uses Twilio CLI, CURL, GCP CLI"
echo "For Twilio CLI do \"brew install twilio\" or upgrade to latest version \"brew upgrade twilio\""
echo using twilio plugins:install @twilio-labs/plugin-serverless
echo DO NOT FORGET TO CHANGE Twilio CLI profile to the account you want to use 

echo "$TWILIO_ACCOUNT_SID"

echo Deploying Strapi
strapi_db="https://csat.ngrok.io/csat-forms?token=abcdefghijk"
echo "Strapi DB: $strapi_db"

echo
echo Deploying the logger Twilio Function
# rm .twilio-functions ## comment out if deployed in a new account or a different service is needed (50 services per account max)
twilio profiles:use csat-integration
twilio serverless:deploy  --service-name=logger --environment=staging --env='.env.staging' --force > logger-staging.out 
input="logger-staging.out"
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


rm logger-staging.out
twilio api:serverless:v1:services:functions:list --service-sid "$serviceSid" > logger-staging.out
input="logger-staging.out"
while IFS= read -r line
do
    tmp_url4="${line/\/logger /}"
    #echo $line
    if  [ "$line" != "$tmp_url4" ]; then
        functionSid=$(echo $tmp_url4 | cut -d' ' -f 1 )
        
    fi
done < "$input"

tput setaf 2

echo
echo "Logger URL: $logger_url"
echo "Logger environmentSid: $environmentSid"
echo "Logger serviceSid: $serviceSid"
echo "Logger functionSid: $functionSid"
echo
echo Deploying Twilio Studio Flow

twilio profiles:use signal2020
#//we pass the URL of the  and the function as arguments 0 and 1; env_sid; function_sid; service_sid
tput setaf 2

echo "node ./studio/fetchStudioFlow.js $strapi_db $serviceSid $environmentSid $functionSid $logger_url   "
node ./studio/fetchStudioFlow.js $strapi_db $serviceSid $environmentSid $functionSid $logger_url  