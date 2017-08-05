var express = require('express')
var app = express()
var db = require('./db')

app.use('/ride', require('./ride/RideController'))
app.use('/search', require('./search/SearchController'))
app.use('/user', require('./user/UserController'))
app.use('/showcase', require('./showcase/ShowcaseController'))
app.use('/category', require('./category/CategoryController'))
app.use('/tag', require('./tag/TagController'))

module.exports = app