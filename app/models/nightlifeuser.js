var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = new Schema({
	gitId: String,
	displayName: String,
	userName: String,
    whereSheIs: {
        type: String,
        default: 'unknown'
    }
});

module.exports = mongoose.model('Nightlifeuser', User);