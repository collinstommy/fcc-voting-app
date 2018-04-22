process.env.NODE_ENV = 'test';

const mongoose = require("mongoose");

const Poll = require('../models/poll');

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const should = chai.should();
const expect = chai.expect;

const testPoll = new Poll({
                title: "The best fruit?", userName: 'testUser',
                pollOptions: [
                    { option: "Oranges", voteCount: 0 },
                    { option: "Apples", voteCount: 0 }
                ],
            });

chai.use(chaiHttp);

describe('Polls', () => {
    beforeEach((done) => { //Before each test empty the database
        Poll.remove({}, (err) => {
            done();
        });
    });
    /*
      * Test the /GET route
      */
    describe('/GET all polls', () => {
        it('it should GET all the polls', (done) => {
            chai.request(server)
                .get('/polls')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    done();
                });
        });
    });

    describe('/GET/ polls/user/:userName polls', () => {
        it('it should GET all polls for a given user', (done) => {
            const testUserName = "testUser";
            testPoll.save((err, testPoll) => {
                chai.request(server)
                    .get('/polls/user/' + testUserName)
                    .send(testPoll)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('array');
                        res.body.length.should.be.eql(1);
                        res.body[0].should.have.property('_id');
                        expect(res.body[0]._id.toString()).to.eql(testPoll._id.toString());
                        done();
                    });
            });

        });
    });

    describe('/GET/ poll/:id poll', () => {
        it('it should GET a poll by the given id', (done) => {
            const dummyPoll = new Poll({
                title: "The best color?", userName: 'testUser',
                pollOptions: [
                    { option: "Blue", voteCount: 0 },
                    { option: "Red", voteCount: 0 }
                ],
            });
            dummyPoll.save((err, poll) => {
                chai.request(server)
                    .get('/poll/' + dummyPoll.id)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('title');
                        res.body.should.have.property('pollOptions');
                        res.body.should.have.property('_id').eql(poll.id);
                        done();
                    });
            });

        });
    });

    describe('/POST poll', () => {
        it('it should  POST a poll', (done) => {
            let poll = {
                title: "What is your favourite pet?", userName: 'testUser',
                pollOptions: [
                    { option: "dogs", voteCount: 0 },
                    { option: "cats", voteCount: 0 }
                ],
            };
            chai.request(server)
                .post('/polls')
                .send(poll)
                .end((err, res) => {
                    res.body.poll.should.be.a('object');
                    res.body.poll.should.have.property('title');
                    res.body.poll.title.should.be.eql('What is your favourite pet?');
                    done();
                });
        });

    });
});