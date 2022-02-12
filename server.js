(async function (port, callback) {
  const { join } = require("path");
  const express = require("express");
  const morgan = require("morgan");
  const cors = require("cors");
  const debug = require("debug")("server");

  const app = express();

  const PORT = port || process.env.PORT || 8080;
  const appName = process.env.APP_NAME || "Indulge Backend";
  const api = process.env.API_RELATIVE || "/api/v1";

  debug("Booting %s", appName);

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(morgan("dev"));

  app.get("/", (req, res) => {
    res.send(["HUH?"]);
  });

  app.listen(PORT, () => debug("Server is running at %s", PORT));
})();
