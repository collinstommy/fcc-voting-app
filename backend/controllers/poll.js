
let mongoose = require('mongoose');
const Poll = require('../models/poll');

/*
 * GET /poll route to retrieve all the polls.
 */
function getPolls(req, res) {
	let query = Poll.find({});
	query.exec((err, polls) => {
		if(err) {
			res.send(err)
		}
		//If no errors, send them back to the client
		else{
			res.status(200).json(polls);
		}
	});
}

function getUserPolls(req, res) {
	let query = Poll.find({userName : req.params.userName});
	query.exec((err, polls) => {
		if(err) res.send(err);
		//If no errors, send them back to the client
		res.json(polls);
	});
}

/*
 * GET /poll/:id route to retrieve a poll given its id.
 */
function getPoll(req, res) {
	Poll.findById(req.params.id, (err, poll) => {
		if(err) res.send(err);
		//If no errors, send it back to the client
		res.json(poll);
	});		
}

function postPoll(req, res) {
  const newPoll = new Poll(req.body);
	newPoll.userEmail = req.user.local.email;
	console.log(req.body);
	console.log(newPoll);
	newPoll.save((err, poll)=> {
    if(err) {
			res.send(err);
		}
		else{
			res.status(200).json({message:'Poll added successfully', poll});
		}
	});		
}

module.exports = {getPoll, getPolls, getUserPolls, postPoll};