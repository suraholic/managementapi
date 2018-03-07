require('dotenv').config()

const PORT = process.env.PORT
const LOGDIR = process.env.LOGGER_DIR
const SECRET = process.env.SECRET

const express = require('express')
const bodyParser = require('body-parser')
const session = require('express-session')

const func = require('./src/middleware/function')
const logger = require('./src/middleware/winston')
const router = require('./src/routers')
const passport = require('passport')
const mPassport = require('./src/middleware/passport')

const app = express()
const flash = require('connect-flash')

app.set('views', __dirname + '/public')
app.set('view engine', 'ejs')
app.use(express.static(__dirname + '/public'))
app.use(bodyParser.urlencoded({extended:false}))
app.use(flash())
app.use(session({
  secret: SECRET,
  resave: false,
  saveUninitialized: true
}))

mPassport(app, passport)
app.use('/', router)

/** express server */
app.listen(PORT, ()=>{
  logger.info(`${func.getDateTime()} express ${PORT} server is running...`)
})