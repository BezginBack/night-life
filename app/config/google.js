var request = require('request');

exports.locationName = function (req, done){
    var url = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=';
	url += req.body.latitude + "," + req.body.longitude;
	url += '&key=' + process.env.GEOCODE_KEY;
    request(url, function (error, response, body) {
    	if(error) {
    		done(error, null);
    	} else {
    		done(null, body);
    	}
	});
};

exports.locationCoords = function (req, done){
    var url = 'https://maps.googleapis.com/maps/api/geocode/json?address=';
    url += req.body.address;
    url += '&key=' + process.env.GEOCODE_KEY;
    request(url, function (error, response, body) {
    	if(error) {
    		done(error, null);
    	} else {
    		done(null, body);
    	}
    });
};