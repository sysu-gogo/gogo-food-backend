'use strict';

const Controller = require('egg').Controller;

class DeskController extends Controller {
  async list() {
    const { ctx } = this;
    const { desk_type_id } = ctx.query;

    const where = {
      desk_type_id,
    };
    for (const key in where) {
      if (where[key] === undefined) delete where[key];
    }

    ctx.body = await ctx.model.Desk.findAll({
      where,
      attributes: { exclude: [ 'created_at', 'updated_at' ] },
      include: [{
        model: ctx.model.DeskType,
        attributes: [ 'name' ],
      }],
    });
  }

  async detail() {
    const { ctx } = this;
    const { id } = ctx.params;
    ctx.body = await ctx.model.Desk.findOne({
      where: {
        id,
      },
      attributes: { exclude: [ 'created_at', 'updated_at' ] },
      include: [{
        model: ctx.model.DeskType,
        attributes: [ 'name', 'description' ],
      }],
    });
  }

  async create() {
    const { ctx } = this;
    const {
      name,
      desk_type_id,
    } = ctx.request.body;

    await ctx.model.Desk.create({
      name,
      desk_type_id,
    });

    ctx.body = {};
  }

  async update() {
    const { ctx } = this;
    const { id } = ctx.params;
    const { name,
      desk_type_id } = ctx.request.body;

    const form = {
      name,
      desk_type_id,
    };
    for (const key in form) {
      if (form[key] === undefined) delete form[key];
    }

    const res = await ctx.model.Desk.update(form, { where: { id } });
    console.log(res);

    ctx.body = {};
  }

  async delete() {
    const { ctx } = this;
    const { id } = ctx.params;
    await ctx.model.Desk.destroy({ where: { id } });
    ctx.body = {};
  }
}

module.exports = DeskController;
