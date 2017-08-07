var express = require('express')
var router = express.Router()
var bodyParser = require('body-parser')

var ProjectHistory = require('./ProjectHistory')
var User = require('../user/User')

router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ 
	extended: true 
}))

//get project history by created user
router.get('/:user_id/user', function(req,res){
    ProjectHistory.find({'user._id': req.params.user_id}, function(err,projectHistories){
        if(err) return res.status(500).send({
            code: 1,
            message: err
        })

        return res.status(200).send({
            code: 0,
            projectHistories    
        })
    })
})

//get project history by worker
router.get('/:user_id/worker', function(req,res){
    ProjectHistory.find({'selectedBid.user_id': req.params.user_id}, function(err,projectHistories){
        if(err) return res.status(500).send({
            code: 1,
            message: err
        })

        return res.status(200).send({
            code: 0,
            projectHistories
        })
    })
})

//project to project history
router.post('/', function(req,res){
    ProjectHistory.create(req.body, function (err, projectHistory) {
        if (err) return res.status(500).send({
            code: 1,
            message: err
        })
        return res.status(200).send({
            code: 1,
            message: 'Successfully saved project history.'
        })
    })
})

module.exports = router