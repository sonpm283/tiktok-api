const {
  searchUser,
  updateUser,
  getUsers,
  getUserInfo,
} = require("../services/user.service");
const { OK } = require("../core/success.response");

class UserController {
  getList = async (req, res, next) => {
    new OK({
      message: "Get all user successfully",
      metadata: await getUsers(req),
    }).send(res);
  };

  search = async (req, res, next) => {
    new OK({
      message: "Search user successfully",
      metadata: await searchUser(req),
    }).send(res);
  };

  update = async (req, res, next) => {
    new OK({
      message: "Update user successfully",
      metadata: await updateUser(req),
    }).send(res);
  };

  getInfo = async (req, res, next) => {
    new OK({
      message: "Get user info successfully",
      metadata: await getUserInfo(req),
    }).send(res);
  };
}

module.exports = new UserController();
