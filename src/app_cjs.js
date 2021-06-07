//Entry into server for Common JS (Use only when you don't have ES6 Modules)

//Import Application
const app = require('.');
//Get env variable
require('dotenv').config();
const { PORT } = process.env;
const { NODE_ENV } = process.env;

app.listen(PORT, () => {
  `Listening on ${PORT} in ${NODE_ENV} environment.`;
});
