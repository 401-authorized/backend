const invitationModel = require("./src/models/invitation.model");

(async function (port, callback) {
  const { join } = require("path");
  const express = require("express");
  const mongoose = require("mongoose");
  const morgan = require("morgan");
  const cors = require("cors");
  const debug = require("debug")("server");
  const debug_database = require("debug")("mongoDB");

  const app = express();

  const PORT = port || process.env.PORT || 8080;
  const appName = process.env.APP_NAME || "Indulge Backend";
  const api = process.env.API_RELATIVE || "/api/v1";

  const hrRoutes=require('./src/routes/hr.route');
  const invitationRoutes=require('./src/routes/invitation.route');
  const infRoutes=require('./src/routes/inf.route');
  const dbUrl =
    process.env.DB_URL || "mongodb://localhost:27017/indulge-backend-1";

  mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
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

  app.use("/hr", hrRoutes);
  app.use("/inf", infRoutes);
  app.use("/invitation", invitationRoutes);
  app.get("/", (req, res) => {
    res.send(["HUH?"]);
  });

  app.listen(PORT, () => debug("Server is running at %s", PORT));
})();
