var request = require('request');

module.exports = function (req, done){
    var clientId = process.env.YELP_KEY;
    var clientSecret = process.env.YELP_SECRET;
    
    if(req.query.lat && req.query.lon) {
        var searchRequest = {
            latitude: req.query.lat, 
            longitude: req.query.lon,
            radius: 10000,
            categories: "bars, pubs, gastropubs",
            limit: 50,
            sort_by: 'distance'
        };
    }
    
    request.post('https://api.yelp.com/oauth2/token', {
	    form: {
		    grant_type: 'client_credentials',
		    client_id: clientId,
		    client_secret: clientSecret
	    },
	    json: true
    }, function (err1, res1, body1) {
	    if(err1) {
		    done(err1, null);
	    } else 
	        request({
		        url: 'https://api.yelp.com/v3/businesses/search?',
		        headers: {
			        'User-Agent': 'night-inn',
			        'Authorization': 'Bearer ' + body1.access_token
		        },
		        qs: searchRequest,
	        }, function(err2, res2, body2) {
	            if(err2) {
	                done(err2, null);
	            } else {
	                done(null, JSON.parse(body2));
	            }
	    });
    });
};