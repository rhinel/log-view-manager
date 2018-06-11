const log4js = require('log4js')

// 日志转换
const code = require('./config-codes')

// 日志记录
const outerApiLog = log4js.getLogger('outerApi')
const innerApiLog = log4js.getLogger('innerApi')

// 系统模块
const service = require('./services')
const serviceDash = require('./services-dash')

// res.json([req.params,req.query,req.body])
// res.json([req.params==url,req.query==get,req.body==post])
// data是一个设计的返回对象，包含编码和内容，使用codes进行封装

// outer类，失败则跳过
const outer = (req, res, next) => {
  outerApiLog.info('Outer-POST', req.url)
  req.typeApi = 'outerApi'

  // 登陆类
  if (req.params.class === 'log') {
    req.typeApi = 'login'
    if (req.params.function === 'login') {
      service
        .login(req, res)
        .then(data => res.json(code(req, 0, data)))
        .catch(err => res.json(code(req, 1001, err)))
    } else if (req.params.function === 'logout') {
      service
        .logout(req, res)
        .then(data => res.json(code(req, 0, data)))
        .catch(err => res.json(code(req, 1002, err)))
    } else {
      next()
    }
  } else {
    next()
  }
}

// auth类，成功则跳过
const auth = (req, res, next) => {
  // 接口校验
  const token = req.body.token || req.query.token || req.headers.token || ''
  if (!token) {
    res.json(code(req, 2001))
  } else {
    service
      .auth(req, res)
      .then(() => next())
      .catch(err => res.json(code(req, 2001, err)))
  }
}

// inner类，失败则跳过
const inner = (req, res, next) => {
  innerApiLog.info('Inner-POST', req.url)
  innerApiLog.info('          ', req.userData.name)
  req.typeApi = 'innerApi'

  if (req.params.class === 'auth') {
    delete req.typeApi
    res.json(code(req, 0))

  } else if (req.params.class === 'dashboard') {
    if (req.params.function === 'folderAdd') {
      serviceDash
        .folderAdd(req, res)
        .then(data => res.json(code(req, 0, data)))
        .catch(err => res.json(code(req, 3001, err)))
    } else if (req.params.function === 'folderList') {
      serviceDash
        .folderList(req, res)
        .then(data => res.json(code(req, 0, data)))
        .catch(err => res.json(code(req, 3002, err)))
    } else if (req.params.function === 'folderDel') {
      serviceDash
        .folderDel(req, res)
        .then(data => res.json(code(req, 0, data)))
        .catch(err => res.json(code(req, 3003, err)))
    } else if (req.params.function === 'dataList') {
      serviceDash
        .dataList(req, res)
        .then(data => res.json(code(req, 0, data)))
        .catch(err => res.json(code(req, 3004, err)))
    } else {
      next()
    }

  } else {
    next()
  }
}

// default类，最后返回
const def = (req, res) => {
  delete req.typeApi
  res.json(code(req, 9999))
}

module.exports = {
  outer,
  auth,
  inner,
  def,
}
