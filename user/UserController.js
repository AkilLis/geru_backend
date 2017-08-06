var express = require('express')
var router = express.Router()
var bodyParser = require('body-parser')

var User = require('./User')
var Showcase = require('../showcase/Showcase')
var Project = require('../project/Project')

router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ 
	extended: true 
}))

//get all users
router.get('/', function (req, res) {
    User.find({}, function (err, users) {
        if(err) return res.status(500).send({
            code: 1,
            message: 'User not found'
        })

        return res.status(200).send({
            code: 0,
            users
        })
    })
})

//get user by id
router.get('/:user_id', function (req, res) {
	User.findOne({ _id: req.params.user_id }, function (err, user) {
        if(err) return res.status(500).send({
            code: 1,
            message: 'User not found'
        })

        return res.status(200).send({
            code: 0,
            user
        })
    })
})

//get user showcases
router.get('/:user_id/showcase',function(req,res){
    User.findOne({ _id: req.params.user_id }, function (err, user) {
        if(err) return res.status(500).send({
            code: 1,
            message: 'User not found'
        })

        if(!user) return res.status(200).send({
            code: 1,
            message: 'User not found'
        })

        if(user.showcases.length == 0) return res.status(200).send({
            code: 0,
            showcases: []
        })
        Showcase.find({
            '_id': {
                $in: user.showcases
            }
        }, function (err, showcases) {
            return res.status(200).send({
                code: 0,
                showcases
            })    
        })
    })  
})

//create user
router.post('/', function(req,res){

    User.create(req.body, function (err, user) {
        if (err) return res.status(500).send({
            code: 1,
            message: "There was a problem adding the information to the database.",
        })
    })
    return res.status(200).send({
        code: 0,
        message: "Succsesfully created user: " + req.body.first_name
    })
})

//save user bookmark
router.post('/:user_id/bookmark', function(req,res){

    User.findOne({_id: req.params.user_id}, function(err, user) {
        if(err) return res.status(500).send({
            code: 1,
            message: error
        })
        if(!user) return res.status(500).send({
            code:1,
            message: "User not found."
        })

        var i = -1;
        if(user.bookmarks)
            i = user.bookmarks.indexOf(req.body.bookmark);

        if(i != -1){
            user.bookmarks.splice(i, 1);
        } else {
            user.bookmarks.push(req.body.bookmark);
        }

        user.save(function(err){
            if(err) return {
                code: 1,
                message: err
            }
        })
        return res.status(200).send({
            message: "Successfully saved bookmark."
        })
    })
})

//get user bookmark
router.get('/:user_id/bookmark', function(req,res){
    User.findOne({_id: req.params.user_id}, function(err, user){
        if(err) return res.status(500).send({
            code: 1,
            message: err
        })
        if(user.bookmarks.length == 0) return res.status(200).send({
            code: 0,
            bookmarks: []
        })

        Showcase.find({_id: {$in: user.bookmarks}}, function(err,showcases){
            if(err) return res.status(500).send({
                code:1,
                message: err
            })
            return res.status(200).send({
                code: 0,
                bookmarks: showcases
            })
        })
    })
})

//get user active projects
router.get('/:user_id/project', function(req,res){
    User.findOne({_id: req.params.user_id}, function(err,user){
        if(err) return res.status(500).send({
            code:1,
            message: err
        })
        if(user.projects.length == 0) return res.status(200).send({
            code: 0,
            projects: []
        })

        Project.find({_id: {$in: user.projects}},function(err,projects){
            if(err) return res.status(500).send({
                code:1,
                message: err
            })
            return res.status(200).send({
                code:0,
                projects
            })
        })
    })
})

module.exports = router