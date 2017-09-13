// BASE SETUP
// =============================================================================

const request = require('request'); 

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var Bear       = require('./app/models/bear');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    // res.json({ message: 'hooray! welcome to our api!' });   
    res.send("it works!")
});

router.post('/pickplan', function(req, res) {
	console.log("Command received")
	console.log(req);
	res.send("Hi sumo")
});


router.get('/slack', function(req, res){ 
	let data = {form: { 
	client_id: process.env.SLACK_CLIENT_ID, 
	client_secret: process.env.SLACK_CLIENT_SECRET, 
	code: req.query.code 
	}}; 

	request.post('https://slack.com/api/oauth.access', data, function (error, response, body) { 
		if (!error && response.statusCode == 200) { 
		  // Get an auth token
	      let token = JSON.parse(body).access_token;

	      // Get the team domain name to redirect to the team URL after auth
	      request.post('https://slack.com/api/team.info', {form: {token: token}}, function (error, response, body) {
	        if (!error && response.statusCode == 200) {
	          if(JSON.parse(body).error == 'missing_scope') {
	            res.send('missing_scope');
	          } else {
	            let team = JSON.parse(body).team.domain;
	            res.redirect('http://' +team+ '.slack.com');
	             // res.redirect('http://farrukhworkspace.slack.com');
	          }
	        }
	      });
		}	
	});
});


// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);

// server.js

// BASE SETUP
// =============================================================================

var mongoose   = require('mongoose');
mongoose.connect('mongodb://farruh:123@ds025583.mlab.com:25583/sumoslack'); // connect to our database