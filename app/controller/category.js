'use strict';

const Controller = require('egg').Controller;

class CategoryController extends Controller {
  async list() {
    const { ctx } = this;
    ctx.body = await ctx.model.Category.findAll();
  }

  async create() {
    const { ctx } = this;
    const { name,
      order,
      icon,
      color } = ctx.request.body;

    await ctx.model.Category.create({
      name,
      order,
      icon,
      color,
    });
    ctx.body = {};
  }

  async update() {
    const { ctx } = this;
    const { id } = ctx.params;
    const { name,
      order,
      icon,
      color } = ctx.request.body;

    const form = {
      name,
      order,
      icon,
      color,
    };
    for (const key in form) {
      if (form[key] === undefined) delete form[key];
    }

    const res = await ctx.model.Category.update(form, { where: { id } });
    console.log(res);

    ctx.body = {};
  }

  async delete() {
    const { ctx } = this;
    const { id } = ctx.params;
    await ctx.model.Category.destroy({ where: { id } });
    ctx.body = {};
  }
}

module.exports = CategoryController;
