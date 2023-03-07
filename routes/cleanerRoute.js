const express = require("express");

const {
  signupCleaner,
  loginCleaner,
  logoutCleaner,
  getSingleCleaner,
  updateSingleCleaner,
  deleteSingleCleaner,
  forgotPassword,
  resetPassword,
  getAllCleaner,
} = require("../controllers/cleanerController");
const { isLoggedIn } = require("../middlewares/cleanerUser");

const router = express.Router();

router.route("/cleaner/signup").post(signupCleaner);
router.route("/cleaner/login").post(loginCleaner);
router.route("/cleaner/logout").post(logoutCleaner);
// router.route("/ticket/create").post(isLoggedIn, createTicket);
router.route("/cleaner/forgotpassword").post(forgotPassword);
router.route("/cleaner/password/reset/:token").post(resetPassword);
router.route("/cleaner").get(getLoggedinUserDetails);
router.route("/cleaner/:id").get(getSingleCleaner);
// router.route("/ticket/:id").get(isLoggedIn, getSingleTicket);
router.route("/cleaner/update/:id").put(updateSingleCleaner);
// router.route("/ticket/update/:id").put(isLoggedIn, updateSingleTicket);
router.route("/cleaner/delete/:id").delete(deleteSingleCleaner);
// router.route("/ticket/delete/:id").delete(isLoggedIn, deleteSingleTicket);
router.route("/cleaners").get(getAllCleaner);

module.exports = router;
