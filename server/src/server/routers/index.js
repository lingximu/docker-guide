const router = require('koa-router')();
const home = require('./home');

router.use('', home.routes());

module.exports = router;