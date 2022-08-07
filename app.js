
const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();


// Making a static folder for accessing local files on server
app.use(express.static("public"));

// Parsing the body of homepage for .js file
app.use(bodyParser.urlencoded({extended:true}));

// Simple get which redirects to signup.html
app.get("/", function(req, res){
    res.sendFile(__dirname + "/signup.html")
})

// This POST handles everything when the form is submitted
app.post("/", function(req, res){
    console.log(req.body.firstName);
    const fName = req.body.firstName;
    const lName = req.body.lastName;
    const email = req.body.email;

    // Making a JSON object to send the data onto Mailchimp
    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: fName,
                    LNAME: lName,
                }
            }
        ]
    };

    // Converting JSON data into string
    const jsonData = JSON.stringify(data);

    // API Endpoint with the List ID at the end
    const url = "https://us12.api.mailchimp.com/3.0/lists/46bff8f21a"

    // defining options for https.request()
    // Defining the method and adding the API key for authentication with username in the format "username:APIKey"
    const options = {
        method: "POST",
        auth: "usernameHere:MailchimpApiKeyHere"
    }

    // Using https.request in this way by making a const so we can send our data "jsonData" over to Mailchimp
    const request = https.request(url, options, function(response){
        
        // Rerouting depending on the statusCode
        if(response.statusCode === 200){
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html");
        }
        
        // Logging the data to console
        response.on("data", function(data){
            console.log(JSON.parse(data));
        })
    })

    // Sending our data to the server and ending the request
    request.write(jsonData);
    request.end();

})

// POST to handle the try again button on the failure page
app.post("/failure", function(req, res){
    res.redirect("/");
})

// process.env.PORT is a dynamic port for Heroku CLI
app.listen(process.env.PORT || 3000, function(){
    console.log("Server started on port 3000");
})



