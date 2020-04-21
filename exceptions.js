const config = require('./config');

class ApiError extends Error {
  constructor (message, type) {
    super(...arguments);

    this.name = 'APIError';
    this.message = (message || 'API error was made.');
    this.type = type || 'invalid_request_error';
    this.status = 500;
  }

  toJSON () {
    return {
      type: this.type,
      message: this.message,
      name: this.name,
    };
  }
}

module.exports.ApiError = ApiError;

class AuthenticationError extends ApiError {
  constructor (message, type) {
    super(...arguments);

    this.name = 'AuthenticationError';
    this.message = (message || 'Not possible to authenticate');
    this.status = 401;
  }
}

module.exports.AuthenticationError = AuthenticationError;

class NotFoundError extends ApiError {
  constructor (message, type) {
    super(...arguments);

    this.name = 'NotFoundError';
    this.message = (message || 'Resource not found');
    this.status = 404;
  }
}

module.exports.NotFoundError = NotFoundError;

class ConflictError extends ApiError {
  constructor (message, type) {
    super(...arguments);

    this.name = 'ConflictError';
    this.message = (message || 'Resource already exists');
    this.status = 409;
  }
}

module.exports.ConflictError = ConflictError;