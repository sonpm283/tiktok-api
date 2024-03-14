"use strict";

// generate router
const express = require("express");
const accessController = require("../../controllers/access.controller");
const { asyncHandler } = require("../../helpers/anyncHandler");
const { authentication } = require("../../auth/authUtils");
const router = express.Router();

//signup
router.post("/user/signup", asyncHandler(accessController.signUp));
router.post("/user/login", asyncHandler(accessController.login));

//authentication
router.use(authentication);

//logout
// sau khi chạy qua authentication middleware thì mới vào được api này
router.post("/user/logout", asyncHandler(accessController.logout));

module.exports = router;
