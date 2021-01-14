const jwt = require("jsonwebtoken");
const BlacklistToken = require("../models/BlacklistToken");
const User = require("../models/User");

module.exports = async function (req, res, next) {
  const token = req.header("auth-token");

  if (!token) {
    res
      .status(401)
      .send({ status: false, error: "No Token provided in Header" });
    return false;
  }
  const exist = await BlacklistToken.findOne({ token });
  if (exist) {
    res.send({
      status: false,
      error: "Token is Unauthorized. Generate new token",
    });
    return false;
  }

  try {
    const verify = jwt.verify(token, process.env.JWT_SECRET);
    User.findById(verify._id).then((user) => {
      req.user = user;
      next();
    });
  } catch (e) {
    res.status(401).send({ status: false, error: JSON.stringify(e) });
    return false;
  }
};
