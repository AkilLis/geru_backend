var mongoose = require('mongoose')
var Schema = mongoose.Schema

var UserSchema = new Schema({
  display_name: String,
  first_name: String,
  last_name: String,
  avatar_url: String,
  date_of_birth: Date,
  email_address: { type: String, index: { unique: true }},
  is_facebook_auth: Boolean,
  is_twitter_auth: Boolean,
  type: String,
  gender: String,
  password: String,
  is_freelancer: Boolean,
  showcases: [{ type: String, ref: 'Showcase' }],
  bookmarks: [{ type: String, ref: 'Showcase'}],
  projects: [{type: String, ref: 'Project'}]
})

mongoose.model('User', UserSchema)

module.exports = mongoose.model('User')