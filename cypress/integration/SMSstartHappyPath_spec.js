
/*  

happy path
Given:
      - As a customer, I have been delivered a service by a professional with id job_id
      - I want to leave feedback by SMS and I have been given a phone number to SMS
When:
      - I send an SMS that says "feedback job {jobiD}"
    
Then: 
      - I should get an SMS back within 1 minute (for our purposes we will reduce this timing)
      - The SMS should start the CSAT SMS survey with copy: "........"
*/

describe('Trigger the CSAT SMS form via SMS', () => {
    it('SMS from Customer has the right format', () => {
      //reset the state to start
      cy.stopTestFlow(); // we start the flow from 0
      cy.wait(5000);
      cy.resetTestMessage();
      ////////

      cy.sendSms("+17079294026", "Feedback job AAA"); //change number by variable
      cy.wait(5000); //wait at least 10 seconds for the response -  the real tests should be 1 minute if that is the required max not to fail
      cy.checkMessage().should('eq', 'Thank you so much for your visit. On a scale of 1-10, how would you rate the service AAA  provided today?');
      //expect(msg).to.equal(msg);
    })
   

  });

