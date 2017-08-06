var express = require('express')
var router = express.Router()
var bodyParser = require('body-parser')

var ProjectBid = require('./ProjectBid')
var Project = require('../project/Project')
var User = require('../user/User')

router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ 
	extended: true 
}))

// get bids
router.get('/',function(req,res){
    ProjectBid.find({},function(err,projectBids){
        if(err) return res.status(500).send({
            code: 1,
            message: err
        })
        return res.status(200).send({
            code: 0,
            projectBids
        })
    })
})

// create project bid
router.post('/', function(req,res){
    ProjectBid.create(req.body, function(err, projectBid){
        if(err) return res.status(500).send({
            code: 1,
            message: err
        })
        Project.findOne({_id: projectBid.project._id}, function(err, project){
            project.projectBids.push(projectBid._id)
            project.save(function(err){
                if(err) return res.status(500).send({
                    code: 1,
                    message: err
                })
                return res.status(200).send({
                    code:0,
                    message: "Successfully created bid"
                })
            })
        })
    })
})

// delete project bid
router.delete('/:projectBid_id', function(req,res){
    ProjectBid.findOne({_id: req.params.projectBid_id},function(err,projectBid){
        if(err) res.status(500).send({
            code: 1,
            message: err
        })

        projectBid.remove(function(err){
            if(err) return res.status(500).send({
                code:1,
                message: err
            })
        });
        Project.findOne({_id: projectBid.project._id}, function(err,project){
            if(err) return res.status(500).send({
                code: 1,
                message: err
            })
            if(!project) return res.status(500).send({
                code: 1,
                message: "Project not found"
            })
            var i = -1;
            i = project.projectBids.indexOf(projectBid._id)
            if(i != -1 ){
                project.projectBids.splice(i,1)
                project.save(function(err){
                    if(err) return {
                        code: 1,
                        message: err
                    }
                    return res.status(200).send({
                        code:0,
                        message: "Successfully deleted bid"
                    })
                })
            }
        })

    })
})

module.exports = router