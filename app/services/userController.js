const express = require("express");
const Error = require("../../util/error");
const mysqlClient = require("../../mysql/client");
const authorize = require("../../interceptors/auth");
const userRouter = express.Router();


var userModule = {
  get(req, res, next) {
    if (typeof req.headers["auth"] == "undefined")
      res.status(200).json({ message: "Success" });
    else next(new Error(Error.Code.DATABASE_ERROR, undefined, 400));
  },

  getAuth(req, res, next) {
    res.status(200).json({ message: "Success" });
  },
};


userRouter.post("/authentication", userModule.getAuth);
userRouter.get("/auth", authorize([1]), userModule.get);

module.exports = userRouter;
