
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

var flowNumber = Cypress.env('flowNumber');

var accountSID = Cypress.env('accountSID') ; //test account
var authToken = Cypress.env('authToken') ; //test account
var testAccountNumber = Cypress.env('testAccountNumber') ;  //number of the tester -  we can restrict our flow to only that number
var flowSid = Cypress.env('flowSid') ; 
var accountSIDFlow = Cypress.env('accountSIDFlow') ;
var authTokenFlow = Cypress.env('authTokenFlow') ;
var csatDb = Cypress.env('csatDB');



describe('Send request to start SMS CSAT form', () => {
      
      it('Text format is correct and customer receives first question', () => {
           

          //reset the state to start
          cy.stopTestFlow(); // we start the flow from 0
          cy.wait(5000);
          cy.resetTestMessage();
          cy.DeleteCsatInDb(`${csatDb}`,"NAME", "SURNAME",testAccountNumber,"AAA");
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
     
      cy.wait(5000);
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
      
      it('Customer answers as expected and receives second question', () => {
      cy.resetTestMessage();

      cy.sendSms(`${flowNumber}`, "2"); //change number by variable
      cy.wait(5000);

     
      cy.checkMessage().should('eq', 'On a scale of 1-10, how likely are you to recommend our company to a friend?');
      })
  })

/*  

happy path
Given:
      - A customer has engaged to answer the second question
When:
      - The customer answers the question as expected range [1-10]
Then: 
      - The system sends an SMS with the following question: "....""
*/

describe('Reaction to second question', () => {
      
      it('Customer answers as expected and receives third question ', () => {
      cy.resetTestMessage();

      cy.sendSms(`${flowNumber}`, "2"); //change number by variable
      cy.wait(5000);

     
      cy.checkMessage().should('eq', 'Please send us any additional feedback you would like to share with us.');
      })
  })



    /*  

happy path
Given:
      - A customer answers last question
When:
      - the system receives the last answer
Then: 
      - The system sends information to the DB API following the given API 
        contract : application/json + all field
      - The system should answer back: "...."
*/

describe('The system received the last question', () => {
      
      it('The system replies thank you', () => {

      cy.sendSms(`${flowNumber}`, "Anything"); //change number by variable
      cy.wait(10000);

      //check the last step
     
      cy.checkMessage().should('eq', 'Thank you so much for your feedback!');
      })

     it('At the end of the survey, all the answers are stored in a DB', () => {
          
            //TBD NOT POSSIBLE TO TEST IF NOT INTEGRATED
      
            //check the last step is an HTTP request with tjhe right format: at the momentt we 
            cy.lastStepIs('send_results_to_server');
            cy.CheckExistanceOfEntryInDB (`${csatDb}`,"NAME", "SURNAME",testAccountNumber,"AAA" )

           // .should('eq', 'Thank you so much for your feedback!');
      })
  })