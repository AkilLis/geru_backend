var FacebookStrategy = require('passport-facebook').Strategy
var User = require('./user/User')
var FACEBOOK_APP_ID = "1549615252014368"
var FACEBOOK_APP_SECRET = "0c451692c82e35182f0084aedde8089e"
var FACEBOOK_APP_CALLBACK = "http://localhost:3000/auth/facebook/callback"

module.exports = function(passport) {

    passport.serializeUser(function(user, done) {
        done(null, user._id)
    });
    
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user)
        });
    });
    
    passport.use(new FacebookStrategy({
        clientID: FACEBOOK_APP_ID,
        clientSecret: FACEBOOK_APP_SECRET,
        callbackURL: ,
        passReqToCallback : true
    },
    function(accessToken, refreshToken, profile, cb) {
        User.findOrCreate({ facebook_id: profile.id }, function (err, user) {
          return cb(err, user)
        })
    }))
}