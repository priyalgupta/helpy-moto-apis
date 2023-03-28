const express = require("express");

const { isDriverLoggedIn } = require("../middlewares/driverUser");
const {
  createTicket,
  getSingleTicket,
  getAllTickets,
  updateSingleTicket,
  deleteSingleTicket,
} = require("../controllers/hireDriverTicketController");

const {
  driverTicketPaymentStatus,
  driverTicketStatus,
  driverTicketScheduleOfService,
  driverTicketTypesOfService,
} = require("../controllers/filterController");

const router = express.Router();

router.route("ticket/driver/create").post(createTicket);
// router.route("/ticket/create").post(isDriverLoggedIn, createTicket);
router.route("/ticket/driver/:id").get(getSingleTicket);
// router.route("/ticket/:id").get(isDriverLoggedIn, getSingleTicket);
router.route("/ticket/driver/update/:id").put(updateSingleTicket);
// router.route("/ticket/update/:id").put(isDriverLoggedIn, updateSingleTicket);
router.route("/ticket/driver/delete/:id").delete(deleteSingleTicket);
// router.route("/ticket/delete/:id").delete(isDriverLoggedIn, deleteSingleTicket);
router.route("/allticket/driver").get(getAllTickets);
router.route("/ticket/driver/filter/status").delete(driverTicketStatus);
router
  .route("/ticket/driver/filter/paymentstatus")
  .delete(driverTicketPaymentStatus);
router
  .route("/ticket/driver/filter/schedule")
  .delete(driverTicketScheduleOfService);
router
  .route("/ticket/driver/filter/servicetype")
  .delete(driverTicketTypesOfService);

module.exports = router;