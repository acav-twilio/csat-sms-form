
const args = process.argv.slice(2);  //we pass the URL of the  and the function as arguments // $strapi_db $serviceSid $environmentSid $functionSid $logger_url 
 

var dbApiUrl = args[0];
var functionSid =  args[3];
var serviceSid = args[1];
var environmentSid = args[2];
var logger_url = args[4];
var environment = args[5];

if(environment=='staging'){
    require('custom-env').env('staging')
}
else if(environment=='production'){
    require('custom-env').env('production')
}
else
{
    console.log("not known environment - aborting");
    process.exit(0);
}

const accountSid = process.env.accountSIDFlow;
const authToken = process.env.authTokenFlow;
const flowSidSource = process.env.flowSidSource;
const accountSidTarget = process.env.targetAccountSid;
const authTokenTarget = process.env.targetAccountToken;

var twilio = require('twilio');

var clientSource = new twilio(accountSid, authToken);   //Dev
var clientTarget = new twilio(accountSidTarget, authTokenTarget); //Staging




  const fs = require('fs');
const { exit } = require('process');

   clientSource.studio.flows(flowSidSource)
             .fetch().then(flow => {
            //console.log(JSON.stringify(flow));
            data = JSON.stringify(flow.definition,null, 4);
            fs.writeFile('./studio/csat-form-staging.json', data, (err) => {
                if (err) {
                    throw err;
                }
                //console.log("Dev Flow JSON data is saved.");

                fs.readFile("./studio/csat-form-staging.json", function(err, data) { 
      
                    // Check for errors 
                    if (err) throw err; 
                   
                    // Converting to JSON 
                    var definition  = JSON.parse(data)
                    definition.states.forEach(function(state) { 
                        
                        if (state.name === 'logger' )
                        {
                            state.properties.url = logger_url;
                            state.properties.environment_sid = environmentSid;
                            state.properties.service_sid = serviceSid;
                            state.properties.function_sid = functionSid;
                        }

                        else if (state.name === 'send_results_to_server' )
                        {
                            state.properties.url = dbApiUrl;
                            
                        }
                    })  
                    


                      
                    clientTarget.studio.flows
                    .create({
                        commitMessage: 'Flow creation',
                        friendlyName: flow.friendlyName,
                        status: 'published',
                        definition: definition,
                    }).then(flow2 => {
                      
                        //console.log(`Flow deployed in Staging Environment account SID ${accountSidTarget}`);
                        //console.log(`Studio Flow SID ${flow2.sid}`);
                        console.log(`${flow2.webhookUrl} ${flow2.sid}`);
                    }); 
                }); 

                
            });
            
            

     });



