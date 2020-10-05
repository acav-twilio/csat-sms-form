# **Build & Repeat: CI & CD with Twilio Studio Flows and Serverless Runtime Projects**


## **This repo and its accompanying instructions outline the pathway to setting up an end-to-end testing, integration and deployment workflow. We will be using bash scripts, the twilio CLI, APIs and some Node.js code.**

In our example, we will be starting a new Twilio project from scratch. The project will build a Customer Satisfaction Survey via SMS. You can see the architecture diagram below. 

![Screen Shot 2020-09-30 at 12 11 35 AM](https://user-images.githubusercontent.com/34189788/94625854-ae335a00-02b1-11eb-8479-a4ba4c58a566.png)

When using this repo as a reference for your future working, you can substitute the placeholder values for the account SID and auth token for your development, staging and production environments. 

In this instance, we’ve opted to use three subaccounts to simulate the progress from environment to environment. 

Note regarding external services: We will not be developing from the Strapi-side. Strapi’s headless CMS service will serve as an example for an external API-enabled database containing customer details i.e. name, job number etc. You can find more about Strapi in [their website](https://strapi.io/).


## **Download code repository**

Download your own local copy of this repo to your machine using `[.Zip ] `

We will call this copy's root folder 'csat-form-master' from now on.

Unzip the file into your local user directory. 

Navigate to the file in your directory and open in VSCode:


```
$ cd csat-form-master
$ code
```



## **Installation**

Firstly, start by installing the latest versions of Twilio CLI and Serverless Plugins:


```
$ npm install twilio-cli -g

$ twilio plugins:install @twilio-labs/plugin-serverless
```


If you already have Twilio CLI installed, run the following:


```
$ brew upgrade twilio-cli
```


Or if you’re a node developer running a version later than 10.0


```
$ npm i twilio-cli
```



## **Setup**

First up, login to you Twilio dev account via the command line:


```
$ twilio profiles:list
$ twilio profiles:use 
```


If you need to create a new profile from scratch in which to host your dev environment (recommended) then use the following command:


```
$ twilio profiles:create
```


You will need your Twilio Account SID and Auth Token for the above action.

Initialise the serverless plugin and create your new project to kick off the project structure creation. 

`$ twilio serverless:init myproject` **← Feel free to name your project whatever you want**

Navigate towards said project:


```
$ cd myproject
```


And initialise the server:


```
$ npm start
```


Now if you navigate to [http://localhost:3000/](http://localhost:3000/index.html), your Twilio Serverless project should be live!

![Screen Shot 2020-09-22 at 6 59 51 PM](https://user-images.githubusercontent.com/34189788/94625884-c4411a80-02b1-11eb-9f68-beda12520f2c.png)

Next, you’ll want to delete the pre-made assets (_myproject > assets > _delete _index.html, message.private.js _and _style.css_), Function Templates (_myproject > functions > hello-world.js _and _private-message.js_) and the .twilio-functions file. 

With your project environment cleared up, it’s time to install your dependencies. In this instance, we’ll be using the following services:


```
$ npm install concurrently
$ npm install custom-env
$ npm install ngrok
$ npm install axios 
```


Now, with your dependencies installed on your development environment using the Twilio Serverless Runtime project structure, you’ll need to look at the pre-made repo and use the .env.dev.example to set your environment variables inside your project. 

Here’s a quick guide to which credentials/SIDs/tokens you should use in each instance:


<table>
  <tr>
   <td>Key
   </td>
   <td>Reference
   </td>
  </tr>
  <tr>
   <td><code>NGROK_TOKEN=1avsgIzuHYUIKppdmP6rG6gN2hy_ECXsCMBQUkLb7hsW49Kk</code>
   </td>
   <td>This is the token for the Ngrok account that allows us to set subdomain - note that this is not essential. You can configure your own non-custom ngrok tunnel for this process to work. (If you are working behind a corporate firewall, read our note at the end of the exercise)
   </td>
  </tr>
  <tr>
   <td><code>TESTER_URL=testerSignal2020</code>
   </td>
   <td>Ngrok subdomain that’s surfacing your testing server - change to suit your project name [for free account holders, see note above]
   </td>
  </tr>
  <tr>
   <td><code>flowSid/</code>
<p>
<code>flowSidSource=FWxxxxxxxxxxx</code>
   </td>
   <td>Unique identifier of the Studio flow that you’re trying to replicate
   </td>
  </tr>
  <tr>
   <td><code>accountSIDFlow=ACxxxxxxxxx</code>
   </td>
   <td>Unique identifier of the originating account that you’re cloning your Studio flow from
   </td>
  </tr>
  <tr>
   <td><code>authTokenFlow=xxxxxxxxxxx</code>
   </td>
   <td>Auth token for the originating account that you’re cloning your Studio flow from 
   </td>
  </tr>
  <tr>
   <td><code>targetAccountSid=ACxxxxxx</code>
   </td>
   <td>Unique account SID identifier of the project you’ve created for your dev environment 
   </td>
  </tr>
  <tr>
   <td><code>targetAccountToken=xxxxxxxxxxx</code>
   </td>
   <td>Auth token for the project you’ve created for your dev environment 
   </td>
  </tr>
  <tr>
   <td><code>LOGGER_SERVICE_URL=<a href="https://csat.ngrok.io/logs?token=abcdefghijk">https://csat.ngrok.io/logs?token=abcdefghijk</a></code>
   </td>
   <td>The externally reachable URL for your logger service
   </td>
  </tr>
</table>


Save your newly updated “.env.dev” file and delete the example. 

Firstly, copy the logger.js function from the pre-prepared repo, and paste it in the **functions** folder within your project. 


```
$ cd functions
$ cp logger.js /Users/usr/csat-sms-form/myproject/functions
```


One of the last steps that you need to take before running your first bash script will be to set up a mock server. Both the logger service (logger.js) and the Studio HTTP widget will be connected to the mock server in its first instance. This mock service will simply respond with a 200/OK response whenever reached. You can find information about how to spin up your own mock service [here](https://learning.postman.com/docs/designing-and-developing-your-api/mocking-data/setting-up-mock/#:~:text=In%20Collections%20on%20the%20left%20of%20Postman%2C%20use%20the%20overview,or%20mock%20an%20existing%20one.). 

The idea behind the way we’re incorporating services, is step by step. We want to up the complexity of our program in a very incremental manner. 

With your mock service up and running, copy the folder **bash_scripts** to your new project, navigate to the root of the project, and then run this command: 


```
$ bash bash_scripts/deployDevEnv.sh
```


The above command will have deployed the logger function to your Twilio dev environment. 

Next, step into your Twilio console, to view your newly deployed service!

<img width="1230" alt="Screen Shot 2020-09-24 at 11 33 32 PM" src="https://user-images.githubusercontent.com/34189788/94625904-cefbaf80-02b1-11eb-8eaf-641dbf7167ee.png">

Jump into the Studio flow and assign the logger service to the endpoint within your Studio flow. You’ll need to make sure that your Studio Flow is completely free of any external URLs. 

<img width="827" alt="Screen Shot 2020-09-24 at 11 41 17 PM" src="https://user-images.githubusercontent.com/34189788/94625909-d0c57300-02b1-11eb-8122-e8e32d6028bc.png">

While you’re there, also update your environment, and function usage:

<img width="761" alt="Screen Shot 2020-09-24 at 11 44 22 PM" src="https://user-images.githubusercontent.com/34189788/94625914-d1f6a000-02b1-11eb-9880-7afca883c1bb.png">

And as always, hit **save **and **publish. **

With your function deployed to your dev environment, credentials updated and dependencies installed, you’ll lastly need to configure the phone number that you’ll be testing from (your one key static asset in this process) to the desired Studio flow that you’d like to alter. 

This can be done [in the console, under the numbers icon](https://www.twilio.com/console/phone-numbers/incoming) or via the CLI. 


## **Creating your Twilio testing account**

Now, in order to simulate user behaviour within your development environment, you’ll firstly need to create an additional account that's completely independent from your project account with its own SID and auth token, purely for programmatic testing. 

Once you have you testing Twilio account set, run:


```
$ twilio profiles:create testing
```


Next, head to the console to purchase a number. 

 \
As always, there’s a CLI shortcut for that! Run the below command replacing the placeholder with a number available to purchase. 


```
$ twilio api:core:incoming-phone-numbers:create \
  --phone-number="+[available phone number in e.164 format]"
```


You’ll need these details in the following section on testing to create a functioning test environment from which to alter your flow. 


## **Testing**

Copy across the testing service folder `/test_service` to your project.

The test service itself contains a file that spins up a server that will write the message body of the SMS messages that your Twilio testing phone number receives from your flow, and print them to a file. 

The programme will parse your ngrok auth token, and use this to assign a custom domain name to your ngrok tunnel in order to keep it consistent, and externally accessible. 

It’s possible to spin up your testing service using a free standard ngrok account, but you’ll have to bear in mind that ngrok assigns a one-time session ID for your url. As a reminder, this externally accessible URL is referenced as the TESTER_URL throughout the dependency documentation. We recommend you use a fixed URL, it will simplify the process.

For the test service to operate, you must assign the ngrok public url as a webhook for the Twilio test account SMS number. Now, every time that test number gets an SMS, your test service will write the content of the SMS into a file called `test.txt .`

At your first phase of testing, you’ll need to install the corresponding testing Library, which is in this case, Cypress. 

Once installed, you will have to clean the cypress structure from the example tests (delete file inside **integration** folder) and copy tests from the original:


```
$ npm install cypress --save-dev
```


Next, we need to import our pre-made tests, also stored in the root directory. Copy the contents of the **cypress > integration **folder from the pre-prepared repository.  


```
$ cd ..
$ cd cypress/integration
$ cp *.* myproject/cypress/integration
```


These scripts will enable you to harness Cypress’ GUI to test the functionality of your SMS flow. 

 
Before you run these tests, make sure to check the phone number variables in your code and ensure that the number referenced in your code matches the number configured to your flow within the numbers section of the console of your Twilio development account. 

And lastly, head to the package.json file within the repo, and copy across the below line of code to the scripts package within the package.json file within your project - and of course, hit save!


```
"test-dev": "concurrently --kill-others \"$(npm bin)/cypress open\" \"node test_service/server.js\""
```


 

The above script will use concurrently to run two separate programs. One of them is the Cypress testing tool (which will be reading the test.txt file to see what has been received) and the other is the test_service which will be writing what the test number simulating a person is receiving. 

Now, for Cypress to be able to test against your flow, you’ll need to copy the cypress.env example from the root to your project and update it based on the below guide:


<table>
  <tr>
   <td>Key
   </td>
   <td>value
   </td>
  </tr>
  <tr>
   <td><code>accountSID</code>
   </td>
   <td>Unique account SID identifier of the project you’ve created for your testing environment account
   </td>
  </tr>
  <tr>
   <td><code>authToken</code>
   </td>
   <td>Unique auth token for your  testing environment account
   </td>
  </tr>
  <tr>
   <td><code>testAccountNumber</code>
   </td>
   <td>Phone number tied to testing account
   </td>
  </tr>
  <tr>
   <td><code>flowSid</code>
   </td>
   <td>Unique Flow SID identifier 
   </td>
  </tr>
  <tr>
   <td><code>accountSIDFlow</code>
   </td>
   <td>Account SID for the development account hosting the flow
   </td>
  </tr>
  <tr>
   <td><code>authTokenFlow</code>
   </td>
   <td>Auth token for the development account hosting the flow
   </td>
  </tr>
  <tr>
   <td><code>flowNumber</code>
   </td>
   <td>Phone number configured to the flow
   </td>
  </tr>
  <tr>
   <td><code>csatDB</code>
   </td>
   <td>External ngrok tunnel to the strapi database
   </td>
  </tr>
  <tr>
   <td><code>loggerDb</code>
   </td>
   <td>External ngrok tunnel to logger function
   </td>
  </tr>
</table>


Save the newly updated file within your project as **cypress.env.json.**

You will also have to copy the contents of the 'csat-form-master >  Cypress > Integration > command.js into myproject > Cypress > Integration >  Command.js

Cypress is a testing framework that originally targets Web interfaces. It is a very flexible framework and allows you to expand testing into SMS or any other communication interface by adding key communication modules into the Command.js file. In our project we have expanded Cypress to be able to support SMS communications and Studio flow testing.

To start up your testing server while having Cypress running at the same time, run the following command:


```
$ npm start test-dev
```


Your tests should show your testing number interacting with your studio flow within the Cypress testing framework, and work to automate the entire process of a user going through both the HAPPY and UNHAPPY customer experience paths. 

This is the environment for you to develop your tests according to your user stories for the project at hand, and then work to develop your flow in a manner that meets your testing criteria. 

Remember - think testing and automation first. This will make your final build more robust and give it the strong foundation it needs to be continually repeated, improved and redeployed. 


## **Pushing to staging environment**

Now we’ve reached the staging environment, it’s important to remember that we’re working from the minimal amount of dependencies, to the maximum. So the order of actions will be:



1. Get the Strapi or other database URLs for logging and storing the results of the SMS survey
2. Deploy the logger Function into Staging
3. Replicate the Studio flow from Development to Staging
4. Connect the Studio Flow Webhook to the SMS phone number that we have in Staging

In order to push to the staging environment, you’ll need to add the **studio **folder and its contents to your project. Studio should not be copied or imported manually from environment to environment. Instead, we will use the Studio API and node.js to automatically import the flow from the development environment, update the dependencies (changes from dev to staging: new logger service and database URLs) and add the webhook to the phone number.

You’ll also need to update the **.env.staging **file using the previously provided key/value tables for reference in filling out the credentials and add this to your project folder using the credentials of your **staging account **as the target account. 

Firstly, ensure that your terminal is using your appropriate Twilio staging profile, and in doing so, surface the account details for this account.

In order to do this, run the following command: ` `


```
$ twilio profiles:list
```


And if you see the account you’d like to use for the staging portion of the build, use the below command:


```
$ twilio profiles:use <staging-env>
```


If not, you can go ahead and create this now by running the below:


```
$ twilio profiles:create staging
```


You can head to your [console](https://www.twilio.com/console) to grab your auth token and account SID for your staging environment and add these into your .env.staging file. 

You’ll need to export the SID and token for the staging environment using these commands. This will inform Cypress that we’re now testing our flow within the staging environment. 


```
$ export ACCOUNTSID_STAGING= 
$ export TOKENSID_STAGING=
```


Now, ahead of running your most complex bash script, you’ll need to purchase an available number, which your bash script will use to attach to your flow. 


```
$ twilio api:core:incoming-phone-numbers:create \
  --phone-number="+[available phone number in e.164 format]"
```


Add this number into your script as a variable, replacing the example:


```
mobile="+XXXXXXXXXX"
```


Once you’re all ready, deploy your bash script to push you to the staging environment:


```
$ bash bash/deployStagingEnv.sh 
```


The script will assign your staging environment variables manually, before opening and running Cypress. 

Here’s the line of code within your bash script which assigns the corresponding staging environment variables for you: 


```
$(npm bin)/cypress open  --env flowNumber=$mobile,flowSid=$flowId,accountSIDFlow=$ACCOUNTSID_STAGING,authTokenFlow=$TOKEN_STAGING
```


Perform your staging environment tests. 


## **Pushing to the production environment**

For the final stage of your build, you’ll be pushing production-ready code. This deployment will be very similar to staging, except in this instance, you won’t be performing any testing. 

First up, if you don’t have your production profile set-up and ready to go, here’s a refresher on how to create that:


```
$ twilio profiles:list
$ twilio profiles:create production
```


Next, you’ll need to surface both the account SID and auth token and get these added to your new environment file. Remember also to update the script with the phone number of your production environment.

Use the .**env.production.example **as a guide:


<table>
  <tr>
   <td>Key
   </td>
   <td>value
   </td>
  </tr>
  <tr>
   <td><code>flowSidSource</code>
   </td>
   <td>Unique Flow SID identifier 
   </td>
  </tr>
  <tr>
   <td><code>accountSIDFlow</code>
   </td>
   <td>Account SID for the development account hosting the flow
   </td>
  </tr>
  <tr>
   <td><code>authTokenFlow</code>
   </td>
   <td>Auth token for the development account hosting the flow
   </td>
  </tr>
  <tr>
   <td><code>targetAccoundSid</code>
   </td>
   <td>Account SID for the production account hosting the flow
   </td>
  </tr>
  <tr>
   <td><code>targetAccountToken</code>
   </td>
   <td>Auth token for the production account hosting the flow
   </td>
  </tr>
  <tr>
   <td><code>Logger_service_URL=</code>
   </td>
   <td>External ngrok tunnel to logger function
   </td>
  </tr>
</table>


With your environment ready to go, navigate to the root of your project and run the final deployment script to push to production 😎


```
$ bash bash_scripts/deployProductionEnv.sh
```

# **Developing and testing your solutions behind a firewall**

If you work in a corporate environment, it is likely that you will not be able
to run NGROK to simulate a telephone receiving SMS. Twilio still requires  you
to direct the events on SMS reception to a publicly available webhook. In these circumstances, we recommend that you work with the NetOps or ITOps team of your company to explore one of these two options:

1. If your solution requires access to both internal and external resources, set your development machine in the DMZ and work with the IT team to externalise an address and port in a secure way. We are assuming that your IT team already allows to you use the Twilio API and all external resources your require, so you just need a secure and controlled route towards your dev machine (an url to use with Twilio). A virtual machine inside the DMZ should be easily accessible via your laptop directly or using a VPN. Ask your IT team.

2. If you do not need any access to any local resouces and you are developing a full cloud solution, consider setting your dev environment in the cloud. Do not forget to use best practices in terms of protection by restricting all access to that machine beyond the controlled routes. In this case it is likely that you will be able to use Ngrok. You will be in full control. Ask your IT team what public cloud provider tehy recommend and what the best way to connect to the dev machine your want to set up.