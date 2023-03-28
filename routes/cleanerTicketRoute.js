const express = require("express");

const {
  createTicket,
  getSingleTicket,
  getAllTickets,
  updateSingleTicket,
  deleteSingleTicket,
} = require("../controllers/cleanerTicketController");
const { isCleanerLoggedIn } = require("../middlewares/cleanerUser");
const { cleanerTicketStatus, cleanerTicketPaymentStatus, cleanerTicketScheduleOfService, cleanerTicketTypesOfService } = require("../controllers/filterController");

const router = express.Router();

router.route("/ticket/cleaner/create").post(createTicket);
// router.route("/ticket/create").post(isCleanerLoggedIn, createTicket);
router.route("/ticket/cleaner/:id").get(getSingleTicket);
// router.route("/ticket/:id").get(isCleanerLoggedIn, getSingleTicket);
router.route("/ticket/cleaner/update/:id").put(updateSingleTicket);
// router.route("/ticket/update/:id").put(isCleanerLoggedIn, updateSingleTicket);
router.route("/ticket/cleaner/delete/:id").delete(deleteSingleTicket);
// router.route("/ticket/delete/:id").delete(isCleanerLoggedIn, deleteSingleTicket);
router.route("/allticket/cleaner").get(getAllTickets);
router.route("/ticket/cleaner/filter/status").delete(cleanerTicketStatus);
router
  .route("/ticket/cleaner/filter/paymentstatus")
  .delete(cleanerTicketPaymentStatus);
router
  .route("/ticket/cleaner/filter/schedule")
  .delete(cleanerTicketScheduleOfService);
router
  .route("/ticket/cleaner/filter/servicetype")
  .delete(cleanerTicketTypesOfService);

module.exports = router;
