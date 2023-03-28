const express = require("express");
const {
  deleteSingleUser,
  updateSingleUser,
  getSingleUser,
  signupUser,
  logIn,
  getLoggedinUserDetails,
  logOut,
  resetUserPassword,
  forgotUserPassword,
  signUserWithOTP,
  allUsers,
} = require("../controllers/userController");
const { isLoggedIn } = require("../middlewares/user");

const router = express.Router();

router.route("/user/alluser").get(allUsers);
router.route("/user/otpsign").post(signUserWithOTP);
router.route("/user/signup").post(signupUser);
router.route("/user/login").post(logIn);
router.route("/user/logout").get(logOut);
router.route("/user/forgotpassword").post(forgotUserPassword);
router.route("/user/password/reset/:token").post(resetUserPassword);
router.route("/userdashboard").get(isLoggedIn, getLoggedinUserDetails);
router.route("/user/update/:id").put(isLoggedIn, updateSingleUser);
router.route("/user/delete/:id").put(isLoggedIn, deleteSingleUser);
router.route("/user/:id").get(isLoggedIn, getSingleUser);

module.exports = router;