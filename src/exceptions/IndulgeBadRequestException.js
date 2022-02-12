const { BAD_REQUEST } = require("../../config/constants/http.config");
const IndulgeBaseException = require("../core/IndulgeBaseException");

class IndulgeBadRequestException extends IndulgeBaseException {
  constructor({ errors, message, name, critical }) {
    super({
      message: message || "Bad request exception",
      errors: errors || [],
      name: name || "Bad request",
      critical: critical || true,
      code: BAD_REQUEST,
    });
  }
}

module.exports = IndulgeBadRequestException;
