const Koa = require('koa')
const Router = require('koa-router')
const respond = require('koa-respond')
const bodyParser = require('koa-bodyparser')

const { searchByTitle } = require('./handler')

const app = new Koa()
const router = new Router({
  prefix: '/api',
})

app
  .use(respond())
  .use(bodyParser())
  .use(router.routes())
  .use(router.allowedMethods())

router.get('/searchByTitle', searchByTitle)

app.listen(3000, () => {
  console.info('Node server running on port ', 3000)
})
