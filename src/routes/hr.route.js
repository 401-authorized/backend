const { getAllHr } = require("../controllers/hr.controller");

const router = require("express").Router();

router.get("/", getAllHr);
