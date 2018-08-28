var express = require('express');
var session = require('express-session');
var passport = require('passport');
var mongoose = require('mongoose');
var bodyParser = require("body-parser");
var router = require('./app/router/router');
var app = express();
var port = process.env.PORT || 8080;

require('./app/config/passport')(passport);

mongoose.connect(process.env.MONGO_URI, {useMongoClient: true});
mongoose.Promise = global.Promise;

app.set('views', './public/views');
app.set('view engine', 'pug');

app.use(session({
	secret: 'nightlife',
	resave: false,
	saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use('/public', express.static(__dirname + '/public'));
app.use('/controllers', express.static(__dirname + '/app/controllers'));
app.use('/common', express.static(__dirname + '/app/common'));

app.use(router.logger);

router.route(app, passport);

app.use(router.error);

app.listen(port, function(){
	var date = new Date(Date.now());
	var time = date.toLocaleTimeString('en-US', { hour12: false });
	var day = date.toDateString();
  console.log('Server listening :\n', 'Port', port, 'Time :', day + ' ' + time);
});
