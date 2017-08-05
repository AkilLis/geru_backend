var express = require('express')
var router = express.Router()
var bodyParser = require('body-parser')

var Showcase = require('./Showcase')
var User = require('../user/User')

router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ 
	extended: true 
}))

// router.get('/my-rides', function (req, res) {
//     User.findOne({ _id: req.query._id }, function (err, user) {
//         if(err) return res.status(500).send({
//             code: 1,
//             message: 'User not found'
//         })

//         if(!user) return res.status(200).send({
//             code: 1,
//             message: 'User not found'
//         })

//         Ride.find({
//             '_id': {
//                 $in: user.active_rides
//             }
//         }, function (err, rides) {
//             return res.status(200).send({
//                 code: 0,
//                 rides
//             })    
//         })
//     })
// })
//get showcases
router.get('/', function (req, res) {
    Showcase.find({}, function (err, showcases) {
        if(err) return res.status(500).send({
            code: 1,
            message: 'Showcase not found'
        })

        return res.status(200).send({
            code: 0,
            showcases
        })
    })
})


//create showcase
router.post('/', function(req,res){
    Showcase.create(req.body, function (err, showcase) {
        if (err) return res.status(500).send({
            code: 1,
            message: "There was a problem adding the information to the database.",
        })

        User.findOne({ _id: req.body.user._id }, function(err, user) {
            if(err) return res.status(500).send({
                code: 1,
                message: "There is no user exists.",
            })

            user.showcases.push(showcase._id)
            
            user.save(function(err) {
                if(err) return  {
                    code: 1,
                    message: err
                }
            }) 
        })
        return res.status(200).send({
            code: 0,
            message: "Successfully created showcase: " + req.body.title + " for user: " + req.body.user.first_name
        })
    })
})

//update showcase
router.put('/:showcase_id', function(req,res){
    Showcase.findOneAndUpdate({_id: req.params.showcase_id}, req.body, {new: true}, function(err, showcase) {
        if (err) return res.status(500).send({
            code: 1,
            message: err
        })
        return res.status(200).send({
            code: 0,
            message: "Successfully updated showcase: " + showcase.title
        })
    });
})

//delete showcase
router.put('/:showcase_id', function(req,res){

    Showcase.remove({_id: req.params.showcase_id}, function(err, showcase) {
        if (err) return res.status(500).send({
            code: 1,
            message: err
        })
        return res.status(200).send({
            code: 0,
            message: "Successfully deleted showcase: " + showcase.title
        })
      });

})

module.exports = router