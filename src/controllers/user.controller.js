const {
  searchUser,
  updateUser,
  getUsers,
  getUserInfo,
  follow,
  unFollow,
  followingsUser,
} = require("../services/user.service");
const { OK, SuccessResonse } = require("../core/success.response");

class UserController {
  getList = async (req, res, next) => {
    new SuccessResonse({
      message: "Get all user successfully",
      metadata: await getUsers(req),
    }).send(res);
  };

  getFollowUser = async (req, res, next) => {
    new SuccessResonse({
      message: "Get followings user successfully",
      metadata: await followingsUser(req),
    }).send(res);
  };
  
  search = async (req, res, next) => {
    new SuccessResonse({
      message: "Search user successfully",
      metadata: await searchUser(req),
    }).send(res);
  };

  update = async (req, res, next) => {
    new SuccessResonse({
      message: "Update user successfully",
      metadata: await updateUser(req),
    }).send(res);
  };

  getInfo = async (req, res, next) => {
    new SuccessResonse({
      message: "Get user info successfully",
      metadata: await getUserInfo(req),
    }).send(res);
  };

  follow = async (req, res, next) => {
    new SuccessResonse({
      message: "Follow user successfully",
      metadata: await follow(req),
    }).send(res);
  };

  unFollow = async (req, res, next) => {
    new SuccessResonse({
      message: "Unfollow user successfully",
      metadata: await unFollow(req),
    }).send(res);
  };
}

module.exports = new UserController();
