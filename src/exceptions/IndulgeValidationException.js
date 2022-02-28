const { BAD_REQUEST } = require("../../config/constants/http.config");
const IndulgeBaseException = require("../core/IndulgeBaseException");

class IndulgeValidationException extends IndulgeBaseException {
  constructor({ message, name, errors }) {
    super({
      message: message || "Some validation error occurred.",
      name: name || "Validation error",
      code: BAD_REQUEST,
      errors: errors || [],
    });
  }
}

module.exports = IndulgeValidationException;
