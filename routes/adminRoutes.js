const express = require("express");

const {
  adminGetAllUsers,
  adminUpdateSingleUser,
  adminDisableSingleUser,
  adminDeleteSingleUser,
  adminResetUserPassword,
  adminGetSingleUser,
  adminGetAllMechanics,
  adminUpdateSingleMechanic,
  adminDeleteSingleMechanic,
  adminDisableMechanic,
  adminResetMechanicPassword,
  adminGetSingleMechanic,
  adminGetAllDriver,
  adminResetDriverPassword,
  adminUpdateSingleDriver,
  adminDisableDriver,
  adminDeleteSingleDriver,
  adminGetSingleDriver,
  adminGetAllCleaners,
  adminResetCleanerPassword,
  adminUpdateSingleCleaner,
  adminDeleteSingleCleaner,
  adminDisableCleaner,
  adminGetSingleCleaner,
  adminGetAllMechanicTickets,
  adminUpdateAMechanicTicket,
  adminDeleetAMechanicTicket,
  adminGetSingleMechanicTicket,
  adminGetAllDriverTickets,
  adminUpdateSingleDriverTicket,
  adminDeleteSingleDriverTicket,
  adminGetSingleDriverTicket,
  adminGetAllCleanerTickets,
  adminUpdateSingleCleanerTicket,
  adminDeleteSingleCleanerTicket,
  adminGetSingleCleanerTicket,
} = require("../controllers/adminController");
const { isLoggedIn, customRole } = require("../middlewares/user");

const router = express.Router();

// User Routes
router
  .route("/admin/user/all")
  .get(isLoggedIn, customRole("admin"), adminGetAllUsers);
router
  .route("/admin/user/update/:id")
  .put(isLoggedIn, customRole("admin"), adminUpdateSingleUser);
router
  .route("/admin/user/disable/:id")
  .post(isLoggedIn, customRole("admin"), adminDisableSingleUser);
router
  .route("/admin/user/delete/:id")
  .delete(isLoggedIn, customRole("admin"), adminDeleteSingleUser);
router
  .route("/admin/user/password/reset/:id")
  .post(isLoggedIn, customRole("admin"), adminResetUserPassword);
router
  .route("/admin/user/:id")
  .post(isLoggedIn, customRole("admin"), adminGetSingleUser);

// Mechanic Routes
router
  .route("/admin/mechanic/all")
  .get(isLoggedIn, customRole("admin"), adminGetAllMechanics);
router
  .route("/admin/mechanic/update/:id")
  .put(isLoggedIn, customRole("admin"), adminUpdateSingleMechanic);
router
  .route("/admin/mechanic/delete/:id")
  .delete(isLoggedIn, customRole("admin"), adminDeleteSingleMechanic);
router
  .route("/admin/mechanic/disable/:id")
  .post(isLoggedIn, customRole("admin"), adminDisableMechanic);
router
  .route("/admin/mechanic/password/reset/:id")
  .post(isLoggedIn, customRole("admin"), adminResetMechanicPassword);
router
  .route("/admin/mechanic/:id")
  .get(isLoggedIn, customRole("admin"), adminGetSingleMechanic);

// Driver Routes
router
  .route("/admin/driver/all")
  .get(isLoggedIn, customRole("admin"), adminGetAllDriver);
router
  .route("/admin/driver/password/reset/:id")
  .post(isLoggedIn, customRole("admin"), adminResetDriverPassword);
router
  .route("/admin/driver/update/:id")
  .put(isLoggedIn, customRole("admin"), adminUpdateSingleDriver);
router
  .route("/admin/driver/disable/:id")
  .post(isLoggedIn, customRole("admin"), adminDisableDriver);
router
  .route("/admin/driver/delete/:id")
  .delete(isLoggedIn, customRole("admin"), adminDeleteSingleDriver);
router
  .route("/admin/driver/:id")
  .get(isLoggedIn, customRole("admin"), adminGetSingleDriver);

// Cleaner Routes
router
  .route("/admin/cleaner/all")
  .get(isLoggedIn, customRole("admin"), adminGetAllCleaners);
router
  .route("/admin/cleaner/password/reset/:id")
  .post(isLoggedIn, customRole("admin"), adminResetCleanerPassword);
router
  .route("/admin/cleaner/update/:id")
  .put(isLoggedIn, customRole("admin"), adminUpdateSingleCleaner);
router
  .route("/admin/cleaner/delete/:id")
  .delete(isLoggedIn, customRole("admin"), adminDeleteSingleCleaner);
router
  .route("/admin/driver/disable/:id")
  .post(isLoggedIn, customRole("admin"), adminDisableCleaner);
router
  .route("/admin/cleaner/:id")
  .get(isLoggedIn, customRole("admin"), adminGetSingleCleaner);

// MechanicTicket Routes
router
  .route("/admin/allticket/mechanic")
  .get(isLoggedIn, customRole("admin"), adminGetAllMechanicTickets);

router
  .route("/admin/ticket/mechanic/update/:id")
  .put(isLoggedIn, customRole("admin"), adminUpdateAMechanicTicket);
router
  .route("/admin/ticket/mechanic/delete/:id")
  .delete(isLoggedIn, customRole("admin"), adminDeleetAMechanicTicket);
router
  .route("/admin/ticket/mechanic/:id")
  .get(isLoggedIn, customRole("admin"), adminGetSingleMechanicTicket);

// DriverTicket Routes
router
  .route("/admin/allticket/driver")
  .get(isLoggedIn, customRole("admin"), adminGetAllDriverTickets);
router
  .route("/admin/ticket/driver/update/:id")
  .put(isLoggedIn, customRole("admin"), adminUpdateSingleDriverTicket);
router
  .route("/admin/ticket/driver/delete/:id")
  .delete(isLoggedIn, customRole("admin"), adminDeleteSingleDriverTicket);
router
  .route("/admin/ticket/driver/:id")
  .get(isLoggedIn, customRole("admin"), adminGetSingleDriverTicket);

// CleanerTicket Routes
router
  .route("/admin/allticket/cleaner")
  .get(isLoggedIn, customRole("admin"), adminGetAllCleanerTickets);
router
  .route("/admin/ticket/cleaner/update/:id")
  .put(isLoggedIn, customRole("admin"), adminUpdateSingleCleanerTicket);
router
  .route("/admin/ticket/cleaner/delete/:id")
  .delete(isLoggedIn, customRole("admin"), adminDeleteSingleCleanerTicket);
router
  .route("/admin/ticket/cleaner/:id")
  .get(isLoggedIn, customRole("admin"), adminGetSingleCleanerTicket);

module.exports = router;

/*

Consumer( customer, mechanic, driver, cleaner)
Administrator(All access)
Service provider Manager access to work on the ticket part( ticket creation, all management but not ticket deletion)
*/