# gogo-food-backend

## Document

- [Usecase Diagram(用例图)](https://sysu-gogo.github.io/sysu-gogo-food-docs/06-01-use-case-diagram)
- [Use Cases(用例+活动图)](https://sysu-gogo.github.io/sysu-gogo-food-docs/06-02-use-case)
- [Domian Models(领域模型)](https://sysu-gogo.github.io/sysu-gogo-food-docs/06-03-domain)
- [State Models(状态模型)](https://sysu-gogo.github.io/sysu-gogo-food-docs/06-04-statement)
- [System Sequence Diagrams(功能模型)](https://sysu-gogo.github.io/sysu-gogo-food-docs/06-05-System-Sequence-Diagram)
- [Database Design(数据库设计)](https://sysu-gogo.github.io/sysu-gogo-food-docs/07-02-database-design)
- [API design(API接口文档)](https://app.swaggerhub.com/apis/micblo/gogo-food/1.0.0)

## QuickStart

### First time

Please make config file for your env, such as `local` to `config/config.local.js`.

```
'use strict';

exports.wechat = {
  app_id: 'wx1234567890123', // wechat mini program app id
  app_secret: 'XXXXXXXXXXXXXXXXXXXX', // wechat mini program app secret
};

exports.jwt_secret = '123456'; // jwt token (must random!)

exports.sequelize = {
  dialect: 'mysql',
  database: 'gogo', // db name
  host: 'localhost', // db host
  port: 3306,
  username: 'root', // db user
  password: '', // db password
};

```

### Development

```bash
$ npm i
$ npm run dev
$ open http://localhost:7001/
```

### Deploy

```bash
$ npm start
$ npm stop
```

### npm scripts

- Use `npm run lint` to check code style.
- Use `npm test` to run unit test.
- Use `npm run autod` to auto detect dependencies upgrade, see [autod](https://www.npmjs.com/package/autod) for more detail.


[egg]: https://eggjs.org

### docker

[Please read this document, thx](https://sysu-gogo.github.io/sysu-gogo-food-docs/08-04-run-doc)

