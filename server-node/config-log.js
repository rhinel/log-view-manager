const path = require('path')

module.exports = {
  appenders: {
    // HTTP日志，请求日志
    http: {
      type: 'dateFile',
      filename: `${path.resolve(__dirname, '../logs/httpLogs/logs')}Http.log`,
      maxLogSize: 102400,
      backups: 1024,
    },

    // 系统日志，如：程序启动和db链接日志，框架错误，catch框架错误，db连接错误等
    sys: {
      type: 'dateFile',
      filename: `${path.resolve(__dirname, '../logs/sysLogs/logs')}Sys.log`,
      maxLogSize: 102400,
      backups: 1024,
    },

    // 登陆日志，所有登录登出等的日志
    login: {
      type: 'dateFile',
      filename: `${path.resolve(__dirname, '../logs/loginLogs/logs')}Login.log`,
      maxLogSize: 102400,
      backups: 1024,
    },

    // 内部接口日志
    innerApi: {
      type: 'dateFile',
      filename: `${path.resolve(__dirname, '../logs/innerApiLogs/logs')}InnerApi.log`,
      maxLogSize: 102400,
      backups: 1024,
    },
    // 外部接口日志
    outerApi: {
      type: 'dateFile',
      filename: `${path.resolve(__dirname, '../logs/outerApiLogs/logs')}OuterApi.log`,
      maxLogSize: 102400,
      backups: 1024,
    },

    // 所有业务产生API日志流水
    apiAll: {
      type: 'dateFile',
      filename: `${path.resolve(__dirname, '../logs/apiAllLogs/logs')}apiAll.log`,
      maxLogSize: 102400,
      backups: 1024,
    },

    // PLATFORM CODE APIERROR日志，所有平台API请求产生的程序错误日志
    platformCodeApiError: {
      type: 'dateFile',
      filename: `${path.resolve(__dirname, '../logs/platformCodeApiErrorLogs/logs')}platformCodeApiError.log`,
      maxLogSize: 102400,
      backups: 1024,
    },

    // 错误日志，所有的错误日志
    errorsFile: {
      type: 'dateFile',
      filename: `${path.resolve(__dirname, '../logs/errorsFileLogs/logs')}ErrorsFile.log`,
      maxLogSize: 102400,
      backups: 1024,
    },
    errors: {
      type: 'logLevelFilter',
      appender: 'errorsFile',
      level: 'error',
    },

    console: { type: 'console' },
  },
  categories: {
    default: { appenders: ['console', 'errors'], level: 'info' },
    http: { appenders: ['http', 'errors'], level: 'info' },
    sys: { appenders: ['sys', 'console', 'errors'], level: 'info' },

    login: { appenders: ['login', 'apiAll'], level: 'info' },

    innerApi: { appenders: ['innerApi', 'console', 'apiAll', 'errors'], level: 'info' },
    outerApi: { appenders: ['outerApi', 'console', 'apiAll', 'errors'], level: 'info' },

    platformCodeApiError: { appenders: ['platformCodeApiError'], level: 'info' },
  },
}
