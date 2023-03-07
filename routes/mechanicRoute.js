const express = require("express");
const {
  getSingleMechanic,
  deleteSingleMechanic,
  updateSingleMechanic,
  getAllMechanics,
  signupMechanic,
  loginMechanic,
  logoutMechanic,
  resetPassword,
  forgotPassword,
} = require("../controllers/mechanicController");
const { isLoggedIn } = require("../middlewares/mechanicUser");

const router = express.Router();

router.route("/mechanic/signup").post(signupMechanic);
router.route("/mechanic/login").post(loginMechanic);
router.route("/mechanic/logout").post(logoutMechanic);
// router.route("/ticket/create").post(isLoggedIn, createTicket);
router.route("/mechanic/forgotpassword").post(forgotPassword);
router.route("/mechanic/password/reset/:token").post(resetPassword);
router.route("/mechanic/:id").get(getSingleMechanic);
// router.route("/ticket/:id").get(isLoggedIn, getSingleTicket);
router.route("/mechanic/update/:id").put(updateSingleMechanic);
// router.route("/ticket/update/:id").put(isLoggedIn, updateSingleTicket);
router.route("/mechanic/delete/:id").delete(deleteSingleMechanic);
// router.route("/ticket/delete/:id").delete(isLoggedIn, deleteSingleTicket);
router.route("/mechanics").get(getAllMechanics);

// Admin only routes
// router.route("/admin/tickets").get(isLoggedIn, adminGetAllTickets);
// router
//   .route("/admin/ticket/update/:id")
//   .put(isLoggedIn, customRole("admin"), adminUpdateATicket);
// router
//   .route("/admin/ticket/delete/:id")
//   .delete(isLoggedIn, customRole("admin"), adminDeleetATicket);

module.exports = router;
