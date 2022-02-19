const router = require("express").Router();
const infRouter = require("./inf.route");
const oauthRouter = require("./oauth.route");
const mailRouter = require("./mail.route");
router.use("/inf", infRouter);
router.use("/oauth", oauthRouter);
router.use("/mail", mailRouter);

module.exports = router;
