const Koa = require('koa');
const Router = require('koa-router');
const path = require('path')
const serve = require('koa-static');
const cors = require('@koa/cors');
const conditional = require('koa-conditional-get');
const etag = require('koa-etag');
const config = require('config')

const router = require('./routers')
const auth = require('./middleware/auth')

const app = new Koa();


module.exports = (options) => {

  app.use(cors({
    "Access-Control-Allow-Origi": (ctx) => {
      if(/lingximu|localhost|127.0.0.1|101.132.161.32/i.test(ctx.request.origin)){
        return ctx.request.origin;
      }
    }
  }));

  app.use(auth())

  app.use(conditional());
  app.use(etag());

  const root = config.staticRootDir
  app.use(serve(root,{
    maxage: 1000 * 60 * 60 * 1
  }))

  app.use(router.routes())

  router.get('/**', (ctx, next) => {
    ctx.body = "404"
    ctx.status = 404;
  });
    return app;
}
