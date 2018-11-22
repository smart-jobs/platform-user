// app/middleware/gzip.js
'use strict';

module.exports = ({ enable = false, body = false }) => async function accessLog(ctx, next) {

  if (enable) {
    ctx.app.logger.info(`[access-log] ${ctx.method} ${ctx.url}`);
    if (body) {
      ctx.app.logger.debug('[access-log] ', ctx.request.body);
    }
  }
  await next();
};
