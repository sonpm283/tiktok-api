const AccessService = require("../services/access.service");
const { CREATED, SuccessResonse } = require("../core/success.response");

class AccessController {
  logout = async (req, res, next) => {
    new SuccessResonse({
      message: "Logout successfully",
      metadata: await AccessService.logout(req.keyStore),
    }).send(res);
  };
  login = async (req, res, next) => {
    new SuccessResonse({
      message: "Login successfully",
      metadata: await AccessService.login(req.body),
    }).send(res);
  };
  signUp = async (req, res, next) => {
    new CREATED({
      message: "User created successfully",
      metadata: await AccessService.signUp(req.body),
      options: { limit: 10 }, // for example
    }).send(res);
  };
}

module.exports = new AccessController();
