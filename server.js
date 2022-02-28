const invitationModel = require("./src/models/invitation.model");

(async function (port, callback) {
  const { join } = require("path");
  const express = require("express");
  const mongoose = require("mongoose");
  const morgan = require("morgan");
  const cors = require("cors");
  const debug = require("debug")("server");
  const debug_database = require("debug")("mongoDB");
  const hr = require("./src/models/hr.model");
  const app = express();

  const PORT = port || process.env.PORT || 8080;
  const appName = process.env.APP_NAME || "Indulge Backend";
  const api = process.env.API_RELATIVE || "/api/v1";
  const dbUrl =
    process.env.DB_URL || "mongodb://localhost:27017/indulge-backend-1";

  mongoose.connect(dbUrl, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });

  const db = mongoose.connection;
  db.on("error", console.error.bind(console, "connection error:"));
  db.once("open", () => {
    debug_database("Database connected");
  });

  debug("Booting %s", appName);

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(morgan("dev"));

  app.use(`${api}`, require("./src/routes/index"));

  app.listen(PORT, () => debug("Server is running at %s", PORT));
})();
