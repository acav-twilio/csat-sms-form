//receiving phone number: +1 205 582 7431

/*if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
  }
*/
require('custom-env').env('dev')

const express = require('express');
const app = express();
const port = process.env.PORT || 3000;




app.use(express.urlencoded({
    extended: true
  }));

//test server get not used

app.get('/', (req, res) => {
    res.send('Hello World!')
  });

//post used to write down latest message received 

app.post('/',(req, res) => {
    console.log(`${Date(Date.now()).toLocaleString('en-GB')} ${req.body.Body}`);
    var fs = require('fs');
    //var json = JSON.stringify(obj);
    fs.writeFile('test.text', req.body.Body, 'utf8', function writeFileCallback(err, data){  //very simple verification by user
        if (err){
            console.log(`${Date(Date.now()).toLocaleString('en-GB')} ${err}`);
        }else{
            console.log(`${Date(Date.now()).toLocaleString('en-GB')} test.txt updated`);
        }
    });
  });

app.listen(port, () =>{
    console.log(`Testing app listening at http://localhost:${port}`)

});

const token = process.env.TOKEN 

var testDomain = process.env.TESTER_URL || "testerSignal2020"

const ngrok = require('ngrok');

(async function() {
    const url = await ngrok.connect(
        {
            proto: 'http',
            addr: port,
            subdomain: testDomain,
            authtoken: token
    }
    )
    console.log(`Testing app listening at ${url}`)
})();