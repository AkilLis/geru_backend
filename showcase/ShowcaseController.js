var express = require('express')
var router = express.Router()
var bodyParser = require('body-parser')

var Showcase = require('./Showcase')
var User = require('../user/User')

router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ 
	extended: true 
}))



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

//get showcases by tag id
router.get('/tag', function (req, res) {
    console.log(JSON.stringify(req.query));
    if(req.query.tags){
    	Showcase.find({ 'tags._id': {$in: req.query.tags} }).limit(8).skip((req.query.page - 1) * 8)
        .sort('heart.length')
        .exec(function (err, showcases) {

            if(err) return res.status(500).send({
                code: 1,
                message: err
            })

            Showcase.count({ 'tags._id': {$in: req.query.tags}}, function(err, count){
                if(err) return res.status(500).send({
                    code: 1,
                    message: err
                })

                return res.status(200).send({
                    code: 0,
                    page_last: count,
                    showcases
                })
            });            
        })
    } else {
        Showcase.find({ }).limit(8).skip((req.query.page - 1) * 8)
        .sort('-heartCount')
        .exec(function (err, showcases) {

            if(err) return res.status(500).send({
                code: 1,
                message: err
            })

            Showcase.count({ }, function(err, count){
                if(err) return res.status(500).send({
                    code: 1,
                    message: err
                })

                return res.status(200).send({
                    code: 0,
                    page_last: count,
                    showcases
                })
            });            
        })
    }
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

//register heart click
router.post('/:showcase_id/heart',function(req,res){
    Showcase.findOne({_id: req.params.showcase_id}, function(err,showcase){
        if(err) return res.status(500).send({
            code: 1,
            message: err
        })

        showcase.hearts.push(req.body)
        showcase.heartCount++
        showcase.save(function(err){
            if(err) return res.status(500).send({
                code: 1,
                message: err
            })

            return res.status(200).send({
                code: 0,
                message: 'Successfully registered heart click.',
            })
        })
    })
})


//delete showcase
router.delete('/:showcase_id', function(req,res){

    Showcase.remove({_id: req.params.showcase_id}, function(err, showcase) {
        if (err) return res.status(500).send({
            code: 1,
            message: err
        })

        User.findOne({_id: showcase.user._id}, function(err,user){
            if(err) return res.status(500).send({
                code: 1,
                message: err
            })
            if(!user) return res.status(500).send({
                code: 1,
                message: "User not found"
            })
            var i = -1;
            i = user.showcases.indexOf(showcase._id)
            if(i != -1 ){
                user.showcases.splice(i,1)
                user.save(function(err){
                    if(err) return {
                        code: 1,
                        message: err
                    }
                })
            }
        })

        return res.status(200).send({
            code: 0,
            message: "Successfully deleted showcase: " + showcase.title
        })
      });

})

module.exports = router