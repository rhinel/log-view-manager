const md5 = require('md5')

const FoundError = require('./config-error')
const db = require('./models')

module.exports = {

  // login - 登录方法
  login: async req => {
    // 校验字段，错误退出
    // 0根据MD5(IP，用户名，密码，时间)生成token
    // 1查询用户名密码，错误退出
    // 2查出登陆缓存
    // 3失效旧缓存，写入缓存新token
    // 4返回token

    if (!req.body.name) {
      await Promise.reject(new FoundError('请输入用户名'))
    } else if (!req.body.pwd) {
      await Promise.reject(new FoundError('请输入密码'))
    }

    // 0生成新token
    const tokenTime = new Date().getTime()
    const token = md5(`${req.ip}${req.body.name}${req.body.pwd}${tokenTime}`)

    // 1查询数据是否有超5次错误
    const ipCheck = await db
      .redisGet(req.ip)
    if (ipCheck && ipCheck >= 5) {
      await Promise.reject(new FoundError('用户名/密码错误超过5次，请等待5分钟后再次登陆'))
    }

    // 2查询用户名和密码校验
    const dbInfo = require('./auth.json')

    // 账号密码错误次数5分钟300秒机制，成功清除错误记录
    if (dbInfo.name !== req.body.name || dbInfo.pwd !== req.body.pwd) {
      const ipError = await db
        .redisIncr(req.ip)
      await db
        .redisSetTime(req.ip, 300)
      let errorTimes = 5 - ipError
      errorTimes = errorTimes < 0 ? 0 : errorTimes
      await Promise.reject(new FoundError(`用户名/密码错误，5分钟内您还有${errorTimes}次机会`))
    }
    await db
      .redisDelKeys(req.ip)

    // 3查出已有的登陆态，更新状态
    const userId = dbInfo._id.toString()
    // 踢其他人下线
    // let allTokens = await db
    //   .redisGetKeys(`${userId}$*`)
    // if (allTokens.length) {
    //   await db
    //     .redisDelKeys(allTokens)
    // }
    // 更新缓存，存缓存token:userid，1800秒
    await db
      .redisSet(`${userId}$${token}`, JSON.stringify(dbInfo), 1800)

    return token
  },

  // login - 登出方法
  logout: async req => {
    // 校验字段，错误空退出
    // 1清除缓存
    // 2返回空

    if (!req.body.token) {
      return
    }

    // 1查询并清空
    const reToken = await db
      .redisGetKeys(`*$${req.body.token}`)
    if (reToken.length) {
      await db
        .redisDelKeys(reToken)
    }
  },

  // inner - api - 鉴权方法
  auth: async req => {
    // 1查询缓存，错误退出
    // 2更新缓存
    // 3返回空

    // 1查询缓存
    const reToken = await db
      .redisGetKeys(`*$${req.body.token || req.query.token || req.headers.token}`)
    if (!reToken.length) {
      await Promise.reject(new FoundError('token不存在或已过期'))
    }

    const reUserData = await db
      .redisGet(reToken[0])

    // 2更新缓存
    req.userId = reToken[0].split('$')[0]
    req.userData = JSON.parse(reUserData)
    await db
      .redisSetTime(reToken[0], 1800)
  },

}
