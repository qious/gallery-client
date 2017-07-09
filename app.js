'use strict'

require('art-template')
const config = require('config')
const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const error = require('koa-json-error')
const mount = require('koa-mount')
const serve = require('koa-static')
const logger = require('./lib/logger')
const session = require('./middleware/session')
const router = require('./middleware/router')

const app = new Koa()

app.keys = config.keys

// 错误处理
app.use(error())

// 静态资源目录
app.use(mount('/static', serve(config.staticDir)))

// Body Parser
app.use(bodyParser())

// Session 加载
app.use(session())

// Api 路由
app.use(router())

// 监听服务
app.listen(config.port, config.host)
logger.info('Server listen on ' + config.baseUrl)
