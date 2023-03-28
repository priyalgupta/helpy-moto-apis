const express = require("express");
const {
  getSingleMechanic,
  deleteSingleMechanic,
  updateSingleMechanic,
  getAllMechanics,
  signupMechanic,
  loginMechanic,
  logoutMechanic,
  getLoggedinMechanicDetails,
  resetMechanicPassword,
  forgotMechanicPassword,
  signupMechanicWithOTP,
  loginMechanicWithOTP,
  signMechanicWithOTP,
} = require("../controllers/mechanicController");
const { isMechanicLoggedIn } = require("../middlewares/mechanicUser");

const router = express.Router();

router.route("/mechanic/otpsign").post(signMechanicWithOTP);
router.route("/mechanic/signup").post(signupMechanic);
// router.route("/mechanic/otpsignup").post(signupMechanicWithOTP);
router.route("/mechanic/login").post(loginMechanic);
// router.route("/mechanic/otplogin").post(loginMechanicWithOTP);
router.route("/mechanic/logout").get(logoutMechanic);
router.route("/mechanic/forgotpassword").post(forgotMechanicPassword);
router.route("/mechanic/password/reset/:token").post(resetMechanicPassword);
router.route("/mechanicdashboard").get(isMechanicLoggedIn, getLoggedinMechanicDetails);
router.route("/mechanic/update/:id").put(isMechanicLoggedIn, updateSingleMechanic);
router.route("/mechanic/delete/:id").delete(isMechanicLoggedIn, deleteSingleMechanic);
router.route("/mechanic/:id").get(isMechanicLoggedIn, getSingleMechanic);
router.route("/mechanics").get(getAllMechanics);

module.exports = router;
