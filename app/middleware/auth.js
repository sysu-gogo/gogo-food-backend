'use strict';

module.exports = options => {
  return async function(ctx, next) {
    const token = ctx.request.header['x-access-token'];

    switch (options.type) {
      case 'no-authorize': {
        if (!token) {
          await next();
        } else {
          throw new Error('已登录用户无法访问');
        }
        break;
      }
      case 'authorize': {
        let decoded;
        try {
          decoded = ctx.service.auth.verifyToken(token);
        } catch (e) {
          throw new Error('登录无效或已过期');
        }

        // TODO: 权限管控逻辑

        ctx.authInfo = decoded;
        await next();
        break;
      }
      default:
        throw new Error('未知权限管控分类');
    }
  };
};
