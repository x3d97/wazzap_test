const _ = require('lodash');

const config = require('../config');
const Helpers = require('../helpers');
const Exceptions = require('../exceptions');

const { UserMeta } = require('../models');

module.exports = rights => (req, res, next) => {
  if(!_.isArray(rights)) rights = [rights];

  new UserMeta()
    .where('id_user', req.decoded.user_id)
    .fetchAll()
    .then(model => {
      const data = model.toJSON();

      const accessRightsKeys = data
        .filter(row => row.key.includes(config.accessRightsPrefix))
        .map(row => row.key);

      const userRights = Helpers.createRightsObjectByKeys(accessRightsKeys);

      const allowAccess = rights.reduce((acc, item) => {
        acc = userRights[item];
        return acc;
      }, true);

      if (!allowAccess) throw new Exceptions.ForbiddenError();
      next();
    })
    .catch(next);
};
