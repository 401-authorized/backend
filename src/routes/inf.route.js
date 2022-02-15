const router = require("express").Router();
const { QueryBuilder } = require("../helpers/query-builder.class");
const InfModel = require("../models/inf.model");

// Example use case for QUeryBuilder class for using sort, limit, filter and paginate
router.get("/", async (req, res) => {
  const queryBuilder = new QueryBuilder(InfModel.find(), req.query);
  const infs = await queryBuilder.execAll().query;
  res.json(infs);
});

module.exports = router;
