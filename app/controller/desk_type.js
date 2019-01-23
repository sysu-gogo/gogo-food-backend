'use strict';

const Controller = require('egg').Controller;

class DeskTypeController extends Controller {
  async list() {
    const { ctx } = this;
    ctx.body = await ctx.model.DeskType.findAll();
  }

  async create() {
    const { ctx } = this;
    const {
      name,
      description,
    } = ctx.request.body;

    await ctx.model.DeskType.create({
      name,
      description,
    });

    ctx.body = {};
  }

  async update() {
    const { ctx } = this;
    const { id } = ctx.params;
    const { name,
      description,
      need_queue, // 是否需要排队
    } = ctx.request.body;

    const form = {
      name,
      description,
      need_queue,
    };
    for (const key in form) {
      if (form[key] === undefined) delete form[key];
    }

    const res = await ctx.model.DeskType.update(form, { where: { id } });
    console.log(res);

    ctx.body = {};
  }

  async delete() {
    const { ctx } = this;
    const { id } = ctx.params;
    await ctx.model.DeskType.destroy({ where: { id } });
    ctx.body = {};
  }
}

module.exports = DeskTypeController;
