const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const verify = require("./verifyToken");

router.post("/signup", async (req, res) => {
  const { name, email, password, pic } = req.body;
  if (!email || !password || !name) {
    return res
      .status(400)
      .json({ error: "Please provide all the Required fields " });
  }

  const emailExist = await User.findOne({ email });
  if (emailExist) {
    res.status(400).send("Email already exists");
  }

  const salt = await bcrypt.genSalt(10);
  const hashPswrd = await bcrypt.hash(password, salt);

  const user = new User({ name, email, password: hashPswrd });

  try {
    const savedUser = await user.save();
    res.send(savedUser);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send({ error: "Email Or Password is missing" });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res
      .status(400)
      .send({ error: "Email Doesnot Exist", status: false });
  }
  const validPass = await bcrypt.compare(password, user.password);
  if (!validPass) {
    res
      .status(400)
      .send({ error: "Email Or Password is Invalid", status: false });
  }

  //Generating JWT Token
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET , { expiresIn : "1h"});
  const { _id, name } = user;
  res.send({ token, success: true, user: { _id, name, email } });
});

router.get("/private", verify, (req, res) => {
  res.send("private Route access  " + JSON.stringify(req.user));
});
router.get("/test", (req, res) => {
  res.send({ success: true, message: "Test route" });
});

module.exports = router;
