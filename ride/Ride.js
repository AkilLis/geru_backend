var mongoose = require('mongoose')
var Schema = mongoose.Schema

var RideSchema = new Schema({  
  start_location: {
  	place_name: String,
  	coordinate: {
        type: [Number],
        required: true,
        index: "2dsphere"
    }
  },
  end_location: {
  	place_name: String,
  	coordinate: {
        type: [Number],
        required: true,
        index: "2dsphere"
    }
  },
  driver: {
    _id: { type: String },
    avatar_url: String,
    first_name: String,
    last_name: String,
    rating: {},
    car: {
      make: String,
      model: String,
      number: String,
      color: String,
    }
  },
  start_time: Date,
  total_distance: Number,
  available_seat: Number,
})

mongoose.model('Ride', RideSchema)

module.exports = mongoose.model('Ride')