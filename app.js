var express = require('express')
var app = express()
var db = require('./db')

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