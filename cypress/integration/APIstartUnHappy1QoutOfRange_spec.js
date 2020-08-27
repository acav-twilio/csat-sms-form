
/*  

happy path
Given:
      - A customer has answered to the first question
When:
      - The answer is outside the range [1-10]

    
Then: 
      - The system answers back "I'm sorry, I didn't understand. Please enter a number from 1 - 10."
*/

var flowNumber = Cypress.env('flowNumber');

var accountSID = Cypress.env('accountSID') ;
var authToken = Cypress.env('authToken') ;
var testAccountNumber = Cypress.env('testAccountNumber') ;  //number of the tester -  we can restrict our flow to only that number
var flowSid = Cypress.env('flowSid') ; 
var accountSIDFlow = Cypress.env('accountSIDFlow') ;
var authTokenFlow = Cypress.env('authTokenFlow') ;


describe('Send request to start SMS CSAT form', () => {
      
      it('Test format is correct', () => {

          //reset the state to start
          cy.stopTestFlow(); // we start the flow from 0
          cy.wait(1000);
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
     
      cy.checkMessage().should('eq', 'Thank you so much for your visit. On a scale of 1-10, how would you rate the service AAA  provided today?');
      })
  })

/*  

happy path
Given:
      - A customer has engaged to answer the first question
     
When:
      - The customer answers the question as expected range [1-10]
Then: 
      - The system sends an SMS with the following question: "....""
*/
describe('Reaction to first question', () => {
      
      it('Customer answers out of context ', () => {
      cy.resetTestMessage();

      cy.sendSms(`${flowNumber}`, "11"); //change number by variable

     
      cy.checkMessage().should('eq', 'I\'m sorry, I didn\'t understand. Please enter a number from 1 - 10.');
      })
  })

