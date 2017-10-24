var getIP = require('ipware')().get_ip;
var yelp = require('../config/yelp');
var google = require('../config/google');
var data = require('../router/data');

exports.route = function (app, passport){

    app.route('/')
        .get(function (req, res) {
        	if(req.isAuthenticated()){
		    	res.redirect("/" + req.user.userName);
        	} else {
        		res.render('index');
        	}
	    });

	app.route('/logout')
		.get(function (req, res) {
			req.logout();
			res.redirect('/');
		});
	
	app.route('/auth/github')
		.get(passport.authenticate('github'));
	
	app.route('/auth/github/callback')
		.get(passport.authenticate('github', {
			successRedirect: '/',
			failureRedirect: '/'
		}));
		
	app.route('/:username')
        .get(function (req, res) {
    	    if(req.isAuthenticated()){
	    		res.render('index', {
	        		username : req.user.userName,
	        		id : req.user.gitId,
	        		where : req.user.whereSheIs
	        	});
			} else {
    			res.render("errorpage", {
					error : 'not found'
				});
    	    }
	    });
	    
	app.route('/search/get-results')
        .get(function (req, res) {
    		yelp(req, function(err, results){
    			if(err) {
    				console.log(err);
    			} else {
    				res.send(results);	
    			}
    		});
	    });
	
	app.route('/addyourself/:id')
		.get(function (req, res) {
			if(req.isAuthenticated()){
				data.saveIt(req, function(err, what){
					if(err) {
						res.send(err);
					} else {
						res.send(what);
					}
				});
			} else {
				res.send('not auth');	
			}
		});
		
	app.route('/getpeople/:id')
		.get(function (req, res) {
			data.findIt(req, function(err, what){
				if(err){
					res.send(err);
				} else {
					if(what){
						res.send(what);
					} else {
						res.send(null);
					}
				}
			});
		});
	
	app.route('/removeperson/:id')
		.get(function (req, res) {
			if(req.isAuthenticated()){
				data.removeIt(req, function(err, what){
					if(what) {
						res.redirect("/");
					} else {
						res.render("errorpage", {
							error : 'not found'
						});
					}
				});
			}
		});
	
	app.route('/api/location-name')
        .post(function (req, res) {
        	google.locationName(req, function (err, result) {
        		if(err) {
        			console.log(err);
        		} else {
        			res.send(result);
        		}
        	});	
	    });
	    
	app.route('/api/location-coords')
        .post(function (req, res) {
        	google.locationCoords(req, function (err, result) {
        		if(err) {
        			console.log(err);
        		} else {
        			res.send(result);
        		}
        	});
	    });	    
	   
};

exports.error = function(req, res, next){
	res.render("errorpage", {
		error : 'no way out dude'
	});
};

exports.logger = function(req, res, next){
	console.log('Requester:', getIP(req).clientIp, 'Time:', new Date(Date.now()), 'Where:', req.url, 'Data:', req.body);
	next();
};
