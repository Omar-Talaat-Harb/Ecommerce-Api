require('dotenv').config({ path: __dirname + '/../config.env' });
module.exports={
  "development": {
    "username": process.env.DB_USER,
    "password": process.env.DB_PASS,
    "database": process.env.DB,
    "host": process.env.HOST,
    "dialect": 'postgres',
    "logging": false
  },
  "test": {
    "username": process.env.DB_USER,
    "password": process.env.DB_PASS,
    "database": process.env.DB,
    "host": process.env.HOST,
    "dialect": 'postgres',
    "logging": false
  },
  "production": {
    "username": process.env.DB_USER,
    "password": process.env.DB_PASS,
    "database" : process.env.DB,
    "host": process.env.HOST,
    "dialect": 'postgres',
    "logging": false
  }
}
