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
	handleQueries(req.body, res);	
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
	            // let team = JSON.parse(body).team.domain;
	            // res.redirect('http://' +team+ '.slack.com');
	             res.redirect('http://slack.com');
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

function isInteger(x) {
    return x % 1 === 0;
}

function handleQueries(q, res) {
	if (q.text) {
    	let planparam = q.text; 
    	if(planparam == 'free'){
    		res.send('FREE? Well we got our Basic plan: Monthly Visits: Limited, Sites Included:1, A/B Testing, All Templates');
    	} 
    	if(planparam == 'all'){
    		res.send('Ready? ***SUMO plan***: Live Optimizations, Discount Codes, Enterprise Integ., Integrations, VIP Support, Pro Display Rules, Pro Insights, Remove Branding, All Templates, A/B Testing, Sites Included:Unlimited, Monthly Visits:Unlimited, as for the pice - go to http://page.sumo.com/sumo-size-me');
    	}
    	if(planparam == '$29'){
    		firstchar = planparam.charAt(0);
    		if(firstchar == '$'){
    			let price = planparam.split('$');
    			let amount = price[1];
    			if(isIntiger(amount)){
    				if(amount >= 29){
    					res.send('Small plan for $29/mo: Integrations, VIP Support, Pro Display Rules, Pro Insights, Remove Branding, All Templates, A/B Testing, Sites Included:1, Monthly Visits:Up to 5k');
    				}
    				if(amount>=59){
						res.send('Medium plan for $59/mo: Integrations, VIP Support, Pro Display Rules, Pro Insights, Remove Branding, All Templates, A/B Testing, Sites Included:3, Monthly Visits:Up to 50k');
    				}
    				if(amount>=119 && amount<200){
						res.send('Big plan for $119/mo: Discount Codes, Enterprise Integ., Integrations, VIP Support, Pro Display Rules, Pro Insights, Remove Branding, All Templates, A/B Testing, Sites Included:9, Monthly Visits:Up to 500k');
    				}
    				if(amount>=200 && amount<1000000){
    					res.send('Check out our ***SUMO plan***: Live Optimizations, Discount Codes, Enterprise Integ., Integrations, VIP Support, Pro Display Rules, Pro Insights, Remove Branding, All Templates, A/B Testing, Sites Included:Unlimited, Monthly Visits:Unlimited, as for the pice - go to http://page.sumo.com/sumo-size-me');
    				}
    				if(amount>1000000){
    					res.send('are you married?');
    				}
    			}
    			else{
    				res.send('try the example: /pickplan $123');
    			}

    		}
    		res.send('You gonna like our Basic plan: Monthly Visits: Limited, Sites Included:1, A/B Testing, All Templates');
    	} 
    	else{
    		res.send('try like this /pickplan free, or /pickplan $120mo, or /pickplan 50k users')
    	}  
    		
	}
	else{
		res.send('try like this /pickplan free, or /pickplan $120m, or pickplan/ 50k users')
	}

}