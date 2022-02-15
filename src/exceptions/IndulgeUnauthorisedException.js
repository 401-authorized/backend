const { UNAUTHORIZED } = require("../../config/constants/http.config");
const IndulgeBaseException = require("../core/IndulgeBaseException");

class IndulgeUnauthorisedException extends IndulgeBaseException {
  constructor({ message, name, thrownBy, critical }) {
    super({
      message: message || "This user is unauthorised to access this route",
      code: UNAUTHORIZED,
      thrownBy: thrownBy || "Authentication handler",
      critical: critical || true,
      name: name || "Authentication error",
    });
  }
}

module.exports = IndulgeUnauthorisedException;
