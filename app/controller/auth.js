'use strict';
const request = require('request-promise');

const Controller = require('egg').Controller;

class AuthController extends Controller {
  async wechatLogin() {
    const { ctx, config } = this;
    const code = ctx.request.body.code;
    if (!code) throw new Error('无效的登录代码');

    const qs = `appid=${config.wechat.app_id}&secret=${config.wechat.app_secret}&js_code=${code}&grant_type=authorization_code`;
    const url = `https://api.weixin.qq.com/sns/jscode2session?${qs}`;

    let res;
    try {
      res = await request.get(url);
      res = JSON.parse(res);
    } catch (e) {
      throw new Error('访问微信服务器失败');
    }

    if (res.errmsg) {
      throw new Error('登录微信遇到错误');
    }

    // 登记OpenID
    let customer = await ctx.model.Customer.findOne({
      where: {
        wx_open_id: res.openid,
      },
    });

    if (!customer) {
      // 顾客不存在就注册一个
      customer = await ctx.model.Customer.create({ wx_open_id: res.openid });
    }
    console.log(customer.id);

    // 构造jwt
    const token = ctx.service.auth.createToken('customer', customer.id, 60 * 60 * 6);

    ctx.body = {
      token,
    };
  }
}

module.exports = AuthController;
