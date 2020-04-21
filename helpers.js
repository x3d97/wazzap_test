const jwt = require('jsonwebtoken');
const config = require('./config');

const Helpers = {};

Helpers.verifyToken = (token) => new Promise((resolve, reject) => {
  jwt.verify(token, config.tokenSecret, (err, decoded) => {
    if (err) return reject(err);
    resolve(decoded);
  });
});

module.exports = Helpers;