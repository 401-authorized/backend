const router = require("express").Router();
const infRouter = require("./inf.route");
const oauthRouter = require("./oauth.route");

router.use("/inf", infRouter);
router.use("/oauth", oauthRouter);

module.exports = router;
