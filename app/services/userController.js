const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Error = require("../../util/error");
const message = require("../../util/messages.json");
const statusDetails = require("../../util/status.json");
const mysqlClient = require("../../mysql/client");
const authorize = require("../../interceptors/auth");
const userRouter = express.Router();

var userModule = {
  get(req, res, next) {
    if (typeof req.headers["auth"] == "undefined")
      res
        .status(statusDetails["response.success"].code)
        .json({ message: message.success });
    else next(new Error(Error.Code.DATABASE_ERROR, undefined, 400));
  },

  getAuth(req, res, next) {
    if (req.body.email != undefined) {
      if (req.body.password != undefined) {
        let query = "SELECT * FROM users WHERE email = ?";
        mysqlClient.executeWithData(
          query,
          [req.body.email],
          (err, result = []) => {
            if (err) {
              next(new Error(Error.Code.DATABASE_ERROR, err, 400));
            } else if (result == null || result.length === 0) {
              next(
                new Error(
                  message["user.not.found"],
                  err,
                  statusDetails["client.not.found"].code
                )
              );
            } else {
              valiedPassword(
                req.body.password,
                result[0].Password,
                (isValid) => {
                  const validPass = isValid;
                  if (!validPass) {
                    next(
                      new Error(
                        message["user.incorrect.credentials"],
                        err,
                        statusDetails["client.unauthorized"].code
                      )
                    );
                  } else {
                    let token = jwt.sign(
                      { id: result[0].UserId, Name: result[0].FirstName },
                      "Test",
                      {
                        expiresIn: 253402300000000,
                      }
                    );
                    const tokenData = JSON.parse(JSON.stringify(token));
                    res
                      .status(statusDetails["response.success"].code)
                      .json({ message: message.success, result: tokenData });
                  }
                }
              );
            }
          }
        );
      } else {
        next(
          new Error(
            statusDetails["client.bad.request"].message,
            undefined,
            statusDetails["client.bad.request"].code
          )
        );
      }
    } else {
      next(
        new Error(
          statusDetails["client.bad.request"].message,
          undefined,
          statusDetails["client.bad.request"].code
        )
      );
    }
    // res
    //   .status(statusDetails["response.success"].code)
    //   .json({ message: message.success });
  },
};

var valiedPassword = function (password, userPassword, callback) {
  try {
    const validPass = bcrypt
      .compare(password, userPassword)
      .then(callback(validPass));
  } catch (err) {
    callback(false);
  }
};

userRouter.post("/authentication", userModule.getAuth);
userRouter.get("/auth", authorize([1]), userModule.get);

module.exports = userRouter;
