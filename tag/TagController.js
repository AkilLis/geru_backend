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
    var query = {};
    if (req.query.tags && req.query.type) {
        query = { _id: { $nin: req.query.tags}, type: req.query.type }
    } else if(req.query.type){
        query = { type: req.query.type }
    } else if(req.query.name){
        query = { name: new RegExp('^'+req.query.name, "i") }
    } else {
      query = { }
    }
    Tag.find(query, function (err, tags) {
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

function matchComplete(mostSimilar, res, req, isName) {
   var tagNames = [];

   //console.log(mostSimilar)

   _.forEach(mostSimilar, function(value, key) {
       if(isName==1)
           tagNames.push(value.name);
       else
           tagNames.push(value.word);
   })

   console.log(tagNames);
      
   var matchNames = [];
   for( var i=0; i < tagNames.length; i++) {
       //console.log(tagNames[i]);
       if(tagNames[i].startsWith(req.query.freetext))
           matchNames.push(tagNames[i]);
   }
       //['123', '123412', '123']
      
       //console.log("------------");
       //console.log(matchNames);
   return res.status(200).send({
      code: 0,
      tags: matchNames.slice(0, 10) ,
   })
}

//auto_complete tag
router.get('/auto_complete', function(req,res){
   w2v.loadModel( 'simplood.txt', function( error, model ) {
      var mostSimilar = model.mostSimilar(req.query.tag,20)
      //console.log(mostSimilar);
      //var tagNames = [];
      var tagNames = []//["hat", "hackub2017", "hack", "hacker"];
      if( !(req.query.tag) || 0 === (req.query.tag).length){
           Tag.find({ name: new RegExp('^'+req.query.tag, "i") }, function (err, tags) {
               mostSimilar=tags;
               matchComplete(mostSimilar, res, req, 1)
           });
      } else {
           matchComplete(mostSimilar, res, req, 0)
      }
   });
})

//suggested tag
router.get('/suggested', function(req,res){
    w2v.loadModel( 'simplood.txt', function( error, model ) {
       console.log(req.query)
       var mostSimilar = model.mostSimilar(req.query.tag, 20)
       var tagNames = [];
       _.forEach(mostSimilar, function(value, key) {
           tagNames.push(value.word)
       })
       console.log(tagNames);
       Tag.find({name: {$in: tagNames}}, function(err,tags){
           console.log(tags);
           if(err) return res.status(500).send({
               code: 1,
               message: err
           })
           return res.status(200).send({
               code: 0,
               tags: tags.slice(0, 10) ,
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
        if(req.body.category && req.body.category._id){
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
        } else {
          return res.status(200).send({
              code: 0,
              message: "Successfully created tag: " + tag.name
          })          
        }

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

//delete tag
router.delete('/:tag_id', function(req,res){
  Tag.remove({_id: req.params.tag_id}, function(err, tag) {
    if (err) return res.status(500).send({
      code: 1,
      message: err
    })
    return res.status(200).send({
      code: 0,
      message: 'Successfully deleted tag.'
    })
  })

})

module.exports = router