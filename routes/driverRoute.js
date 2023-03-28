const express = require("express");
const {
  signupDriver,
  loginDriver,
  logoutDriver,
  getSingleDriver,
  updateSingleDriver,
  deleteSingleDriver,
  getAllDriver,
  getLoggedinDriverDetails,
  resetDriverPassword,
  forgotDriverPassword,
  signupDriverWithOTP,
  loginDriverWithOTP,
  signDriverWithOTP,
} = require("../controllers/driverController");

const { isDriverLoggedIn } = require("../middlewares/driverUser");

const router = express.Router();

router.route("/driver/otpsign").post(signDriverWithOTP);
router.route("/driver/signup").post(signupDriver);
// router.route("/driver/otpsignup").post(signupDriverWithOTP);
router.route("/driver/login").post(loginDriver);
// router.route("/driver/otplogin").post(loginDriverWithOTP);
router.route("/driver/logout").get(logoutDriver);
router.route("/driver/forgotpassword").post(forgotDriverPassword);
router.route("/driver/password/reset/:token").post(resetDriverPassword);
router.route("/driverdashboard").get(isDriverLoggedIn, getLoggedinDriverDetails);
router.route("/driver/update/:id").put(isDriverLoggedIn, updateSingleDriver);
router.route("/driver/delete/:id").delete(isDriverLoggedIn, deleteSingleDriver);
router.route("/driver/:id").get(isDriverLoggedIn, getSingleDriver);
router.route("/drivers").get(getAllDriver);

module.exports = router;
