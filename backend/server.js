const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

//for auth
const passport = require('passport');
const flash = require('connect-flash');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const env = process.env.NODE_ENV || 'development';
const config = require('./config')[env];
const poll = require('./controllers/poll');
const user = require('./controllers/user');

//db connection      
mongoose.connect(config.mongo_uri);
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

require('./config_passport')(passport);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: 'application/json' }));

app.use(cookieParser()); //needed for auth
//needed for passport
app.use(session({ secret: config.secret })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

app.get("/", (req, res) => res.json({ message: "Welcome to our Voting app!" }));

app.route("/polls")
	.get(poll.getPolls)
	.post(isLoggedIn, poll.postPoll)

app.route("/polls/user/:userName")
	.get(isLoggedIn, poll.getUserPolls)

app.route("/poll/:id")
	.get(poll.getPoll)

app.route('/profile')
	.get(isLoggedIn, user.getProfile)

app.route('/logout')
	.get(user.logout)

app.route('/login')
	.post(passport.authenticate('local-login', {
		successRedirect: '/profile', // redirect to the secure profile section
		failureRedirect: '/login', // redirect back to the login page if there is an error
		failureFlash: true // allow flash messages
	}));

app.route('/signup')
	.post(passport.authenticate('local-signup', {
		successRedirect: '/profile', // redirect to the secure profile section
		failureRedirect: '/signup', // redirect back to the signup page if there is an error
		failureFlash: true // allow flash messages
	}));

function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on 
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.redirect(403, '/');
}

app.listen(config.server.port);
console.log("Listening on port " + config.server.port);

module.exports = app; // for testing