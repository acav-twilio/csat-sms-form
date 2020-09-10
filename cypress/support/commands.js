// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

var accountSID = Cypress.env('accountSID') ;
var authToken = Cypress.env('authToken') ;
var accountSID_t = Cypress.env('accountSID') ; //for failing requests
var authToken_t = Cypress.env('authToken') ;  //for failibg requests
var testAccountNumber = Cypress.env('testAccountNumber') ;  //number of the tester -  we can restrict our flow to only that number
var flowSid = Cypress.env('flowSid') ; 
var accountSIDFlow = Cypress.env('accountSIDFlow') ;
var authTokenFlow = Cypress.env('authTokenFlow') ;

//var twilio = require('twilio');  --> not compatible with Cypress

//var client = twilio(accountSID, authToken);

Cypress.Commands.add("sendSms", (to, msg) => {

    cy.request({
        method: 'POST', 
        url: `https://api.twilio.com/2010-04-01/Accounts/${accountSID}/Messages.json`,
        auth: { user: accountSID, pass: authToken},
        form: true,
        body: {
            "To": to,
            "Body": msg,
            "From": testAccountNumber
        }
    });
 
});

Cypress.Commands.add("sendFailingSms", (to, msg) => {

    cy.request({
        method: 'POST', 
        url: `https://api.twilio.com/2010-04-01/Accounts/${accountSID}/Messages.json`,
        auth: { user: accountSID, pass: authToken},
        form: true,
        body: {
            "To": "+15005550003", //does not have international permissions to the receiver (it would not be received in the first case anyway - just as an example)
            "Body": msg,
            "From": testAccountNumber
        }
    });
 
});

Cypress.Commands.add("checkMessage", () => {
    cy.readFile('test.text')
});

Cypress.Commands.add("resetTestMessage", () => {
    cy.writeFile('test.text', "");
});

Cypress.Commands.add("stopTestFlow", () =>{
    
    cy.request({
        method: 'GET', 
        url: `https://studio.twilio.com/v2/Flows/${flowSid}/Executions`,
        auth: { user: accountSIDFlow, pass: authTokenFlow}
    }).then((response) => {

        cy.log(response.body);
        
        var execution = response.body.executions[0];
        if(execution){
            cy.log(response.body.executions[0]);
            cy.log(response.body.executions[0].sid);
            cy.log(response.body.executions[0].status);

            if(response.body.executions[0].status!="ended")
            {
                var executionSid = execution.sid;

                cy.request({
                    method: 'POST', 
                    url: `https://studio.twilio.com/v2/Flows/${flowSid}/Executions/${executionSid}`,
                    auth: { user: accountSIDFlow, pass: authTokenFlow},
                    form: true,
                    body: {
                        "Status": "ended"
                    }
                });
            }
        }

    });

  
});

Cypress.Commands.add('lastStepIs', (widget_name)=>{

    cy.request({
        method: 'GET', 
        url: `https://studio.twilio.com/v2/Flows/${flowSid}/Executions`,
        auth: { user: accountSIDFlow, pass: authTokenFlow}
    }).then((response) => {

        cy.log(response.body);
        var execution = response.body.executions[0];
        cy.log(response.body.executions[0]);
        cy.log(response.body.executions[0].sid);
        cy.log(response.body.executions[0].status);
        
       // if(response.body.executions[0].status!="ended")
       // {
            var executionSid = execution.sid;

            cy.request({
                method: 'GET', 
                url: `https://studio.twilio.com/v2/Flows/${flowSid}/Executions/${executionSid}/Steps?PageSize=20`,
                auth: { user: accountSIDFlow, pass: authTokenFlow}
            }).then((response) => {
                cy.log(JSON.stringify(response.body.steps[0].links.step_context));
                cy.request({
                    method: 'GET', 
                    url: `${response.body.steps[0].links.step_context}`,
                    auth: { user: accountSIDFlow, pass: authTokenFlow}
                }).then((response) => {
                    cy.log(JSON.stringify(response.body.context.widgets));
                    //cy.log(JSON.stringify(response.body.context.widgets.logger));
                    //cy.log(JSON.stringify(response.body.context.widgets.logger.parsed.config.data));
                    cy.expect(response.body.context.widgets).to.have.ownProperty(widget_name)
                    //return response.body.steps[0];
                });
            });
        //}

    });

})


Cypress.Commands.add('CheckExistanceOfEntryInDB', (dbUrl,name, surname, phone_number,job_id )=>{
    cy.request({
        method: 'GET', 
        url: dbUrl
    }).then((response) => {
        cy.log(JSON.stringify(response.body));

        function isFeedback(obj) {
            return ( obj.name === name || obj.surname === surname || obj.phone_number === phone_number || obj.job_id === job_id)
        };
        var csat = response.body.find(isFeedback);
        cy.expect(csat).not.to.be.undefined
     });
});

Cypress.Commands.add('DeleteCsatInDb', (dbUrl,name, surname, phone_number,job_id )=>{
    cy.request({
        method: 'GET', 
        url: dbUrl
    }).then((response) => {
        cy.log(JSON.stringify(response.body));

        function isFeedback(obj) {
            return ( obj.name === name || obj.surname === surname || obj.phone_number === phone_number || obj.job_id === job_id)
        };
        var csat = response.body.find(isFeedback);
        if (csat){
            //hack for the auth token to work - each system might have its own auth method
             
            cy.request({
                method: 'DELETE', 
                url: `${dbUrl.replace("?",`/${csat.id}?`)}`});
        }
     });
});


Cypress.Commands.add('CheckNewEntryInLogger', (dbUrl)=>{
    var query = "&_sort=created_at:desc&_limit=1" //que the latest log entry

    
    cy.request({
        method: 'GET', 
        url: `${dbUrl}${query}`
    }).then((response) => {
        cy.log(JSON.stringify(response.body));
        var logEntry = response.body[0];
        var date = Date.parse(logEntry.created_at)
        var difference = Date.now() - date
        cy.expect(difference).to.be.lessThan(60000) //1 minute
        logEntry.date_time.not.to.be(null)
        logEntry.entry.not.to.be(null)
     });
});