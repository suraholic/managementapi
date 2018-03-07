const logger = require('./winston')
const googleOauth = require('./googleOauth')

module.exports = function(app, passport){
  app.use(passport.initialize())
  app.use(passport.session())

  passport.serializeUser((user, done)=>{
    done(null, user)
  })

  passport.deserializeUser((user, done)=>{
    done(null, user)
  })

  passport.use('google', googleOauth)
}

