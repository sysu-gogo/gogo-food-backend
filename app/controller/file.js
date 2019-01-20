'use strict';

const Controller = require('egg').Controller;

class FileController extends Controller {
  async list() {
    const { ctx } = this;
    const { order } = ctx.request.query;
    let { page, size } = ctx.request.query;
    page = page || 1;
    size = size || 10;

    ctx.body = await ctx.model.File.findAll({
      offset: (page - 1) * size, limit: size,
      order: (function() {
        switch (order) {
          case 'id_asc':
            return [[ 'id', 'ASC' ]];
          default:
            return [[ 'id', 'DESC' ]];
        }
      })(),
    });
  }

  async create() {
    const { ctx } = this;
    const { name, url } = ctx.request.body;

    await ctx.model.File.create({
      name,
      url,
    });
    ctx.body = {};
  }

  async update() {
    const { ctx } = this;
    const { id } = ctx.params;
    const { name, url } = ctx.request.body;

    const form = {
      name,
      url,
    };
    for (const key in form) {
      if (form[key] === undefined) delete form[key];
    }

    const res = await ctx.model.File.update(form, { where: { id } });

    ctx.body = {};
  }

  async delete() {
    const { ctx } = this;
    const { id } = ctx.params;
    await ctx.model.File.destroy({ where: { id } });
    ctx.body = {};
  }
}

module.exports = FileController;
