# log-view-manager

[![Build Status](https://travis-ci.org/rhinel/log-view-manager.svg?branch=master)](https://travis-ci.org/rhinel/log-view-manager)

> log-view-manager for server
>
> 项目后端：nodejs express log4js mongodb3 redis
>
> 项目前端：webpack4 react ElementUI superagent

## Build Setup

```bash
# install dependencies
yarn

# serve with hot reload at localhost:3000
yarn start

# for api server at localhost:80
yarn serve

# build for production with minification
yarn build

```

## screenshot

<p align="center">
  <img src="https://user-images.githubusercontent.com/12730596/41387048-6bac6058-6fb7-11e8-8c05-4378e8e297af.jpg" width="700px">

  <br>

  <img src="https://user-images.githubusercontent.com/12730596/41387167-11363134-6fb8-11e8-915c-93d91122c4df.png" width="700px">
</p>

## 待解决问题

mongodb3（mongodb4支持，待升级）没有事务的问题。

时区问题，前端添加为+0800时区，服务器时间为0时区，要注意修改服务器时区为+0800，
另一种解决方案是，使用国际时间并封装时区时间方法。
