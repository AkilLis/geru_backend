var mongoose = require('mongoose')
var Schema = mongoose.Schema

var MessageSchema = new Schema({
  sender: {
    _id: {type: String, index: true},
    first_name: String,
    last_name: String,
    avatar_url: String
  },
  receiver: {
    _id: {type: String, index: true},
    first_name: String,
    last_name: String,
    avatar_url: String
  },
  send_date: {type:Date, default: Date.now },
  received_date: Date,
  message: String
})

mongoose.model('Message', MessageSchema)

module.exports = mongoose.model('Message')