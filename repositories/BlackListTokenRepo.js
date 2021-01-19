const BlacklistToken = require("../models/BlacklistToken");

class BlacklistTokenRepo {
  static createblToken = async ({ token, postedBy }) => {
    const blToken = new BlacklistToken({ token, postedBy });
    return await blToken.save();
  };
}

module.exports = BlacklistTokenRepo;
