class IndulgeBaseException extends global.Error {
  name = "Base Exception";
  errors = [];
  thrownBy = process.env.APP_NAME || "Indulge Server";
  critical = false;
  message = "No message provided";
  code = 500;

  constructor({ name, errors, thrownBy, critical, message, code }) {
    super();
    if (critical) this.critical = critical;
    if (thrownBy) this.thrownBy = thrownBy;
    if (errors) this.errors = errors;
    if (name) this.name = name;
    if (message) this.message = message;
    if (code) this.code = code;
  }
}

module.exports = IndulgeBaseException;
