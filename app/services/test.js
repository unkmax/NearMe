const Error = require("../../util/error");

const mysqlClient = require("../../mysql/client");

module.exports = {
  get(req, res, next) {
    if (typeof req.headers["auth"] == "undefined")
      res.status(200).json({ message: "Success" });
    else next(new Error(Error.Code.DATABASE_ERROR, undefined, 400));
  },

  getAuth(req, res, next) {
    res.status(200).json({ message: "Success" });
  },
};
