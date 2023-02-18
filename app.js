const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const request = require('request');
const https = require('https');
app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended:true}))

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/signup.html')
})

app.post("/", (req, res) => {
  const fname = req.body.firstName;
  const lname = req.body.lastName;
  const email = req.body.userMail;
  //console.log(fname,email,lname);

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: fname,
          LNAME: lname,
        }
      }
    ]
  };

  const url = "https://us17.api.mailchimp.com/3.0/lists/6d45101bc5";
  
  const jsonString = JSON.stringify(data);

  const options = {
    method: "POST",
    auth: "usr:7fd6b43a93cb84446e1ffd5efd432ffd-us17",
  };


  const request = https.request(url, options, (response) =>{
        
        response.statusCode === 200
          ? res.sendFile(__dirname + "/success.html")
          : res.sendFile(__dirname + "/failure.html");

        
        response.on('data', (data) =>{
            console.log(JSON.parse(data));
        })
  })

  request.write(jsonString);
  request.end();
});

app.get('/failure', (req,res) => {
  res.redirect('/');
})

app.listen(process.env.PORT || 4800, () => console.log('server @4800'))