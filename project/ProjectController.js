var express = require('express')
var router = express.Router()
var bodyParser = require('body-parser')

var Project = require('./Project')
var User = require('../user/User')

router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ 
	extended: true 
}))

//get showcases
router.get('/', function (req, res) {
    Project.find({}, function (err, projects) {
        if(err) return res.status(500).send({
            code: 1,
            message: err
        })

        return res.status(200).send({
            code: 0,
            projects
        })
    })
})

//get projects by tag
router.get('/get_projects_by_tag', function (req, res) {
	Project.find({ 'tags._id': {$in: req.query.tags} }).limit(8).skip((req.query.page - 1 ) * 8).exec(function (err, projects) {
        if(err) return res.status(500).send({
            code: 1,
            message: err
        })

        return res.status(200).send({
            code: 0,
            projects
        })
    })
})


//get suited
router.get('/get_suited', function (req, res) {
/*

	whois_range.aggregate([
		{
		  $match:
		   {
			 _id: "userid"
		   }
		},
		{"$group" : {_id:"$tag", count:{$sum:1}}}
	},
	{$sort:{"count":1}}
	],
    function(err,result){
		Project.find({ "_id": result.count },
        function (err, res) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            }
			res.forEach(function (r) {
				r.tags.forEach(function (r) {
					// show student with his time entries....
					console.log(r._id);
				});
			});	
            
            
        });
	})

	

	//var a={"5986c3a964912624b089f1db": 4, "5986c38e64912624b089f1d7": 9};
	
	//console.log(tt);
	
	//return tt;
	*/
 })

//create project
router.post('/', function(req,res){
    Project.create(req.body, function (err, project) {
        if (err) return res.status(500).send({
            code: 1,
            message: "There was a problem adding the information to the database.",
        })

        User.findOne({ _id: req.body.user._id }, function(err, user) {
            if(err) return res.status(500).send({
                code: 1,
                message: "There is no user exists.",
            })

            user.projects.push(project._id)
            
            user.save(function(err) {
                if(err) return  {
                    code: 1,
                    message: err
                }
            })

            return res.status(200).send({
                code: 0,
                message: "Successfully created project: " + req.body.title + " for user: " + req.body.user.first_name
            })
        })
    })
})

//update project
router.put('/:project_id', function(req,res){
    Project.findOneAndUpdate({_id: req.params.project_id}, req.body, {new: true}, function(err, project) {
        if (err) return res.status(500).send({
            code: 1,
            message: err
        })
        return res.status(200).send({
            code: 0,
            message: "Successfully updated project: " + project.title
        })
    });
})

//delete project
router.delete('/:project_id', function(req,res){

    Project.remove({_id: req.params.project_id}, function(err, project) {
        if (err) return res.status(500).send({
            code: 1,
            message: err
        })

        User.findOne({_id: project.user._id}, function(err,user){
            if(err) return res.status(500).send({
                code: 1,
                message: err
            })
            if(!user) return res.status(500).send({
                code: 1,
                message: "User not found"
            })
            var i = -1;
            i = user.projects.indexOf(showcase._id)
            if(i != -1 ){
                user.projects.splice(i,1)
                user.save(function(err){
                    if(err) return {
                        code: 1,
                        message: err
                    }
                    return res.status(200).send({
                        code: 0,
                        message: "Successfully deleted project: " + project.title
                    })
                })
            }
        })
      });

})

module.exports = router