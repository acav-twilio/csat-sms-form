exports.handler = function(context, event, callback) {
 
    //expose all incoming information
    
    console.log('CONTEXT:');
    for(var property in context) {
    console.log(property + "=" + context[property]);
    }
    
    console.log('EVENT:');
    for(var proper in event) {
    console.log(proper + "=" + event[proper]);
    }
    
    const accountSid = context.ACCOUNT_SID;
    const authToken = context.AUTH_TOKEN;
    const serviceDomain = context.DOMAIN_NAME;
    console.log(accountSid);
    console.log(authToken);
      var phone_number = "";
      var first_question = "";
      var unknown_answer_1 = "";
      var second_question = "";
      var unknown_answer_2 = "";
      var third_question = "";
      var send_results_to_server = "";
      var direct_sms = "";
      var job_id = "";
      
      if(event.customer_phone)
            customer_phone = "customer-phone: "+event.customer_phone;
      if(event.first_question)
            first_question = " :first-question: "+event.first_question;
      if(event.second_question)
            second_question = " :second-question:  "+event.second_question;
      if(event.third_question)
            third_question = " :third question: "+event.third_question;
      if(event.unknown_answer_1)
            unknown_answer_1 = " :unknown-answer-1: "+event.unknown_answer_1;
      if(event.unknown_answer_2)
            unknown_answer_2 = " :unknown-answer-2: "+event.unknown_answer_2;
      if(event.send_results_to_server)
            send_results_to_server = " :send-results-to-server: "+event.send_results_to_server;
       if(event.direct_sms)
            direct_sms = " :direct_sms: "+event.direct_sms;
      
      if(event.job_id)
            job_id = " :job_id: "+event.job_id;
                         
           
  
    // create log line
    
    var log_entry = context.customer_phone + job_id + first_question + unknown_answer_1 + second_question + unknown_answer_2 + third_question + send_results_to_server + direct_sms; 
    console.log(log_entry)
    // create time
    var moment = require('moment');
    
  /* send log line to logger */
    const axios = require('axios');
  
    axios.post(context.LOGGER_SERVICE_URL, {
      log: log_entry,
      time: moment().toISOString(),
    })
    .then(function (response) {
      console.log(response);
      callback(null, response);
    })
    .catch(function (error) {
      console.log(error);
      callback(error);
    });
        
   
  
  };