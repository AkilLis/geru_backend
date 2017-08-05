var express = require('express')
var router = express.Router()
var bodyParser = require('body-parser')

var Category = require('./Category')
var Tag = require('../tag/Tag')

router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ 
	extended: true 
}))

router.get('/', function (req, res) {
    Category.find({ }, function (err, categories) {
        if(err) return res.status(500).send({
            code: 1,
            message: 'Something went wrong when fetching from database.'
        })

        return res.status(200).send({
            code: 0,
            categories
        })
    })
})

//create category
router.post('/', function(req,res){
    Category.create(req.body, function (err, category) {
        if (err) return res.status(500).send({
            code: 1,
            message: "There was a problem adding the information to the database.",
        })
        return res.status(200).send({
        code: 0,
        message: "Successfully created category: " + req.body.name
        })
    })
    
})

//update category
router.put('/:category_id', function(req,res){
    Category.findOneAndUpdate({_id: req.params.category_id}, req.body, {new: true}, function(err, category) {
        if (err) return res.status(500).send({
            code: 1,
            message: err
        })
        return res.status(200).send({
            code: 0,
            message: "Successfully updated category: " + category.name
        })
    });
})

module.exports = router