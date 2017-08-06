var express = require('express')
var router = express.Router()
var bodyParser = require('body-parser')
var w2v = require( 'word2vec') 

var Category = require('../category/Category')
var Tag = require('./Tag')

var _ = require('lodash');

router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ 
	extended: true 
}))

//get tags
router.get('/', function (req, res) {
    Tag.find({ name: new RegExp('^'+req.query.name, "i") }, function (err, tags) {
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


//suggested tag
router.get('/suggested', function(req,res){
	w2v.loadModel( 'simplood.txt', function( error, model ) {
        var mostSimilar = model.mostSimilar(req.query.tag,20)
        var tagNames = [];
        _.forEach(mostSimilar, function(value, key) {
            tagNames.push(value.word)
        })

        Tag.find({name: {$in: tagNames}}, function(err,tags){
            if(err) return res.status(500).send({
                code: 1,
                message: err
            })
            return res.status(200).send({
                code: 0,
                tags
            })
        })
	});
})


//create tag
router.post('/', function(req,res){
    Tag.create(req.body, function (err, tag) {
        if (err) return res.status(500).send({
            code: 1,
            message: err
        })

        Category.findOne({_id: req.body.category._id}, function(err,category){
            if(err) return res.status(500).send({
                code: 1,
                message: err
            })

            if(!category) return res.status(500).send({
                code:1,
                message: "There is no category exists.",
            })

            category.tags.push(tag._id)
            
            category.save(function(err) {
                if(err) return  {
                    code: 1,
                    message: err
                }
            })

            return res.status(200).send({
                code: 0,
                message: "Successfully created tag: " + tag.name
            })

        })

    })
    
})

//update tag
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