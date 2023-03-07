const BigPromise = require("../middlewares/bigPromise");
const CustomError = require("../utils/customError");
const CleanerTicket = require("../models/cleanerTicket");

exports.createTicket = BigPromise(async (req, res, next) => {
  // const user = req.user;
  const {
    customerId,
    cleanerId,
    typesOfServices,
    otherServiceTypeText,
    modeOfService,
    status,
    pickupDate,
    pickupTime,
    dropDate,
    dropTime,
  } = req.body;

  try {
    const ticket = await CleanerTicket.create({
      customerId,
      cleanerId,
      typesOfServices,
      otherServiceTypeText,
      modeOfService,
      status,
      pickupDate,
      pickupTime,
      dropDate,
      dropTime,
    });

    return res.status(201).json({
      success: true,
      ticket,
    });
  } catch (error) {
    console.log(error);
    return next(new CustomError("Order can not be created", 401));
  }
});

exports.getSingleTicket = BigPromise(async (req, res, next) => {
  const ticketId = req.params.id;

  const ticket = await CleanerTicket.findById(ticketId)
    .populate("customerId", "name email")
    .populate("cleanerId", "ownerName email shopName shopDesc");
  if (!ticket) {
    return next(new CustomError("Ticket not found", 401));
  }

  res.status(201).json({
    success: true,
    ticket,
  });
});

exports.getAllTickets = BigPromise(async (req, res, next) => {
  const ticket = await CleanerTicket.find({})
    .populate("customerId", "name email")
    .populate("cleanerId", "ownerName email shopName shopDesc");
  console.log(ticket);
  if (!ticket) {
    return next(new CustomError("No Ticket Found", 401));
  } else if (ticket < 1) {
    return next(new CustomError("Ticket list is empty", 400));
  }

  res.status(201).json({
    success: true,
    ticket,
  });
});

exports.updateSingleTicket = BigPromise(async (req, res, next) => {
  const ticketId = req.params.id;
  const ticket = await CleanerTicket.findById(ticketId);

  if (!ticket) {
    return next(new CustomError("No Ticket Found", 401));
  }
  // const { ticketStatus } = req.body;
  // if (ticket.ticketStatus === "completed") {
  //   return next(new CustomError("Ticket already marked as completed", 401));
  // }

  const updatedTicket = await CleanerTicket.findByIdAndUpdate(ticketId, {
    ...req.body,
  });

  res.status(201).json({
    success: true,
    ticket: updatedTicket,
  });
});

exports.deleteSingleTicket = BigPromise(async (req, res, next) => {
  const ticketId = req.params.id;
  await CleanerTicket.findByIdAndRemove(ticketId);

  res.status(201).json({
    success: true,
  });
});
