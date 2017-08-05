var express = require('express')
var app = express()
var db = require('./db')

app.use('/ride', require('./ride/RideController'))
app.use('/search', require('./search/SearchController'))
app.use('/user', require('./user/UserController'))

module.exports = app