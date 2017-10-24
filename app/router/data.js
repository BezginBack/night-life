var UA = require('../models/userarray');
var NU = require('../models/nightlifeuser');

exports.saveIt = function (req, done){
	if (req.user.whereSheIs == 'unknown'){
		NU.findOneAndUpdate({ gitId : req.user.gitId}, { 
			whereSheIs : req.params.id 
		}, function(err, doc){
			if(err) return done(err, null);
			UA.findOne({ placeId : req.params.id }, function (err, place) {
				if (err) {
					return done(err, null);
				}
				if (place) {
					var arr = place.placeArray;
					arr.push(req.user.userName);
					UA.findOneAndUpdate({ placeId : req.params.id }, { 
				    	placeArray : arr 
				    }, function (err, doc){
						if(err) return done(err);
						return done(null, true);
				    });
				} else {
					var newUA = new UA();
					var arrr = [req.user.userName]; 
			
					newUA.placeId = req.params.id;
					newUA.placeArray = arrr;
			
					newUA.save(function (err) {
						if (err) return done(err, null);
						return done(null, true);
					});
				}
			});
		});
	} else {
		return done(null, false);
	}
};

exports.findIt = function (req, done){
    UA.findOne({ placeId : req.params.id }, function (err, place) {
    	if (err) {
    		return done(err, null);
    	} 
    	if (place) {
    	    return done(null, place.placeArray);    
    	} else {
    	    return done(null, null);
    	}
    });
};
    
exports.removeIt = function(req, done) {
	NU.findOneAndUpdate({ gitId : req.user.gitId }, { 
		whereSheIs : 'unknown' 
	}, function (err, doc){
		if(err){
			return done(err, null);	
		} else {
			UA.findOne({ placeId : req.params.id }, function (err, place) {
	    		if (err) {
	    			return done(err, null);
	    		} 
	    		if (place) {
	    	    	var arr = place.placeArray;
	    	    	for(var i = arr.length - 1; i >= 0; i--) {
    					if(arr[i] == req.user.userName) {
    						arr.splice(i, 1);
    					}
					}
					if(arr.length > 0) {
						UA.findOneAndUpdate({ placeId : req.params.id }, { 
							placeArray : arr 
						}, function (err, doc){
							if (err) {
		    					return done(err, null);
		    				} else {
		    					return done(null, true);	
		    				}	
						});
					} else {
						UA.findOneAndRemove({ placeId : req.params.id }, function(err){
		        			if(err) return done(err, null);
		        			return done(null, true);
		        		});
					}
	    		} else {
	    	    	return done(null, false);
	    		}
    		});	
		} 
	});
};