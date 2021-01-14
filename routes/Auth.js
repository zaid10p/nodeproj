const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = require("../models/User");
const BlacklistToken = require("../models/BlacklistToken");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const verify = require("./verifyToken");
const { v4: uuidv4 } = require("uuid");

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

  const token = await generateToken(user._id);
  const { _id, name } = user;
  res.send({ token, success: true, user: { _id, name, email } });
});

router.post("/logout", verify, async (req, res) => {
  const token = req.header("auth-token");
  const blToken = new BlacklistToken({ token, postedBy: req.user });
  const result = await blToken.save();
  res.send("Logout Success");
});

router.get("/test", (req, res) => {
  res.send({ success: true, message: "Test route" });
});

module.exports = router;

const generateToken = async (userId) => {
  const token = await jwt.sign({ _id: userId }, process.env.JWT_SECRET, {
    expiresIn: "1h",
    jwtid: uuidv4(),
    subject: userId.toString(),
  });

  return token;
};
