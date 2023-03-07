const express = require("express");
const {
  createTicket,
  getSingleTicket,
  updateSingleTicket,
  getAllTickets,
  deleteSingleTicket,
} = require("../controllers/mechanicTicketController");

const { isLoggedIn, customRole } = require("../middlewares/user");

const router = express.Router();

router.route("/mechanic/ticket/create").post(createTicket);
// router.route("/ticket/create").post(isLoggedIn, createTicket);
router.route("/mechanic/ticket/:id").get(getSingleTicket);
// router.route("/ticket/:id").get(isLoggedIn, getSingleTicket);
router.route("/mechanic/ticket/update/:id").put(updateSingleTicket);
// router.route("/ticket/update/:id").put(isLoggedIn, updateSingleTicket);
router.route("/mechanic/ticket/delete/:id").delete(deleteSingleTicket);
// router.route("/ticket/delete/:id").delete(isLoggedIn, deleteSingleTicket);
router.route("/mechanic/tickets").get(getAllTickets);

// Admin only routes
// router.route("/admin/tickets").get(isLoggedIn, adminGetAllTickets);
// router
//   .route("/admin/ticket/update/:id")
//   .put(isLoggedIn, customRole("admin"), adminUpdateATicket);
// router
//   .route("/admin/ticket/delete/:id")
//   .delete(isLoggedIn, customRole("admin"), adminDeleetATicket);

module.exports = router;
