//Entry into server for ES-6 (Use only when you have ES6 Modules)

require = require('esm')(module);
module.exports = require('./app_cjs').default;
