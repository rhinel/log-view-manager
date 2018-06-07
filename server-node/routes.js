const fs = require('fs')
const path = require('path')
const log4js = require('log4js')

const controller = require('./controllers')

const sysLog = log4js.getLogger('sys')

module.exports = (app, express) => {
  // 外部接口处理
  app.route('/api/outer/:class/:function?').post(controller.outer)

  // 用户权限校验处理
  app.route('/api/inner/*').post(controller.auth)
  // 内部接口，权限接口控制器
  app.route('/api/inner/:class/:function?').post(controller.inner)

  // 接口默认返回
  app.route('/api/*').post(controller.def)

  // 默认接口错误处理
  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    sysLog.error('system route error: ', err)
    res.status(err.status || 500).send({
      code: 1000,
      msg: err.message,
    })
  })

  // 处理页面, 动态加载
  app.use('/', express.static(path.resolve(__dirname, '../static')))
  app.use('/static', express.static(path.resolve(__dirname, '../dist/static')))
  app.use('/404', express.static(path.resolve(__dirname, '../404')))
  app.get('*', (req, res) => {
    if (req.hostname && req.hostname === 'log.fantasy-nations.cn') {
      res.send(fs.readFileSync(path.resolve('../dist/index.html'), 'utf-8'))
    } else {
      res.send(fs.readFileSync(path.resolve('../404/404.html'), 'utf-8'))
    }
  })
}
