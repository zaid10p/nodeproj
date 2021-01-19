const User = require("../models/User");

class UserRepo {

    static findByEmail = async (email) => {
        return await User.findOne({ email });
    }

    static createUser = async (UserInfo) => {
        const {name , email , password} = UserInfo;
        const user = new User({ name, email, password });
        return await user.save();
    }
}

module.exports = UserRepo;