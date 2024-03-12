const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "dgpwaokug",
  api_key: "234125276922972",
  api_secret: "8TKTPsN4MgHbU7EG9vkgXdRveAc",
});

module.exports = cloudinary;
