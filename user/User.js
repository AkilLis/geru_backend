var mongoose = require('mongoose')
var Schema = mongoose.Schema

var UserSchema = new Schema({  
  first_name: String,
  last_name: String,
  avatar_url: String,
  description: String,
  dob: Date,
  phone: String,
  gender: String,
  active_rides: [{ type: String, ref: 'Ride' }]
})

mongoose.model('User', UserSchema)

module.exports = mongoose.model('User')