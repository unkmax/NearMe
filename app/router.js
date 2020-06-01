const express = require("express");

const userController = require("./services/userController");

/** App router */
const router = express.Router();

/** User router */
router.use("/user", userController);

/** All other */
router.all("/**", function (req, res) {
  res.status(404).json({ error: "page not found" });
}); //page not found

module.exports = router;
