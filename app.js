require('chromedriver');

var express = require('express');
var app = express();
var useragent = require('express-useragent');
const port = process.env.PORT || 5000;

//Webdriver for automation
var webdriver = require('selenium-webdriver');
var driver = new webdriver.Builder()
  .forBrowser('chrome')
  .build();

//Api entrance point
  app.get('/', (req, res) => {
    var data = {
        status: "success"
    }
    res.status(200).json(data);
})

/*
Api requst for login, after going page please scan whatsapp code
*/
app.get('/login', (req, res) => {
    var source = req.header('user-agent');
    var ua = useragent.parse(source);
        driver.get('https://web.whatsapp.com/');
    
        var data = {
            status: "Login successfull"
        }
    res.status(201).json(data);
})

/*
Api request for sending whatsapp message automatically
Request example => localhost:5000/phonenum/message
*/
app.get('/:phonenum/:message', (req, res) => {
    sendMessage(req);  
    var data = {
            status: "Sending message succesfull",
            message: req.params.message,
            phonenumber: req.params.phonenum
        }      
    res.status(201).json(data);
})

/* 
 Call this function providing a req parameter to send a message
 The req should contain number and message. (req.params.phonenum and req.params.message)
*/
function sendMessage(req)
{
    var source = req.header('user-agent');
    var ua = useragent.parse(source);
    
        //Sending message detail to any phone number using Whatsapp click to chat feature
        var encodedMessage = encodeURIComponent(req.params.message);
        driver.get(`https://web.whatsapp.com/send?phone=+${req.params.phonenum}&text=${encodedMessage}`);       
        
        //Page load wait
        driver.wait(function() {
            return driver.executeScript('return document.readyState').then(function(readyState) {
              return readyState === 'complete';
            });
          }).then(function(){
              //Time interval depends on your internet connection 2500 means 2.5 seconds
              setTimeout(function(){
                //Getting send button
                var btnSend = driver.findElement(webdriver.By.xpath('//footer/div/div[3]/button'));
                
                //Sending whatsapp message
                btnSend.click(); 
              },15000);
            
      });       
}

app.listen(port, (err) => {
    console.log(`Available at http://localhost:${port}`);
    if (err) {
        console.log(err);
    }
})
    
