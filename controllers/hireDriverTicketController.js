const BigPromise = require("../middlewares/bigPromise");
const CustomError = require("../utils/customError");
const DriverTicket = require("../models/hireDriverTicket");

exports.createTicket = BigPromise(async (req, res, next) => {
  const {
    customerId,
    driverId,
    scheduleOfService,
    typesOfServices,
    modeOfService,
    status,
  } = req.body;

  try {
    let ticket;

    if (scheduleOfService === "current") {
      ticket = await DriverTicket.create({
        customerId,
        driverId,
        scheduleOfService,
        typesOfServices,
        otherServiceTypeText: req.body?.otherServiceTypeText,
        modeOfService,
        query: req.body?.query,
        description: req.body?.description,
        status,
        currentLocation: req.body?.currentLocation,
        trackingLocation: req.body?.trackingLocation,
        distance: req.body?.distance,
        totalPrice: req.body?.totalPrice,
        paymentMode: req.body?.paymentMode,
      });
    } else if (scheduleOfService === "scheduled") {
      ticket = await DriverTicket.create({
        customerId,
        driverId,
        scheduleOfService,
        typesOfServices,
        otherServiceTypeText: req.body?.otherServiceTypeText,
        modeOfService,
        query: req.body?.query,
        description: req.body?.description,
        status,
        currentLocation: req.body?.currentLocation,
        trackingLocation: req.body?.trackingLocation,
        distance: req.body?.distance,
        totalPrice: req.body?.totalPrice,
        paymentMode: req.body?.paymentMode,
        pickupPlace: req.body?.pickupPlace,
        pickupDate: req.body?.pickupDate,
        pickupTime: req.body?.pickupTime,
        dropPlace: req.body?.dropPlace,
        dropDate: req.body?.dropDate,
        dropTime: req.body?.dropTime,
      });
    }

    return res.status(201).json({
      success: true,
      ticket,
    });
  } catch (error) {
    console.log(error);
    return next(new CustomError("Ticket can not be created", 401));
  }
});

exports.getSingleTicket = BigPromise(async (req, res, next) => {
  const ticketId = req.params.id;
  try {
    const ticket = await DriverTicket.findById(ticketId)
      .populate("customerId", "name email")
      .populate("driverId", "name email phoneNo driverLicense");
    if (!ticket) {
      return next(new CustomError("Ticket not found", 401));
    }
    return res.status(201).json({
      success: true,
      ticket,
    });
  } catch (error) {
    console.log(error);
    return next(new CustomError("Ticket can not be found", 401));
  }
});

exports.getAllTickets = BigPromise(async (req, res, next) => {
  const ticket = await DriverTicket.find({})
    .populate("customerId", "name email")
    .populate("driverId", "name email phoneNo driverLicense");
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
  const updatedVal = {
    customerId: req.body?.customerId,
    driverId: req.body?.driverId,
    scheduleOfService: req.body?.scheduleOfService,
    typesOfServices: req.body?.typesOfServices,
    otherServiceTypeText: req.body?.otherServiceTypeText,
    modeOfService: req.body?.modeOfService,
    query: req.body?.query,
    description: req.body?.description,
    status: req.body?.status,
    trackingLocation: req.body?.trackingLocation,
    distance: req.body?.distance,
    totalPrice: req.body?.totalPrice,
    paymentMode: req.body?.paymentMode,
    pickupPlace: req.body?.pickupPlace,
    pickupDate: req.body?.pickupDate,
    pickupTime: req.body?.pickupTime,
    dropPlace: req.body?.dropPlace,
    dropDate: req.body?.dropDate,
    dropTime: req.body?.dropTime,
  };

  try {
    const ticket = await DriverTicket.findByIdAndUpdate(ticketId, {
      ...updatedVal,
    })
      .then(() => {
        return res.status(201).json({
          success: true,
          ticket: updatedVal,
        });
      })
      .catch((err) => {
        console.log(err);
        return next(new CustomError("Ticket can not be updated", 401));
      });
  } catch (error) {
    console.log(error);
    return next(new CustomError("Ticket can not be updated", 401));
  }
});

exports.deleteSingleTicket = BigPromise(async (req, res, next) => {
  const ticketId = req.params.id;
  try {
    await DriverTicket.findByIdAndRemove(ticketId);
    return res.status(201).json({
      success: true,
    });
  } catch (error) {
    console.log(error);
    return next(new CustomError("Ticket can not be remove", 401));
  }
});
