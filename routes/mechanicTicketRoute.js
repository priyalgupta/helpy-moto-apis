const express = require("express");
const {
  createTicket,
  getSingleTicket,
  updateSingleTicket,
  onTimeVerifyTicketOTP,
  scheduledArrivalVerifyTicketOTP,
  scheduledWorkshopVerifyTicketOTP,
  scheduledDeliverVerifyTicketOTP,
  getNearestMechanicList,
} = require("../controllers/mechanicTicketController");

const {
  mechanicTicketPaymentStatus,
  mechanicTicketStatus,
  mechanicTicketTypesOfService,
  mechanicTicketScheduleOfService,
} = require("../controllers/filterController");
const { isLoggedIn } = require("../middlewares/user");

const router = express.Router();

router.route("/ticket/mechanic/create").post(isLoggedIn, createTicket);
router.route("/ticket/mechanic/:id").get(isLoggedIn, getSingleTicket);
router.route("/ticket/mechanic/update/:id").put(isLoggedIn, updateSingleTicket);
router
  .route("/ticket/mechanic/filter/status")
  .get(isLoggedIn, mechanicTicketStatus);
router
  .route("/ticket/mechanic/filter/paymentstatus")
  .get(mechanicTicketPaymentStatus);
router
  .route("/ticket/mechanic/filter/schedule")
  .get(mechanicTicketScheduleOfService);
router
  .route("/ticket/mechanic/filter/servicetype")
  .get(mechanicTicketTypesOfService);

router.route("/ticket/mechanic/ontime/verifyotp").post(onTimeVerifyTicketOTP);
router
  .route("/ticket/mechanic/schedule/arrive/verifyotp")
  .post(scheduledArrivalVerifyTicketOTP);
router
  .route("/ticket/mechanic/schedule/workshop/verifyotp")
  .post(scheduledWorkshopVerifyTicketOTP);
router
  .route("/ticket/mechanic/schedule/deliver/verifyotp")
  .post(scheduledDeliverVerifyTicketOTP);
router.route("/ticket/mechanic/nearest/all").post(getNearestMechanicList);

module.exports = router;