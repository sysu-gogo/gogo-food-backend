'use strict';

const Controller = require('egg').Controller;

class QueueController extends Controller {
  // 获取总体的排队情况
  async getBriefInfo() {
    const { ctx } = this;

    const deskTypes = await ctx.model.DeskType.findAll({
      attributes: [ 'id', 'name', 'need_queue', 'description' ],
      raw: true,
    });
    // 没有桌位信息，就没办法做排队
    if (!deskTypes) {
      ctx.body = [];
      return;
    }

    const res = await Promise.all([
      // 获取队伍最前的号码
      ctx.model.Queue.findAll({
        where: { status: 'waiting' },
        attributes: [ 'desk_type_id', 'number' ],
        queue_at: 'queue_at ASC',
        group: 'desk_type_id',
      }),
      // 获取各个桌位的排队人数
      ctx.model.Queue.count({
        attributes: [ 'desk_type_id' ],
        where: { status: 'waiting' },
        group: 'desk_type_id',
      }),
    ]);

    ctx.body = deskTypes.map(function(deskType) {
      const resNext = res[0].find(function(v) {
        return v.desk_type_id === deskType.id;
      }) || null;
      deskType.next_num = resNext ? resNext.number : null;

      const resCount = res[1].find(function(v) {
        return v.desk_type_id === deskType.id;
      });
      deskType.count = resCount ? resCount.count : 0; // 0 === 无需等待
      return deskType;
    });
  }

  // 顾客查询排队进程
  async detail() {
    const { ctx, app } = this;
    const { Op } = app.Sequelize;

    let queue = ctx.body = await ctx.model.Queue.findOne({
      where: {
        customer_id: ctx.authInfo.uid,
        status: {
          // 只有过号和等待中会展示
          [Op.in]: [ 'waiting', 'withdrew' ],
        },
      },
      include: [{
        model: ctx.model.DeskType,
        attributes: [ 'name' ],
      }],
    });
    if (!queue) return;

    queue = queue.get({
      plain: true,
    });

    // 获取等待位置
    queue.prev_count = await ctx.model.Queue.count({
      where: {
        desk_type_id: queue.desk_type_id,
        status: 'waiting',
        queue_at: {
          [Op.lt]: new Date(queue.queue_at),
        },
      },
      raw: true,
    }) || 0;

    ctx.body = queue;
  }

  // 顾客取号
  async create() {
    const { ctx } = this;
    const {
      desk_type_id,
    } = ctx.request.body;

    // 防止重复取号
    const cnt = await ctx.model.Queue.count({
      where: {
        customer_id: ctx.authInfo.uid,
        status: 'waiting',
      },
    });
    if (cnt) {
      throw new Error('您有正在排队中的号码，请取消前一个排队后再取号');
    }

    // 创建号码
    await ctx.model.Queue.create({
      desk_type_id,
      customer_id: ctx.authInfo.uid,
      queue_at: new Date(),
    });

    ctx.body = {};
  }

  // 过号
  // 商家号码使用确认/作废
  async use() {
    const { ctx } = this;
    const {
      desk_type_id,
      used, // used: 1 代表 成功就座使用， 0 代表 就座失败
    } = ctx.request.body;

    const where = {
      desk_type_id,
      status: 'waiting',
    };

    const res = await ctx.model.Queue.update({
      status: parseInt(used) ? 'used' : 'withdrew',
    }, {
      where,
      queue_at: 'queue_at ASC', // 最前的号先使用
      limit: 1,
    });

    ctx.body = {
      changed: res[0], // 0 为未改动
    };
  }

  // 顾客自行退出排队
  async cancel() {
    const { ctx } = this;

    const res = await ctx.model.Queue.update({
      status: 'cancelled',
    }, { where: {
      status: 'waiting',
      customer_id: ctx.authInfo.uid,
    } });

    if (res[0] === 0) {
      throw new Error('您没有正在排队的号码');
    }

    ctx.body = {};
  }

  // 商家清空全部号码 【开业】
  async clean() {
    const { ctx } = this;

    await ctx.model.Queue.destroy({
      truncate: true,
    });
    ctx.body = {};
  }
}

module.exports = QueueController;
