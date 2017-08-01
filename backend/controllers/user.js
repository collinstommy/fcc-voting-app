
let mongoose = require('mongoose');
const Poll = require('../models/user');

function getProfile(req, res){
    res.send(req.user);
}

function logout(req, res){
  req.logout();
  res.redirect('/');
}

function getUserPolls(req, res) {
	let query = Poll.find({userName : req.params.userName});
	query.exec((err, polls) => {
		if(err) res.send(err);
		//If no errors, send them back to the client
		res.json(polls);
	});
}


module.exports = {getProfile, logout};