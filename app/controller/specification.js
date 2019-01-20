'use strict';

const Controller = require('egg').Controller;

class SpecificationController extends Controller {
  async list() {
    const { ctx } = this;
    ctx.body = await ctx.model.Specification.findAll({
      where: {
        food_id: ctx.params.food_id,
      },
    });
  }

  async create() {
    const { ctx } = this;
    const { food_id } = ctx.params;
    const { name,
      description,
      price,
      count } = ctx.request.body;

    await ctx.model.Specification.create({
      food_id,
      name,
      description,
      price,
      count,
    });

    ctx.body = {};
  }

  async update() {
    const { ctx } = this;
    const { food_id, id } = ctx.params;
    const {
      name,
      description,
      price,
      count } = ctx.request.body;

    const form = {
      name,
      description,
      price,
      count,
    };
    for (const key in form) {
      if (form[key] === undefined) delete form[key];
    }

    const res = await ctx.model.Specification.update(form, { where: { id, food_id } });
    console.log(res);

    ctx.body = {};
  }

  async delete() {
    const { ctx } = this;
    const { food_id, id } = ctx.params;
    await ctx.model.Food.destroy({ where: { id, food_id } });
    ctx.body = {};
  }
}

module.exports = SpecificationController;
