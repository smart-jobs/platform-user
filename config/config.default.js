'use strict';

module.exports = appInfo => {
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1517455121740_7922';

  // add your config here
  // config.middleware = [];

  config.cluster = {
    listen: {
      port: 8101,
    },
  };

  config.errorMongo = {
    details: true,
  };
  config.errorHandler = {
    details: true,
  };

  // mongoose config
  config.mongoose = {
    // url: 'mongodb://root:Ziyouyanfa%23%40!@localhost:27017/naf?authSource=admin',
    url: 'mongodb://localhost:27017/platform',
    options: {
      user: 'root',
      pass: 'Ziyouyanfa#@!',
      authSource: 'admin',
      useNewUrlParser: true,
      useCreateIndex: true,
    },
  };

  config.accessLog = {
    enable: true,
    body: true,
  };

  return config;
};
