const log4js = require('log4js')

const FoundError = require('./config-error')

const platformCodeApiErrorLog = log4js.getLogger('platformCodeApiError')

// 提供默认错误提示
const codeList = {

  // outer类
  1000: '接口失败，请联系管理员',
  1001: '登陆失败',
  1002: '登出失败',

  // auth类
  2001: '长时间无操作或登陆失效，请重新登陆',

  // inner类
  3001: '接口失败',

  // 其他
  9999: '接口不存在',
}

// 根据接口使用返回格式化
module.exports = (req = {}, code = 0, data = '') => {
  const apiLog = log4js.getLogger(req.typeApi)
  // 所有错误类型，应该保存日志
  if (req.typeApi === 'login') {
    const { name, pwd } = req.body
    apiLog.info(req.params.function, name, pwd, data.message || data)
  } else if (data instanceof Error) {
    apiLog.error(req.params.function || req.params[0], data.message || data, data)
  } else if (req.typeApi === 'innerApi') {
    apiLog.info(req.params.function, '接口请求成功', req.userData.name)
  } else if (req.typeApi === 'outerApi') {
    apiLog.info(req.params.function, '接口请求成功', req.body.appId, req.body.openid)
  }

  // platform code apiError 非自定义类型错误，应该保存日志
  if (data instanceof Error && !(data instanceof FoundError)) {
    platformCodeApiErrorLog.error(req.params.function, data.message || data)
  }

  if (data instanceof Error) {
    return {
      code: Number(`${code}${data.code || ''}`),
      msg: data.message || codeList[code] || '未定义错误',
    }
  } else if (code) {
    return {
      code,
      msg: data || codeList[code] || '未定义错误',
    }
  }
  return {
    code: 0,
    data,
  }
}
