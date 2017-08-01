process.env.NODE_ENV = 'test';

const mongoose = require("mongoose");

const Poll = require('../models/poll');
const User = require('../models/user');
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

describe('User', () => {
    beforeEach((done) => { //Before each test empty the database
        User.remove({}, (err) => {
            done();
        });
    });
    describe('/signup', () => {
        it('it should ADD a new user', (done) => {
            chai.request(server)
                .post('/signup')
                .field('email', 'test@gmail.com')
                .field('password', 'test')
              /*  .set('content-type', 'application/x-www-form-urlencoded')
                .send({ email: "tomascollins@gmail.com" })
                .send({ password: "test" }) */
                .end((err, res) => {
                    done();
                });
        });
    });

   /* describe('/GET/ polls/user/:userName polls', () => {
        it('it should GET all polls for a given user', (done) => {
            const testUserName = "testUser";
            const testUser = {
                email: "tomascollins@gmail.com",
                password: "test"
            };
            chai.request(server)
                .post('/login')
                .set('content-type', 'application/x-www-form-urlencoded')
                .send({ email: "tomascollins@gmail.com" })
                .send({ password: "test" })
                .end((err, loginRes) => {
                    //console.log(loginRes);
                    console.log(err);
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
    }); */
});