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

router.get('/test', function(req, res) {
	console.log("Command received")	
	handleQueries('all', res);	
});


// auth

router.get('/slack', function(req, res){ 
	let data = {form: { 
	// client_id: process.env.SLACK_CLIENT_ID, 
	// client_secret: process.env.SLACK_CLIENT_SECRET, 
	client_id: "238856116306.239797713254", 
	client_secret: "565dccd77e7350f52f2073ec1bb24973", 
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
	             // res.redirect('http://slack.com');
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

// var mongoose   = require('mongoose');
// mongoose.connect('mongodb://farruh:123@ds025583.mlab.com:25583/sumoslack'); // connect to our database

// function isInteger(x) {
//     return x % 1 === 0;
// }

function handleQueries(q, res) {
	if (q.text) {		
	
    	let planparam = q.text; 

    	if(planparam == 'free'){
    		
    		let data = {"attachments":[{"color":"#36a64f","pretext":"FREE? Well, catch it!","title":"BASIC","title_link":"https://sumo.com/pricing","fields":[{"title":":lock: Live Optimizations"},{"title":":lock: Discount Codes"},{"title":":lock: Enterprise Integ."},{"title":":lock: Integrations"},{"title":":lock: VIP Suppor"},{"title":":lock: Pro Display"},{"title":":lock: Pro Insights"},{"title":":lock: Remove Branding"},{"title":":white_check_mark: All Templates"},{"title":":white_check_mark: A/B Testing"},{"title":":white_check_mark: Sites Included: 1"},{"title":":white_check_mark: Monthly Visits: Limited"}]}]};
    		res.json(data);
    	} 
    	if(planparam == 'all'){    		
    		let data = {"attachments":[{"color":"#36a64f","pretext":"Oh, you are gonna love this plan:","title":"SUMO","title_link":"https://sumo.com/pricing","fields":[{"title":":white_check_mark: Live Optimizations"},{"title":":white_check_mark: Discount Codes"},{"title":":white_check_mark: Enterprise Integ."},{"title":":white_check_mark: Integrations"},{"title":":white_check_mark: VIP Suppor"},{"title":":white_check_mark: Pro Display"},{"title":":white_check_mark:  Pro Insights"},{"title":":white_check_mark: Remove Branding"},{"title":":white_check_mark: All Templates"},{"title":":white_check_mark: A/B Testing"},{"title":":white_check_mark: Sites Included: Unlimited"},{"title":":white_check_mark: Monthly Visits: Unlimited"}],"footer":"to get the information about the price details please visit http://page.sumo.com/sumo-size-me","footer_icon":"https://platform.slack-edge.com/img/default_application_icon.png"}]}
    		res.json(data);
    	}

		firstchar = planparam.charAt(0);
		if(firstchar == '$'){
			let price = planparam.split('$');
			let amount = price[1];
			if(amount % 1 === 0){
				if(amount <= 29){
					let data = {"attachments":[{"color":"#36a64f","pretext":"Try this one","title":"SMALL - $29/mo","title_link":"https://sumo.com/pricing","fields":[{"title":":lock: Live Optimizations"},{"title":":lock: Discount Codes"},{"title":":lock: Enterprise Integ."},{"title":":white_check_mark: Integrations"},{"title":":white_check_mark: VIP Suppor"},{"title":":white_check_mark: Pro Display"},{"title":":white_check_mark: Pro Insights"},{"title":":white_check_mark: Remove Branding"},{"title":":white_check_mark: All Templates"},{"title":":white_check_mark: A/B Testing"},{"title":":white_check_mark: Sites Included: 1"},{"title":":white_check_mark: Monthly Visits: up to 5k"}]}]};
					res.json(data);					
				}
				if(amount>29 && amount<=59){
					let data = {"attachments":[{"color":"#36a64f","pretext":"The best fit","title":"MEDIUM - $59/mo","title_link":"https://sumo.com/pricing","fields":[{"title":":lock: Live Optimizations"},{"title":":lock: Discount Codes"},{"title":":lock: Enterprise Integ."},{"title":":white_check_mark: Integrations"},{"title":":white_check_mark: VIP Suppor"},{"title":":white_check_mark: Pro Display"},{"title":":white_check_mark: Pro Insights"},{"title":":white_check_mark: Remove Branding"},{"title":":white_check_mark: All Templates"},{"title":":white_check_mark: A/B Testing"},{"title":":white_check_mark: Sites Included: 3"},{"title":":white_check_mark: Monthly Visits: up to 50k"}]}]};
					res.json(data);
				}
				if(amount>59 && amount<=119){
					let data = {"attachments":[{"color":"#36a64f","pretext":"BOOMM! this is yours:","title":"BIG - $119/mo","title_link":"https://sumo.com/pricing","fields":[{"title":":lock: Live Optimizations"},{"title":":white_check_mark: Discount Codes"},{"title":":white_check_mark: Enterprise Integ."},{"title":":white_check_mark: Integrations"},{"title":":white_check_mark: VIP Suppor"},{"title":":white_check_mark: Pro Display"},{"title":":white_check_mark: Pro Insights"},{"title":":white_check_mark: Remove Branding"},{"title":":white_check_mark: All Templates"},{"title":":white_check_mark: A/B Testing"},{"title":":white_check_mark: Sites Included: 9"},{"title":":white_check_mark: Monthly Visits: up to 500k"}]}]};
					res.json(data);
				}
				if(amount>119 && amount<1000000){
					let data = {"attachments":[{"color":"#36a64f","pretext":"The best fit:","title":"SUMO","title_link":"https://sumo.com/pricing","fields":[{"title":":white_check_mark: Live Optimizations"},{"title":":white_check_mark: Discount Codes"},{"title":":white_check_mark: Enterprise Integ."},{"title":":white_check_mark: Integrations"},{"title":":white_check_mark: VIP Suppor"},{"title":":white_check_mark: Pro Display"},{"title":":white_check_mark:  Pro Insights"},{"title":":white_check_mark: Remove Branding"},{"title":":white_check_mark: All Templates"},{"title":":white_check_mark: A/B Testing"},{"title":":white_check_mark: Sites Included: Unlimited"},{"title":":white_check_mark: Monthly Visits: Unlimited"}],"footer":"to get the information about the price details please visit http://page.sumo.com/sumo-size-me","footer_icon":"https://platform.slack-edge.com/img/default_application_icon.png"}]};
					res.json(data);
				}
				if(amount>=1000000){
					res.send('are you married?');
				}
			}
			else{
				res.send('try the example: /pickplan $123');
			}

		}   		    	 
    	else{
    		res.send('try like this /pickplan free, /pickplan $299 , /pickplan all, /pickplan $1000000')
    	}  
    		
	}
	else{
		res.send('try like this /pickplan free, /pickplan $299 , /pickplan all, /pickplan $1000000')
	}

}