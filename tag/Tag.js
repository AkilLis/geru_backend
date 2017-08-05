var mongoose = require('mongoose')
var Schema = mongoose.Schema

var TagSchema = new Schema({  
  name: {type: String, index: true},
  category: { 
  	_id: String, 
  	name: String 
  }
})

mongoose.model('Tag', TagSchema)

module.exports = mongoose.model('Tag')