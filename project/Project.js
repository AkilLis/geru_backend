var mongoose = require('mongoose')
var Schema = mongoose.Schema

var ProjectSchema = new Schema({  
  title: String,
  description: String,
  deadline_date: Date,
  selection_date: Date,
  cover: {
  	url: String,
  	ratio: Number
  },
  user: {
    _id: String,
    first_name: String,
    last_name: String,
    avatar_url: String
  },
  status: String,
  tags: [{
    _id: String,
    name: String
  }],
  projectBids: [{type: String, ref: 'ProjectBid'}],
  comments: [{
  	user: {
  		first_name: String,
  		last_name: String,
  		avatar_url: String
  	},
  	comment: String,
  	comment_date: {type:Date, default: Date.now }
  }]
})

mongoose.model('Project', ProjectSchema)

module.exports = mongoose.model('Project')