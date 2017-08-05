var express = require('express')
var router = express.Router()
var bodyParser = require('body-parser')

var User = require('./User')
var Ride = require('../ride/Ride')

router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ 
	extended: true 
}))

router.get('/my-rides', function (req, res) {
    User.findOne({ _id: req.query._id }, function (err, user) {
        if(err) return res.status(500).send({
            code: 1,
            message: 'User not found'
        })

        if(!user) return res.status(200).send({
            code: 1,
            message: 'User not found'
        })

        Ride.find({
            '_id': {
                $in: user.active_rides
            }
        }, function (err, rides) {
            return res.status(200).send({
                code: 0,
                rides
            })    
        })
    })
})

router.get('/', function (req, res) {
	User.findOne({ _id: "598026b0413db36e5edb1594" }, function (err, user) {
        if(err) return res.status(500).send({
            code: 1,
            message: 'User not found'
        })

        return res.status(200).send({
            code: 0,
            user
        })
    })
    /*User.create({
        first_name: "Tuvshinbat",
        last_name: "Gansukh",
        avatar_url: "https://scontent.fuln2-1.fna.fbcdn.net/v/t1.0-1/p160x160/12733965_1022408714486124_4791379202953934223_n.jpg?oh=c5dee8ac5caada420d79f7413ed33701&oe=5A341C7F",
        description: "Who interested in always looking for new knowledge, working to make the world a better place",
        dob: "1993/06/24",
        phone: "99222503",
        gender: "M",
    }, function (err, user) {
        if (err) return res.status(500).send({
                code: 1,
                message: "There was a problem adding the information to the database.",
        })
        res.status(200).send({
            code: 0,
            user
        })
    })*/
})

module.exports = router
