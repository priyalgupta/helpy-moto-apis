const express = require("express");

const {
  createTicket,
  getSingleTicket,
  getAllTickets,
  updateSingleTicket,
  deleteSingleTicket,
} = require("../controllers/cleanerTicketController");
const { isLoggedIn } = require("../middlewares/cleanerUser");

const router = express.Router();

router.route("/cleaner/ticket/create").post(createTicket);
// router.route("/ticket/create").post(isLoggedIn, createTicket);
router.route("/cleaner/ticket/:id").get(getSingleTicket);
// router.route("/ticket/:id").get(isLoggedIn, getSingleTicket);
router.route("/cleaner/ticket/update/:id").put(updateSingleTicket);
// router.route("/ticket/update/:id").put(isLoggedIn, updateSingleTicket);
router.route("/cleaner/ticket/delete/:id").delete(deleteSingleTicket);
// router.route("/ticket/delete/:id").delete(isLoggedIn, deleteSingleTicket);
router.route("/cleaners/ticket").get(getAllTickets);

module.exports = router;
