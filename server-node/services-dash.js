const FoundError = require('./config-error')
const db = require('./models')

const fs = require('fs')

module.exports = {

  // folderAdd - 添加方法
  folderAdd: async req => {
    // 不做数据校验
    // 如果有ID，则查找更新
    // 查重
    // 如果没有ID，则新建

    // 1如果有ID
    if (req.body._id) {
      const folderEdit = await db
        .dbModel('folders', {       //* //标记，初始目录数据类，修改类型
          projectName: String,      // 项目名称
          folderName: String,       // 目录名称
          address: String,          // 目录地址
          showColumns: String,      // 正则后表头，用|分割
          regexps: Array,           // 正则列表
          updateTime: Date,         // 更新时间
        })
        .findOneAndUpdate({ _id: req.body._id }, {
          projectName: req.body.projectName,
          folderName: req.body.folderName,
          address: req.body.address,
          showColumns: req.body.showColumns,
          regexps: req.body.regexps,
          updateTime: Date.now(),
        })
        .exec()

      if (!folderEdit) {
        return Promise.reject(new FoundError('修改失败'))
      }

      return { _id: req.body._id }
    }

    // 2插入新数据
    const folderAdd = await db
      .dbModel('folders', {       //* //标记，初始目录数据类
        projectName: String,      // 项目名称
        folderName: String,       // 目录名称
        address: String,          // 目录地址
        showColumns: String,      // 正则后表头，用|分割
        regexps: Array,           // 正则列表
        status: Number,           // 状态
        createTime: Date,         // 新建时间
      })
      .create({
        projectName: req.body.projectName,
        folderName: req.body.folderName,
        address: req.body.address,
        showColumns: req.body.showColumns,
        regexps: req.body.regexps,
        status: 1,
        createTime: Date.now(),
      })

    if (!folderAdd) {
      return Promise.reject(new FoundError('新增失败'))
    }

    // 3返回
    return { _id: folderAdd._id }
  },

  // folderList - 列表方法
  folderList: async req => {
    // 查询列表并返回

    // 1查询
    const folderList = await db
      .dbModel('folders')
      .find({
        status: 1,
      })
      .sort('projectName folderName')
      .exec()

    // 2返回
    return folderList
  },

  // folderDel - 删除方法
  folderDel: async req => {
    // 修改状态
    // 返回del对象

    if (!req.body._id) {
      return Promise.reject(new FoundError('缺少ID'))
    }

    // 1根据ID修改状态
    const folderDel = await db
      .dbModel('folders', {       //* //标记，初始目录数据类，删除类型
        status: Number,           // 状态
        updateTime: Date,         // 更新时间
      })
      .findOneAndUpdate({ _id: req.body._id }, {
        status: 0,
        updateTime: Date.now(),
      })
      .exec()

    if (!folderDel || !folderDel.status) {
      return Promise.reject(new FoundError('无此目录或目录已删除'))
    }

    return { _id: req.body._id }
  },

  // dataList - 目录正则后数据
  dataList: async req => {
    // 根据ID查询数据
    // 获取日志文件
    // 直接正则并返回

    if (!req.body._id) {
      return Promise.reject(new FoundError('缺少ID'))
    }

    // 1查询
    const folder = await db
      .dbModel('folders')
      .findOne({
        _id: req.body._id,
        status: 1,
      })
      .lean()
      .exec()

    if (!folder || !folder.status) {
      return Promise.reject(new FoundError('无此目录或目录已删除'))
    }

    // 2获取日志文件
    const address = folder.address

    const dataFileList = fs.readdirSync(address)

    const dataList = {}

     dataFileList.map(file => {
      let dataFile = fs.readFileSync(address + file, 'utf-8')

      folder.regexps.forEach(regexp => {
        if (regexp.type === 'split') {
          dataFile = dataFile
            .split(new RegExp(regexp.value))
        } else if (regexp.type === 'map-replace') {
          dataFile = dataFile
            .map(_ => _.replace(new RegExp(regexp.value), regexp.toValue))
        } else if (regexp.type === 'map-match') {
          dataFile = dataFile
            .map(_ => {
              const line = { ..._.match(new RegExp(regexp.value)) }
              line.input = line.input.replace(/\n/g, '<br>')
              line.input = line.input.replace(/\s/g, '&nbsp;')
              return line
            })
        } else if (regexp.type === 'reverse') {
          dataFile.reverse()
        }
      })

      dataList[file] = dataFile
    })

    return {
      folder,
      dataList,
    }
  },
}
