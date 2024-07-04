const Router = require("express");
const testRouter = new Router();
const auth = require("../middleware/auth");

testRouter.get("/check", auth, (req, res) => {
  try {
    res.status(200).json("Hello, world!");
  } catch (err) {
    console.error(err);
  }
});

module.exports = testRouter;
