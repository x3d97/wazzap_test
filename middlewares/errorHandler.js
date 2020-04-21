const log = require('../logger');
const Exceptions = require('../exceptions');

function nodeExceptionReport(options) {
  return function (error, req, res, next) {
    log.error(error, 'Middleware error handler');

    if (error.status && res.statusCode === 200) res.status(error.status);

    if (error instanceof Exceptions.ApiError === false) {
      const body = {
        status: error.status,
        message: error.message,
      };

      return res.status(500).json({ error: body });
    }

    return res.json({ error });
  };
}

module.exports = nodeExceptionReport;
