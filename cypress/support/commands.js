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

    });

  
});

Cypress.Commands.add('lastStepIs', (stepDetails)=>{

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
                    cy.log(JSON.stringify(response.body.context));
                    //return response.body.steps[0];
                });
            });
        //}

    });

})