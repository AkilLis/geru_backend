var mongoose = require('mongoose')
var Schema = mongoose.Schema

var CategorySchema = new Schema({  
  name: String,
  image_url: String,
  tags: [{ type: String, ref: 'Tag' }]
})

mongoose.model('Category', CategorySchema)

module.exports = mongoose.model('Category')