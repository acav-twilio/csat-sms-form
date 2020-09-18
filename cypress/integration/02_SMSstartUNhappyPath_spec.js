var flowNumber = Cypress.env('flowNumber');

/*  


unhappy path
Given:
      - I have been delivered service by a professional with id job_id
      - I want to leave feedback by SMS and I have been given a number
When:
      - I send and email that does not say "feedback job {jobiD}"
      
Then: 
      - I should get an SMS back within 1 minute (for our purposes we will reduce this timing)
      - The CSAT form should ignore my SMS
      */

describe('Trigger the CSAT SMS form via SMS', () => {
 
    it('The SMS does not have the right format', () => {
           //reset the state to start
           cy.stopTestFlow(); // we start the flow from 0
           cy.wait(5000);
           cy.resetTestMessage();
           ////////

      cy.sendSms(`${flowNumber}`, "This message is not compliant");
      cy.wait(10000); //wait at least 10 seconds for the response -  the real tests should be 1 minute if that is the required max not to fail
      cy.checkMessage().should('eq', '');
  //    expect(true).to.equal(true)
    });

  });


