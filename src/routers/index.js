require('dotenv').config()

const router = require('express').Router()
const passport = require('passport')
const logger = require('../middleware/winston')
const axios = require('axios')
const flash = require('connect-flash')

function isAuthenticated(req, res, next) {
  if(req.isAuthenticated())
    return next()
  
  res.redirect('/login')
}

router.get('/', isAuthenticated, (req, res)=> {
  res.redirect('/leaderBoard')
})

router.get('/login', (req, res)=> {
  res.render('login')
})

router.get('/login/google', passport.authenticate('google', {
  scope: ['https://www.googleapis.com/auth/games']
}))

router.get('/googleauth', passport.authenticate('google', {failureRedirect: '/login'}), (req, res)=> {
  res.redirect('/leaderBoard')
})

router.get('/leaderBoard', isAuthenticated, (req, res)=> {
  axios.get('https://www.googleapis.com/games/v1/leaderboards', {
    headers: {'Authorization': 'Bearer ' + req.session.passport.user}
  })
  .then(function (response) {
    res.render('index', {
      errmsg: '',
      data: JSON.parse(JSON.stringify(response.data.items)),
      title: '리더보드'
    })
  })
  .catch(function (error) {
    logger.error(error)
    req.flash('error', '전송오류')
    res.render('index', {
      errmsg: req.flash('error'),
      title: '리더보드'
    })
  })
})  // leaderBoard

router.get('/achievements', isAuthenticated, (req, res)=> {
  axios.get('https://www.googleapis.com/games/v1/achievements', {
    headers: {'Authorization': 'Bearer ' + req.session.passport.user}
  })
  .then(function (response) {
    res.render('achievements', {
      errmsg: '',
      data: JSON.parse(JSON.stringify(response.data.items)),
      title: '업적리스트'
    })
  })
  .catch(function (error) {
    logger.error(error)
    req.flash('error', '전송오류')
    res.render('achievements', {
      errmsg: req.flash('error'),
      title: '업적리스트'
    })
  })
}) // achievements

router.get('/logout', (req, res)=> {
  req.session.destroy()
  res.clearCookie('user')
  res.redirect('/')
})

router.post('/score', isAuthenticated, (req, res)=> {
  const rid = req.body.rid
  axios.get('https://www.googleapis.com/games/v1/leaderboards/'+rid+'/scores/PUBLIC', {
    headers:{'Authorization': 'Bearer ' + req.session.passport.user },
    params: {
      timeSpan: 'ALL_TIME'
    }
  })
  .then(function (response) {
    res.render('score', {
      errmsg: '',
      data: JSON.parse(JSON.stringify(response.data.items)),
      title: '순위리스트'
    })
  })
  .catch(function (error){
    logger.error(error)
    req.flash('error', '전송오류')
    res.render('score', {
      errmsg: req.flash('error'), 
      title: '순위리스트'
    })
  })
}) // score

router.post('/hidden', isAuthenticated, (req, res)=>{
  const appkey = process.env.APPKEY
  const gid = req.body.gid
    
  axios({
    method: 'post',
    url: 'https://www.googleapis.com/games/v1management/applications/'+appkey+'/players/hidden/'+gid,
    headers: {'Authorization': 'Bearer ' + req.session.passport.user }
  })
  .then(function(response){
    req.flash('info', '제외가 완료되었습니다')
    res.render('complete', {
      infomsg : req.flash('info')
    })
  })
  .catch(function(error){
    logger.error(error)
    req.flash('info', '오류! 다시 시도하세요')
    res.render('complete', {
      infomsg: req.flash('info')
    })
  })
})

module.exports = router

