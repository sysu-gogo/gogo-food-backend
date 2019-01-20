'use strict';
const jwt = require('jsonwebtoken');
const Service = require('egg').Service;

class AuthService extends Service {
  // 创建token
  createToken(type, uid, expiresIn) {
    const options = {};
    if (expiresIn) {
      options.expiresIn = expiresIn;
    }
    return jwt.sign({
      type,
      uid,
    }, this.config.jwt_secret, options);
  }

  // 校验token
  verifyToken(token) {
    try {
      return jwt.verify(token, this.config.jwt_secret);
    } catch (err) {
      throw new Error('过期或无效的登录凭证，请重新登录');
    }
  }
}

module.exports = AuthService;
