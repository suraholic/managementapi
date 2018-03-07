require('dotenv').config()
const GoogleStrategy = require('passport-google-oauth20')

module.exports = new GoogleStrategy({
  clientID: process.env.CLIENTID,
  clientSecret: '',
  callbackURL: process.env.GCALLBACKURL
}, function(accessToken, refreshToken, profile, done){
  process.nextTick(function(){
    user = accessToken
    return done(null, user)
  })
})