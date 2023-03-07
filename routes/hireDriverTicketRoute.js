const express = require("express");
const {
  // Imports Controllers
} = require("../controllers/mechanicTicketController");

const { isLoggedIn } = require("../middlewares/driverUser");
const {
  createTicket,
  getSingleTicket,
  getAllTickets,
  updateSingleTicket,
  deleteSingleTicket,
} = require("../controllers/hireDriverTicketController");

const router = express.Router();

router.route("/driver/ticket/create").post(createTicket);
// router.route("/ticket/create").post(isLoggedIn, createTicket);
router.route("/driver/ticket/:id").get(getSingleTicket);
// router.route("/ticket/:id").get(isLoggedIn, getSingleTicket);
router.route("/driver/ticket/update/:id").put(updateSingleTicket);
// router.route("/ticket/update/:id").put(isLoggedIn, updateSingleTicket);
router.route("/driver/ticket/delete/:id").delete(deleteSingleTicket);
// router.route("/ticket/delete/:id").delete(isLoggedIn, deleteSingleTicket);
router.route("/drivers/ticket").get(getAllTickets);

// Admin only routes
// router.route("/admin/tickets").get(isLoggedIn, adminGetAllTickets);
// router
//   .route("/admin/ticket/update/:id")
//   .put(isLoggedIn, customRole("admin"), adminUpdateATicket);
// router
//   .route("/admin/ticket/delete/:id")
//   .delete(isLoggedIn, customRole("admin"), adminDeleetATicket);

module.exports = router;
