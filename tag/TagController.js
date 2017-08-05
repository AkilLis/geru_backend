var express = require('express')
var router = express.Router()
var bodyParser = require('body-parser')

var Category = require('../category/Category')
var Tag = require('./Tag')

router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ 
	extended: true 
}))

router.get('/', function (req, res) {
    Tag.find({ }, function (err, tags) {
        if(err) return res.status(500).send({
            code: 1,
            message: 'Something went wrong when fetching from database.'
        })

        return res.status(200).send({
            code: 0,
            tags
        })
    })
})

//create category
router.post('/', function(req,res){
    Tag.create(req.body, function (err, tag) {
        if (err) return res.status(500).send({
            code: 1,
            message: "There was a problem adding the information to the database.",
        })

        Category.findOne({_id: req.body.category._id}, function(err,category){
            if(err) return res.status(500).send({
                code: 1,
                message: "There is no category exists.",
            })

            category.tags.push(tag._id)
            
            category.save(function(err) {
                if(err) return  {
                    code: 1,
                    message: err
                }
            }) 

        })

        return res.status(200).send({
        code: 0,
        message: "Successfully created tag: " + tag.name
        })
    })
    
})

//update category
router.put('/:tag_id', function(req,res){
    Tag.findOneAndUpdate({_id: req.params.tag_id}, req.body, {new: true}, function(err, tag) {
        if (err) return res.status(500).send({
            code: 1,
            message: err
        })
        return res.status(200).send({
            code: 0,
            message: "Successfully updated category: " + tag.name
        })
    });
})

module.exports = router