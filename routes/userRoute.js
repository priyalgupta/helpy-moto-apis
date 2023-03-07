const express = require("express");
const {
  getAllUsers,
  deleteSingleUser,
  updateSingleUser,
  getSingleUser,
  signupUser,
  logIn,
  getLoggedinUserDetails,
  logOut,
  forgotPassword,
  resetPassword,
} = require("../controllers/userController");
const { isLoggedIn, customRole } = require("../middlewares/user");

const router = express.Router();

router.route("/user/signup").post(signupUser);
router.route("/user/login").post(logIn);
router.route("/user/logout").get(logOut);
router.route("/user/forgotpassword").post(forgotPassword);
router.route("/user/password/reset/:token").post(resetPassword);
// router.route("/password/update").post(isLoggedIn, changePasswordHandler);
router.route("/userdashboard").get(isLoggedIn, getLoggedinUserDetails);
router.route("/user/:id").get(isLoggedIn, getSingleUser);
router.route("/user/update/:id").put(updateSingleUser);
router.route("/user/delete/:id").delete(deleteSingleUser);

////////////////////////////////////////////////////////////////////

// router
//   .route("/admin/user/create")
//   .post(isLoggedIn, customRole("admin"), createUser);
// router
//   .route("/admin/user/:id")
//   .get(isLoggedIn, customRole("admin"), getSingleUser);
// router
//   .route("/admin/user/update/:id")
//   .put(isLoggedIn, customRole("admin"), updateSingleUser);
// router
//   .route("/admin/user/delete/:id")
//   .delete(isLoggedIn, customRole("admin"), deleteSingleUser);
// router.route("/admin/users").get(isLoggedIn, customRole("admin"), getAllUsers);
////////////////////////////////////////////////////////////////////

// Admin only routes
// router.route("/admin/tickets").get(isLoggedIn, adminGetAllTickets);
// router
//   .route("/admin/ticket/update/:id")
//   .put(isLoggedIn, customRole("admin"), adminUpdateATicket);
// router
//   .route("/admin/ticket/delete/:id")
//   .delete(isLoggedIn, customRole("admin"), adminDeleetATicket);

module.exports = router;
