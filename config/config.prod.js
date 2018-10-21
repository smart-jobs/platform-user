'use strict';

module.exports = () => {
  const config = exports = {};

  // add your config here
  config.cluster = {
    listen: {
      port: 8101,
    },
  };

  // mongoose config
  config.mongoose = {
    url: 'mongodb://localhost:27018/platform',
    options: {
      user: 'root',
      pass: 'Ziyouyanfa#@!',
      authSource: 'admin',
      useNewUrlParser: true,
      useCreateIndex: true,
    },
  };

  config.logger = {
    // level: 'DEBUG',
    // consoleLevel: 'DEBUG',
  };

  return config;
};
