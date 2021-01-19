const UserRepo = require("../repositories/UserRepo");
const BlacklistTokenRepo = require("../repositories/BlackListTokenRepo");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

class AuthService {
  //register user
  static signup = async (req, res) => {
    const { name, email, password } = req.body;
    if (!email || !password || !name) {
      return res
        .status(400)
        .json({ error: "Please provide all the Required fields " });
    }
    console.log("signup service called");

    const emailExist = await UserRepo.findByEmail(email);
    if (emailExist) {
      return res.status(400).send("Email already exists");
    }
    const salt = await bcrypt.genSalt(10);
    const hashPswrd = await bcrypt.hash(password, salt);

    try {
      const savedUser = await UserRepo.createUser({
        name,
        email,
        password: hashPswrd,
      });
      return res.send(savedUser);
    } catch (e) {
      return res.status(400).send(e);
    }
  };

  //Sign in user and response with jwt token
  static signin = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send({ error: "Email Or Password is missing" });
    }
    console.log("sign in service");

    const user = await UserRepo.findByEmail(email);
    if (!user) {
      return res
        .status(400)
        .send({ error: "Email Doesnot Exist", status: false });
    }
    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) {
      return res
        .status(400)
        .send({ error: "Email Or Password is Invalid", status: false });
    }

    const token = await generateToken(user._id);
    const { _id, name } = user;
    res.send({ token, success: true, user: { _id, name, email } });
  };

  static logout = async (req, res) => {
    const token = req.header("auth-token");
    const blToken = BlacklistTokenRepo.createblToken({
      token,
      postedBy: req.user,
    });
    res.send("Logout Success");
  };
}

module.exports = AuthService;

const generateToken = async (userId) => {
  return await jwt.sign({ _id: userId }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
};
