var mongoose = require('mongoose')
var Schema = mongoose.Schema

var ShowcaseSchema = new Schema({  
  title: String,
  caption: String,
  cover: {
    url: String,
    ratio: Number,
  },
  created_date: {type:Date, default: Date.now },
  heart: [{
    user_id: String,
    created_date: {type:Date, default: Date.now }
  }],
  user: {
    _id: String,
    first_name: String,
    last_name: String,
    avatar_url: String
  },
  tags: [{
    _id: String,
    name: String
  }]
  // tags: [{ type: String, ref: 'Tag' }]
})

mongoose.model('Showcase', ShowcaseSchema)

module.exports = mongoose.model('Showcase')