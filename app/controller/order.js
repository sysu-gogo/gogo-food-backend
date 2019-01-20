'use strict';

const Controller = require('egg').Controller;

class OrderController extends Controller {
  async list() {
    const { ctx } = this;
    ctx.body = await ctx.model.Order.findAll({
      where: {
        customer_id: ctx.authInfo.uid,
      },
    });
  }

  async listForAdmin() {
    this.ctx.body = 'hi, egg';
  }

  async getStatus() {
    const { ctx } = this;
    const { id } = ctx.params;
    ctx.body = await ctx.model.Order.findOne({
      where: {
        customer_id: ctx.authInfo.uid, // 确保有权限
        id,
      },
      attributes: [ 'id', 'status' ],
    });
  }

  async detail() {
    const { ctx } = this;
    const { id } = ctx.params;
    ctx.body = await ctx.model.Order.findOne({
      where: {
        customer_id: ctx.authInfo.uid, // 确保有权限
        id,
      },
      include: [{
        model: ctx.model.OrderItem,
        attributes: [ 'id', 'specification_id', 'count', 'price' ],
        as: 'items',
        include: [{
          model: ctx.model.Specification,
          attributes: [ 'id', 'name', 'description' ],
          include: [{
            model: ctx.model.Food,
            attributes: [ 'id', 'name', 'brief' ],
          }],
        }],
      }, {
        model: ctx.model.Desk,
        attributes: { exclude: [ 'created_at', 'updated_at' ] },
        include: [{
          model: ctx.model.DeskType,
          attributes: [ 'name' ],
        }],
      }],
    });
  }

  async create() {
    const { ctx, app } = this;
    const Op = app.Sequelize.Op;
    const {
      desk_id,
      cart,
      remark,
    } = ctx.request.body;

    // 分拆购物车
    const specification_ids = new Set();
    const items = cart.split('|').map(function(v) {
      v = v.split(',');
      specification_ids.add(parseInt(v[0]));

      return {
        specification_id: parseInt(v[0]),
        count: parseInt(v[1]),
      };
    });
    if (!cart.length) {
      throw new Error('购物车中无菜品');
    }

    // 获取单价
    const specifications = await ctx.model.Specification.findAll({
      attributes: [ 'id', 'name', 'price', 'count' ],
      where: {
        id: {
          [Op.in]: Array.from(specification_ids),
        },
      },
      raw: true,
    });

    // 计算总价、分析库存

    let total_price = 0; // 全部总价

    items.forEach(function(item) {
      const target = specifications.find(function(v) {
        return v.id === item.specification_id;
      });
      if (!target) throw new Error('菜品不存在，请重新选菜');
      if (item.count > target.count) throw new Error(`${target.count}库存仅剩${target.count}，请减少下单数量`);

      item.price = target.price; // 登记历史单价

      total_price += target.price * item.count;
    });

    // 生成订单
    const res = await ctx.model.Order.create({
      status: 'auditing',
      customer_id: ctx.authInfo.uid,
      desk_id,
      order_no: Date.now() + Math.round(Math.random() * 1000),
      total_price,
      paid_price: total_price, // 模拟：实际上得支付系统返回结果才写进去
      remark,
    });

    const task = [];
    // 添加多个订单菜品
    task.push(items.map(function(v) {
      return ctx.model.OrderItem.create({
        specification_id: v.specification_id,
        count: v.count,
        price: v.price,
        order_id: res.id,
      });
    }));

    // 减少库存
    task.push(items.map(function(v) {
      return new Promise(function(resolve, reject) {
        ctx.model.Specification.findOne({
          where: { id: v.specification_id },
        }).then(specification => {
          return specification.decrement('count', { by: v.count });
        }).then(() => {
          resolve();
        })
          .catch(e => {
            reject(e);
          });
      });
    }));

    await Promise.all(task);

    ctx.body = {
      order_id: res.id,
    };

    // WARNING! 模拟自动审计
    setTimeout(async function() {
      // 修改状态从审计 -> 完成
      await ctx.model.Order.update({
        status: 'finish',
        finish_at: new Date(),
      }, {
        where: { id: res.id },
      });
    }, 10000);
  }
}

module.exports = OrderController;
