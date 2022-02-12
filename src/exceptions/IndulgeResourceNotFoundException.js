const { NOT_FOUND } = require("../../config/constants/http.config");
const IndulgeBaseException = require("../core/IndulgeBaseException");

class IndulgeResourceNotFoundException extends IndulgeBaseException {
  constructor(resourceName) {
    super({
      message: "The requested resource " + resourceName + " was not found.",
      code: NOT_FOUND,
      name: "Resource not found",
      critical: false,
    });
  }
}

module.exports = IndulgeResourceNotFoundException;
