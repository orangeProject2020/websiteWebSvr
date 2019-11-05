/**
 * web 入口
 */

let express = require('express') // express
// let logger = require('morgan') // log
// let fs = require('fs')
let path = require('path')
let session = require('express-session') // session
let bodyParser = require('body-parser') // 处理请求中body的内容
let methodOverride = require('method-override')
let config = require('./config/index')
let log = require('./lib/log')('app')

let app = express()

try {
  // 设置模板引擎
  let viewPath = path.join(__dirname, config.view_path)
  app.set('views', viewPath)
  app.engine('html', require('ejs').__express)
  app.set('view engine', 'html')

  // // log
  // let accessLogStream = fs.createWriteStream(path.join(__dirname, './logs/web' + (new Date()).toLocaleDateString() + '.log'), {
  //   flags: 'a'
  // })
  // if (!module.parent) app.use(logger('combined', {
  //   stream: accessLogStream
  // }))

  // 静态文件
  app.use('/assets', express.static(path.join(__dirname, './public/assets')))
  app.use('/favicon.ico', express.static(path.join(__dirname, './favicon.ico')))

  // session 支持
  app.use(session({
    resave: true, // don't save session if unmodified
    saveUninitialized: true, // don't create session until something stored
    secret: '493be557e3159cb8cdf31b0227f62e57'
  }))

  // parse request bodies (req.body)
  app.use(bodyParser.urlencoded({
    extended: true
  }))

  // allow overriding methods in query (?_method=put)
  app.use(methodOverride('_method'))

  app.use((req, res, next) => {
    if (process.env.NODE_ENV == 'dev') {
      res.locals.version = Date.now()
    } else {
      res.locals.version = config.version
    }
    next()
  })

  // load controllers
  // let controller = require('./lib/boot')
  // controller(app, { verbose: !module.parent })
  app.use(require('./middleware/websiteData'))

  app.get('/', async (req, res) => {
    res.locals.category = req.session.category
    res.render('index')
  })

  app.use(require('./middleware/categoryData'))

  // app.get('*', async (req, res) => {
  //   let url = req.originalUrl
  //   console.log(url)
  //   res.send(url)
  // })


  app.use(function (err, req, res, next) {
    // log it
    log.info(err)

    if (req.xhr) {
      // console.log(err)
      return res.status(500).json({
        code: 500,
        data: err
      })
    } else {
      // error page
      return res.status(500).render('500')
    }

    // next()

  })

  // assume 404 since no middleware responded
  app.use(function (req, res, next) {

    if (req.xhr) {
      res.status(404).json({
        code: 404
      })
    } else {
      // error page
      res.status(404).render('404', {
        url: req.originalUrl
      })
    }

  })

  /* istanbul ignore next */
  let port = require('./config/index').port
  app.listen(port, () => {
    log.info('Express started on port ' + port)
  })
} catch (err) {
  console.log(err)
}