const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Admin = require("../models/admin.model");
const Hr = require("../models/hr.model");
const IndulgeUnauthorisedException = require("../exceptions/indulgeUnauthorisedException");
const IndulgeBaseException = require("../core/IndulgeBaseException");
const IndulgeBadRequestException = require("../exceptions/IndulgeBadRequestException");
const IndulgeExceptionHandler = require("../core/IndulgeExceptionHandler");
const Invitation = require("../models/invitation.model");
const typeMapping = (user) => {
  try {
    if (user instanceof Admin) return "admin";
    else return "hr";
  } catch (err) {
    throw new IndulgeBaseException(err);
  }
};

const isAuthenticated = (req) => {
  try {
    if (req) {
      if (req.user) return true;
      else return false;
    } else {
      throw new IndulgeUnauthorisedException("Not an instance of User");
    }
  } catch (err) {
    throw new IndulgeBaseException(err);
  }
};

const hash = async (password) => {
  try {
    return await bcrypt.hash(
      password,
      parseInt(process.env.PASSWORD_SALT) || 10
    );
  } catch (err) {
    throw new IndulgeBaseException(err);
  }
};

const verifyHash = async (password, hash) => {
  try {
    return await bcrypt.compare(password, hash);
  } catch (err) {
    throw new IndulgeBaseException(err);
  }
};

const generateJWT = (user) => {
  try {
    return jwt.sign(
      {
        id: user._id,
        email: user.email,
        typ: typeMapping(user),
        adm: user instanceof Admin ? true : false,
      },
      process.env.SECRET_KEY || "secret",
      { expiresIn: process.env.JWT_VALIDITY || "30d" }
    );
  } catch (err) {
    throw new IndulgeBaseException(err);
  }
};

const generateEmailCode = (user, type) => {
  try {
    return jwt.sign(
      {
        ema: user.email,
        typ: type,
      },
      process.env.EMAIL_SECRET || "email",
      { expiresIn: "1000d" }
    );
  } catch (err) {
    throw new IndulgeBaseException(err);
  }
};

const generateResetToken = (user) => {
  try {
    return jwt.sign(
      {
        ema: user.email,
        typ: typeMapping(user),
      },
      process.env.PASSWORD_RESET_SECRET || "password",
      { expiresIn: "1000d" }
    );
  } catch (err) {
    throw new IndulgeBaseException(err);
  }
};

const verifyJWT = (token) => {
  try {
    return jwt.verify(token, process.env.SECRET_KEY || "secret");
  } catch (err) {
    throw new IndulgeBaseException(err);
  }
};

const verifyPasswordResetToken = (token) => {
  try {
    return jwt.verify(token, process.env.PASSWORD_RESET_SECRET || "password");
  } catch (err) {
    throw new IndulgeBaseException(err);
  }
};

const authenticate = async function (req, res, next) {
  try {
    let token = req.get("Authorization") || req.get("Authorisation");
    if (!token || (typeof token === "string" && token.length === 0)) {
      throw new IndulgeUnauthorisedException("No token provided");
    }
    token = token.replace("Bearer ", "");
    let decoded, user;
    try {
      decoded = verifyJWT(token);
    } catch (err) {
      throw new IndulgeBadRequestException({ message: "Invalid JWT supplied" });
    }
    if (decoded.adm) {
      user = await Admin.findById(decoded.id);
      req.role = "admin";
    } else {
      user = await Hr.findById(decoded.id);
      req.role = "hr";
    }
    if (!user) {
      req.role = undefined;
      delete req.role;
      throw new IndulgeUnauthorisedException({ message: "User not found!" });
    }
    req.user = user;
    if (req.user && req.role) {
      next();
    } else {
      throw new IndulgeUnauthorisedException({
        message: "Unauthorized because of credential error or server error",
      });
    }
  } catch (err) {
    if (!(err instanceof Error)) err = new IndulgeUnauthorisedException({});
    err = IndulgeExceptionHandler(err);
    res.status(err.code).json(err);
  }
};

const verifyAdmin = async (req, res, next) => {
  if (req.role === "admin") {
    next();
  } else {
    res.status(401).json({
      message: "Unauthorized User",
    });
  }
};

const verifyInvitation = async (req, res, next) => {
  try {
    let { hash } = req.params;
    if (!hash) hash = req.body.hash;
    const curInvitation = await Invitation.findOne({ token: hash });
    if (curInvitation) {
      let { token } = curInvitation;
      let decoded;
      try {
        decoded = verifyJWT(token);
      } catch (err) {
        throw new IndulgeBadRequestException({ message: "Invitation Expired" });
      }
    } else {
      throw new IndulgeBadRequestException({ message: "Invitation not found" });
    }
    next();
  } catch (err) {
    console.log(err);
    const e = new IndulgeExceptionHandler(err);
    res.status(e.code).send(err);
  }
};
// const isHr
module.exports = {
  hash,
  verifyHash,
  generateJWT,
  generateEmailCode,
  generateResetToken,
  verifyJWT,
  verifyPasswordResetToken,
  authenticate,
  verifyAdmin,
  typeMapping,
  verifyInvitation,
};
