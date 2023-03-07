const express = require("express");

const { isLoggedIn } = require("../middlewares/driverUser");
const { 
    signupDriver, 
    loginDriver, 
    logoutDriver, 
    resetPassword,
    forgotPassword,
    getSingleDriver, 
    updateSingleDriver, 
    deleteSingleDriver, 
    getAllDriver 
} = require("../controllers/driverController");

const router = express.Router();

router.route("/driver/signup").post(signupDriver);
router.route("/driver/login").post(loginDriver);
router.route("/driver/logout").post(logoutDriver);
// router.route("/ticket/create").post(isLoggedIn, createTicket);
router.route("/driver/forgotpassword").post(forgotPassword);
router.route("/driver/password/reset/:token").post(resetPassword);
router.route("/driver/:id").get(getSingleDriver);
// router.route("/ticket/:id").get(isLoggedIn, getSingleTicket);
router.route("/driver/update/:id").put(updateSingleDriver);
// router.route("/ticket/update/:id").put(isLoggedIn, updateSingleTicket);
router.route("/driver/delete/:id").delete(deleteSingleDriver);
// router.route("/ticket/delete/:id").delete(isLoggedIn, deleteSingleTicket);
router.route("/drivers").get(getAllDriver);

module.exports = router;
