const http = require("http");
const express = require("express");
const cookieParser = require("cookie-parser");
require("dotenv").config({ path: `${process.env.NODE_ENV}.env` });
const logger = require("./util/logger");
const env = process.env;
const app = express();

const httpServer = http.createServer(app);
httpServer.listen(env.APP_SERVER_PORT, () =>
  logger.info(
    `${env.APP_NAME} started on ${env.APP_SERVER_PORT} and ${env.APP_RUNNING_PROFILE} environment!`
  )
); // app listen

app.use(cookieParser());
app.use(express.json({limit: '50mb'}));
app.use((req, res, next) => {
  if(typeof req.headers['request-from'] != 'undefined' && req.headers['request-from'] === 'ADMIN')
    res.header("Access-Control-Allow-Origin", env.ADMIN_ORIGIN);
  else
    res.header("Access-Control-Allow-Origin", env.USER_ORIGIN);
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Request-Id, Is-Admin");
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Methods", "POST, GET, PUT, OPTIONS, DELETE");
  res.header("Access-Control-Max-Age", 86400);
  next();
}); // add cors header

app.get("/stop", (req, res) => {
  logger.info("Stoping the server!!");
  res.json({ message: "Stoped the server" });
  process.exit(1);
}); // Server Termination End point

// app.use(require("./headers.request")); // headers processing

app.use("/api",require("./app/router")); // app routes

app.use((err, req, res, next) => {
  if (
    typeof err.error === "object" &&
    typeof err.error.message === "string" &&
    typeof err.error.code === "string"
  ) {
    err.message = err.error.message;
    err.error = err.error.code;
  } else {
    err.message = err.error;
    err.error = "UNEXPECTED_ERROR";
  }
  logger.debug(`Responsed Error '${err.message}'`);
  let statusCode = err.statusCode || 500;
  delete err.statusCode;
  return res.status(statusCode).json(err);
}); // error handler