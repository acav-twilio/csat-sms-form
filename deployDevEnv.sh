#!/bin/bash
echo This code might use Twilio CLI, CURL, GCP CLI
echo "For Twilio CLI do \"brew install twilio\" or upgrade to latest version \"brew upgrade twilio\""
echo using twilio plugins:install @twilio-labs/plugin-serverless
echo DO NOT FORGET TO CHANGE Twilio CLI profile to the account you want to use 
echo
echo
echo "Deploying the logger Twilio Function in Dev Environment"
#twilio profiles:list  ## comment out if you want to verify what twilo account you are deploying to
#rm .twilio-functions ## comment out if deployed in a new account or a different service is needed (50 services per account max)
twilio serverless:deploy  --force --service-name=logger --environment=dev --env='.env.dev' > logger-dev.out   #force will write over any other service with the same name 
# optional print out the results of the deploymnet ##
#input="logger-dev.out"
#while IFS= read -r line
#do
#    echo $line
#    fi   
#done < "$input"


