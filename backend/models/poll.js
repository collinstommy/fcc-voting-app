const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PollSchema = new Schema(
  {
    title: { type: String, required: true },
    userId: { type: String, required: false},
    pollOptions: [
    {
          option: { 
              type:String,
              required: true
          },
          voteCount: {
              type: Number,
              required: false
          },
    }]
  }
);

module.exports = mongoose.model('poll', PollSchema);