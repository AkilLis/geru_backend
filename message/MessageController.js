var express = require('express')
var router = express.Router()
var bodyParser = require('body-parser')

var Message = require('./Message')
var User = require('../user/User')

router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ 
	extended: true 
}))

//create message
router.post('/',function(req,res){
    Message.create(req.body, function(err,message){
        if(err) res.status(500).send({
            code: 1,
            message: err
        })
        return res.status(200).send({
            code: 0,
            message: 'Successfully created message.'
        })
    })
})

//update message
router.put('/:message_id/update',function(req,res){
    Message.findOneAndUpdate({_id: req.params.message_id}, req.body, {new: true}, function(err, message){
        if(err) return res.status(500).send({
            code: 1,
            message: err
        })
        return res.status(200).send({
            code: 0,
            message: 'Successfully updated message: ' + message._id
        })
    })
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

// //get messaging list
router.get('/:user_id',function(req,res){
    Message.aggregate(
            {
                $match: {
                    'receiver._id': {$eq: req.params.user_id}
                }
            },
            {
                $group: {
                    _id: {sender_id: '$sender._id'},
                    message_id : { $last: '$_id' },
                    message : { $last: '$message' },
                    first_name: {$last: '$sender.first_name'},
                    last_name: {$last: '$sender.last_name'},
                    avatar_url: {$last: '$sender.avatar_url'},
                    last_date: {$max: '$send_date'}
                }
            })
        .exec(function(err,result){
            if(err) return res.status(500).send({
                code: 1,
                message: err,
            })
            return res.status(200).send({
                code: 0,
                result
            })
        })
})

//get conversation
router.get('/conversation',function(req,res){
    if( !req.query.sender_id || !req.query.receiver_id ){
        return res.status(400).send({
            code: 1,
            message: 'Parameter invalid'
        })
    }
    Message.find({'sender._id': {$in: [req.query.sender_id,req.query.receiver_id]}, 'receiver._id': {$in: [req.query.sender_id,req.query.receiver_id]}})
    .sort('send_date')
    .exec(function(err,messages){
        if(err) res.status(500).send({
            code: 1,
            message: err
        })
        return res.status(200).send({
            code: 0,
            messages
        })
    })
})


module.exports = router