var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserArray = new Schema({
	placeId: String,
    placeArray: []
});

module.exports = mongoose.model('UserArray', UserArray);