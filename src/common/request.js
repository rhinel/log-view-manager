import Superagent from 'superagent';
import { Message } from 'element-react';
// eslint-disable-next-line import/no-extraneous-dependencies
import CreateHistory from 'history/createHashHistory';

import c from './config';

// 定义负载常量
const rootPath = c.AjaxRootPath
const pre = c.Storage

// 方法封装
const Request = (_path, _body) => {
  const path = rootPath + _path
  const body = Object.assign({
    token: localStorage.getItem(`${pre}token`),
  }, _body || {})

  return Superagent
    .post(path)
    .send(body)
    .catch(err => {
      // 接口错误，报错退出
      Message({
        type: 'error',
        message: `状态：${err.status}，网络/服务器错误`,
        duration: 2000,
      })
      return Promise.reject(new Error('网络/服务器错误'))
    })
    .then(res => {
      const { code, msg, data } = res.body

      // 非正常情况，返回错误
      // 非auth接口，登陆失效或者未登陆，先报错后，清除旧登陆信息，跳转
      if (code === 2001 && !path.includes('/auth')) {
        localStorage.removeItem(`${pre}token`)

        Message({
          type: 'error',
          message: `编号：${code}，${msg}`,
          duration: 2000,
        })

        CreateHistory()
          .push(`/login?backurl=${encodeURIComponent(
            window.location.hash.replace('#', ''),
          )}`);

        return Promise.reject(new Error(msg))
      }

      // auth接口，返回msg
      if (code === 2001) {
        return Promise.reject(new Error(msg))
      }

      // 其他接口返回错误代码
      if (code || code === null) {
        Message({
          type: 'error',
          message: `编号：${code}，${msg}`,
          duration: 2000,
        })
        return Promise.reject(new Error(code))
      }

      // 正常返回数据
      return data
    })
}

export default Request
