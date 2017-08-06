var mongoose = require('mongoose')
var Schema = mongoose.Schema

var ProjectBidSchema = new Schema({
  bid_price: Number,
  bid_comment: String,
  user: {
    _id: String,
    first_name: String,
    last_name: String,
    avatar_url: String
  },
  project: {
    _id: String,
    title: String,
    description: String,
  }
})

mongoose.model('ProjectBid', ProjectBidSchema)

module.exports = mongoose.model('ProjectBid')