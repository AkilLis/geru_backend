var express = require('express')
var app = express()
var db = require('./db')

//app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['user_friends'] }))
/*app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    return res.status(200).send({
    	code: 0,
    })
  });*/
//app.get('/auth/facebook', passport.authenticate('facebook'))
app.use('/search', require('./search/SearchController'))
app.use('/user', require('./user/UserController'))
app.use('/showcase', require('./showcase/ShowcaseController'))
app.use('/category', require('./category/CategoryController'))
app.use('/tag', require('./tag/TagController'))
app.use('/project', require('./project/ProjectController'))
app.use('/projectbid', require('./projectBid/ProjectBidController'))
app.use('/projecthistory', require('./projectHistory/ProjectHistoryController'))
app.use('/message', require('./message/MessageController'))

module.exports = app