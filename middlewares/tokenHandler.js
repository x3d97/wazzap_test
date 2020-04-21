const Helpers = require('../helpers');
const Exceptions = require('../exceptions');

module.exports = () => (req, res, next) => {
  const withoutTokenMessage = `You did not provide an API key. You need to provide your API key in the Authorization header, using Bearer auth (e.g. 'Authorization: Bearer YOUR_SECRET_KEY').`;

  if (!req.headers.authorization) throw new Exceptions.AuthenticationError(withoutTokenMessage);

  const encoded = req.headers.authorization.split(' ')[1];

  if (!encoded) throw new Exceptions.AuthenticationError(withoutTokenMessage);

  Helpers.verifyToken(encoded)
    .then(decoded => {
      req.decoded = decoded;
      next();
    })
    .catch(() => {
      next(new Exceptions.AuthenticationError(`Invalid API Key provided: ${encoded}`));
    })
};
