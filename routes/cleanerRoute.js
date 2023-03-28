const express = require("express");

const {
  signupCleaner,
  loginCleaner,
  logoutCleaner,
  getSingleCleaner,
  updateSingleCleaner,
  deleteSingleCleaner,
  getLoggedinCleanerDetails,
  getAllCleaners,
  resetCleanerPassword,
  forgotCleanerPassword,
  signupCleanerWithOTP,
  loginCleanerWithOTP,
  signCleanerWithOTP,
} = require("../controllers/cleanerController");
const { isCleanerLoggedIn } = require("../middlewares/cleanerUser");

const router = express.Router();

router.route("/cleaner/otpsign").post(signCleanerWithOTP);
router.route("/cleaner/signup").post(signupCleaner);
// router.route("/cleaner/otpsignup").post(signupCleanerWithOTP);
router.route("/cleaner/login").post(loginCleaner);
// router.route("/cleaner/otplogin").post(loginCleanerWithOTP);
router.route("/cleaner/logout").get(logoutCleaner);
router.route("/cleaner/forgotpassword").post(forgotCleanerPassword);
router.route("/cleaner/password/reset/:token").post(resetCleanerPassword);
router.route("/cleanerdashboard").get(isCleanerLoggedIn, getLoggedinCleanerDetails);
router.route("/cleaner/update/:id").put(isCleanerLoggedIn, updateSingleCleaner);
router.route("/cleaner/delete/:id").delete(isCleanerLoggedIn, deleteSingleCleaner);
router.route("/cleaner/:id").get(isCleanerLoggedIn, getSingleCleaner);
router.route("/cleaners").get(getAllCleaners);

module.exports = router;
