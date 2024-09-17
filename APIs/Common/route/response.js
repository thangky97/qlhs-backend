'use strict';

const Logger = require('../../../utils/logging');
const errorCodes = {
  405: { statusCode: 405, error: 'Method Not Allowed', message: 'An invalid operation occurred' },
  500: { statusCode: 500, error: 'Internal Server Error', message: 'An internal server error occurred' },
  505: { statusCode: 505, error: 'Unauthorized', message: 'An internal server unauthorized' },
  200: { statusCode: 200, error: null, message: 'Success', data: {} },
};

module.exports = {
  errorCodes,
  setup: function (manager) {
    return async function (request, reply, method) {
      if (request.rejectProductExpired) {
        return reply.response({
          ...errorCodes[500],
          error: "Product is expired"
        }).code(500);
      }
      if (request.rejectByInvalidToken) {
        return reply.response(errorCodes[505]).code(505);
      } else {
        return await manager[method](request).then((data) => {
          let responseData = errorCodes[200];
          if (data !== undefined) {
            responseData.data = data;
            return reply.response(responseData).code(200);
          } else {
            return reply.response(errorCodes[500]).code(500);
          }
        }).catch(data => {
          Logger.error(data);
          let error = errorCodes[500];
          error.error = data;
          return reply.response(error).code(500);
        });
      }
    }
  },
};
