'use strict';

const Controller = require('egg').Controller;

class FoodController extends Controller {
  async list() {
    const { ctx } = this;
    ctx.body = await ctx.model.Food.findAll({
      attributes: { exclude: [ 'description', 'created_at', 'updated_at' ] },
      include: [{
        model: ctx.model.Category,
        attributes: [ 'id' ],
        through: {
          attributes: [],
        },
      }, ctx.model.Specification, {
        model: ctx.model.File,
        attributes: [ 'url' ],
        as: 'cover',
      }],
    });
  }

  async detail() {
    const { ctx } = this;
    const { id } = ctx.params;
    ctx.body = await ctx.model.Food.findOne({
      where: {
        id,
      },
      attributes: { exclude: [ 'brief', 'created_at', 'updated_at' ] },
      include: [ ctx.model.Specification, {
        model: ctx.model.File,
        attributes: [ 'name', 'url' ],
        as: 'images',
        through: {
          attributes: [],
        },
      }],
    });
  }

  async create() {
    const { ctx } = this;
    const { name,
      category_ids,
      brief,
      description,
      cover_id,
      image_ids } = ctx.request.body;

    const res = await ctx.model.Food.create({
      name,
      brief,
      description,
      cover_id,
    });

    const task = [];
    // 多个分类添加
    task.push((category_ids || '').split(',').map(function(v) {
      return ctx.model.FoodCategory.create({
        category_id: parseInt(v),
        food_id: res.id,
      });
    }));

    // 多个参考图添加
    task.push((image_ids || '').split(',').map(function(v) {
      return ctx.model.FoodImage.create({
        file_id: parseInt(v),
        food_id: res.id,
      });
    }));

    await Promise.all(task);

    ctx.body = {};
  }

  async update() {
    const { ctx } = this;
    const { id } = ctx.params;
    const { name,
      brief,
      description,
      cover_id } = ctx.request.body;

    const form = {
      name,
      brief,
      description,
      cover_id,
    };
    for (const key in form) {
      if (form[key] === undefined) delete form[key];
    }

    const res = await ctx.model.Food.update(form, { where: { id } });
    console.log(res);

    ctx.body = {};
  }

  async delete() {
    const { ctx } = this;
    const { id } = ctx.params;
    await ctx.model.Food.destroy({ where: { id } });
    ctx.body = {};
  }
}

module.exports = FoodController;
