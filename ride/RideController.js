var express = require('express')
var router = express.Router()
var bodyParser = require('body-parser')

var Ride = require('./Ride')
var User = require('../user/User')

router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ 
	extended: true 
}))

router.post('/', function (req, res) {
    let newRide = {}

	Ride.create(req.body, function (err, ride) {
        if (err) return res.status(500).send({
            code: 1,
            message: "There was a problem adding the information to the database.",
        })
		
        User.findOne({ _id: req.body.driver._id }, function(err, user) {
            if(err) return res.status(500).send({
                code: 500,
                message: "There is no user exists.",
            })

            user.active_rides.push(ride._id)
            
            user.save(function(err) {
                if(err) return  {
                    code: 500,
                    message: err,
                }
                res.status(200).send({
                    code: 0,
                    newRide
                })
            }) 
        })
    })
})

router.get('/', function (req, res) {
	Ride.find({}, function (err, users) {
        if (err) return res.status(500).send("There was a problem finding the users.");
        res.status(200).send(users);
    });
})

module.exports = router
