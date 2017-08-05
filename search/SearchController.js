var express = require('express')
var router = express.Router()
var bodyParser = require('body-parser')

var Ride = require('../ride/Ride')

router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ 
	extended: true 
}))

router.get('/', function (req, res) {
		
	let params = req.query
	//let toDistCondition = {}
	//let fromDistCondition = {}
	let query = {}
	//let query = []
	//console.log(params)
	//console.log(params.to_distination_filled + ' = ' + (params.to_distination_filled == 'true' ? 'Yes': 'No'))
	//console.log(params)

	if(params.from_distination_filled == 'true') {
		var distination = JSON.parse(params.from_distination)
		query["start_location.coordinate"] = {
	      	$geoWithin: {
	      		$centerSphere: [
	      			[distination.coordinate.longitude, distination.coordinate.latitude], 
	      			0.5/6378.1,
	      		] 
	      	}
	    }
		/*query.push({
			"start_location.coordinate": {
				$nearSphere: {
				    $geometry: {
				        type : "Point",
				        coordinates : [distination.coordinate.longitude, distination.coordinate.latitude]
				    },
				    $minDistance: 0,
				    $maxDistance: 500,
				}
			}
		})*/
	} 

	if(params.to_distination_filled == 'true') {
		var distination = JSON.parse(params.to_distination)
		query["end_location.coordinate"] = {
	      	$geoWithin: { 
	      		$centerSphere: [
	      			[distination.coordinate.longitude, distination.coordinate.latitude], 
	      			0.5/6378.1,
	      		] 
	      	}
	    }
		/*query.push({
			"end_location.coordinate": {
				$nearSphere: {
				    $geometry: {
				        type : "Point",
				        coordinates : [distination.coordinate.longitude, distination.coordinate.latitude]
				    },
				    $minDistance: 0,
				    $maxDistance: 500,
				}
			}
		})*/
	}

	//console.log(query)

	Ride.aggregate({
		$match: query,
	}, function (err, rides) {
		//console.log(rides)
        if (err) return res.status(500).send("There was a problem finding the users.");
        res.status(200).send({
        	code: 0,
        	data: rides
        })
    })

	/*$match: {
		    'start_location.coordinate': {
		      	$geoWithin: { 
		      		$centerSphere: [
		      			[ -4.364399, 36.514921 ], 
		      			0.5/6378.1 
		      		] 
		      	}
		    },
		    'end_location.coordinate': {
		      	$geoWithin: { 
		      		$centerSphere: [
		      			[ -4.364399, 36.514921 ], 
		      			0.5/6378.1 
		      		] 
		      	}
		    },
		},*/
	/*Ride.find({
		$and: query
	}, function (err, rides) {
		console.log(err)
        if (err) return res.status(500).send("There was a problem finding the users.");
        res.status(200).send({
        	code: 0,
        	data: rides
        })
    })*/
})

module.exports = router

//var User = require('./User')
