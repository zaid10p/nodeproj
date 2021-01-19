const express = require("express");
const router = express.Router();
const verify = require("./verifyToken");
const AuthService = require("../services/AuthService");

router.post("/signup", async (req, res) => {
  return AuthService.signup(req, res);
});

router.post("/signin", async (req, res) => {
  return AuthService.signin(req, res);
});

router.post("/logout", verify, async (req, res) => {
  AuthService.logout(req, res);
});

router.get("/test", (req, res) => {
  res.send({ success: true, message: "Test route" });
});

module.exports = router;
