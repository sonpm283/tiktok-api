const { SuccessResonse } = require("../core/success.response");
const UploadService = require("../services/upload.service");

class UploadController {
  upload = async (req, res, next) => {
    new SuccessResonse({
      message: "Upload successfully",
      metadata: await UploadService.upload(req),
    }).send(res);
  };
}

module.exports = new UploadController();
