const { searchUser } = require("../services/user.service");
const { OK } = require("../core/success.response");

class UserController {
  search = async (req, res, next) => {
    new OK({
      message: "Search user successfully",
      metadata: await searchUser(req),
    }).send(res);
  };
}

module.exports = new UserController();
