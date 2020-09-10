
var flowNumber = Cypress.env('flowNumber');

var accountSID = Cypress.env('accountSID') ;
var authToken = Cypress.env('authToken') ;
var testAccountNumber = Cypress.env('testAccountNumber') ;  //number of the tester -  we can restrict our flow to only that number
var flowSid = Cypress.env('flowSid') ; 
var accountSIDFlow = Cypress.env('accountSIDFlow') ;
var authTokenFlow = Cypress.env('authTokenFlow') ;
var loggerDb = Cypress.env('loggerDb') ;


/*  

happy path
Given:
      - A customer has been delivered a service by a professional with id job_id
      - We want any system to be able to request feedback from this customer asap
When:
      - As soon as a customer has finished being serviced
      - The system sends an API request with the following information (number, name, surname, job_id, To number, From numnber"
    
Then: 
      - The customer does not receive the SMS and the System receives an error
      - It should start the CSAT SMS survey with copy: "........"
*/




describe('Send request to start SMS CSAT form', () => {
      
      it('Text format is correct but customer does not receive SMS and system throws error', () => {

          //reset the state to start
          cy.stopTestFlow(); // we start the flow from 0
          cy.wait(5000);
          cy.resetTestMessage();
          ////////

      cy.request({
            method: 'POST', 
            url: `https://studio.twilio.com/v2/Flows/${flowSid}/Executions`,
            auth: { user: accountSIDFlow, pass: authTokenFlow},
            form: true,
            body: {
                "To": "+515005550003",
                "From": flowNumber,
                "Parameters": "{\"name\":\"NAME\",\"surname\":\"SURNAME\",\"job_id\":\"AAA\"}"
            }
        });

      
      })

      it('The last step of the flow sends a log entry to the database with the correct format', () => {
            cy.wait(12000);
            cy.lastStepIs('logger');
      })
      it('The logger database has received the log entry correctly', () => {
           
            //cy.lastStepIs('logger');
            cy.CheckNewEntryInLogger(`${loggerDb}`)
      })  

  })



/*  

happy path
Given:
      - A customer has been delivered a service by a professional with id job_id
      - We want any system to be able to request feedback from this customer asap
When:
      - As soon as a customer has finished being serviced
      - The system sends an API request with the following information (number, name, surname, job_id, To number, From numnber"
    
Then: 
      - The customer receives a request to fill a CSAT form via SMS
      - It should start the CSAT SMS survey with copy: "........"
*/




describe('Send request to start SMS CSAT form', () => {
      
      it('Text format is correct and customer receives first question', () => {

          //reset the state to start
          cy.stopTestFlow(); // we start the flow from 0
          cy.wait(5000);
          cy.resetTestMessage();
          ////////

      cy.request({
            method: 'POST', 
            url: `https://studio.twilio.com/v2/Flows/${flowSid}/Executions`,
            auth: { user: accountSIDFlow, pass: authTokenFlow},
            form: true,
            body: {
                "To": testAccountNumber,
                "From": flowNumber,
                "Parameters": "{\"name\":\"NAME\",\"surname\":\"SURNAME\",\"job_id\":\"AAA\"}"
            }
        });
     
      cy.wait(8000); //less than the widget waiting time!!!

      cy.checkMessage().should('eq', 'Thank you so much for your visit. On a scale of 1-10, how would you rate the service AAA  provided today?');
      })
  })

/*  

unhappy path
Given:
      - A customer decides not to answer the question
     
When:
      - the system has been waiting for over 3600 seconds
Then: 
      - The system will log a message with format "...."
*/
describe('System has been waiting for over 3600 sec', () => {
      
      it('The last step of the flow sends a log entry to the database with the correct format', () => {
            cy.wait(361000);
            cy.lastStepIs('logger');
      })

      
      it('The customer should get the direct access message', () => {
            cy.checkMessage().should('eq', 'We could not process your feedback. Please call our Customer Service  if you\'d like to speak directly with one of our advisors.');
      });

      it('The logger database has received the log entry correctly', () => {
           
            //cy.lastStepIs('logger');
            cy.CheckNewEntryInLogger(`${loggerDb}`)
      })  

  })


  