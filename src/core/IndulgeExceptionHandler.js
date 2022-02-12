const IndulgeInternalServerException = require("../exceptions/IndulgeInternalServerException");
const IndulgeBaseException = require("./IndulgeBaseException");

function IndulgeExceptionHandler(E) {
  if (!E || !(E instanceof Error)) {
    throw new IndulgeInternalServerException({
      message: "Invalid exception",
      critical: true,
    });
  }

  if (E instanceof IndulgeBaseException) return E;
  else if (E instanceof Error) {
    reutrn(
      new IndulgeBaseException({
        name: E.name,
        message: E.message,
        errors: [E],
        critical: true,
        thrownBy: E.stack,
      })
    );
  }
}

module.exports = IndulgeExceptionHandler;
