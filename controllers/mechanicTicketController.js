const BigPromise = require("../middlewares/bigPromise");
const CustomError = require("../utils/customError");
const MechanicTicket = require("../models/mechanicTicket");

exports.createTicket = BigPromise(async (req, res, next) => {
  const { _id } = req.decodedUser;
  const {
    customerId,
    // mechanicId,
    scheduleOfService,
    typesOfServices,
    modeOfService,
    status,
  } = req.body;

  try {
    if (_id === customerId) {
      return next(new CustomError("Ticket credentials mismatch!", 400));
    }

    let ticket;

    if (scheduleOfService === "current") {
      ticket = await MechanicTicket.create({
        customerId,
        mechanicId,
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
      ticket = await MechanicTicket.create({
        customerId,
        mechanicId,
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
        dropPlace: req.body?.dropPlace,
        pickupDate: req.body?.pickupDate,
        pickupTime: req.body?.pickupTime,
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
    const ticket = await MechanicTicket.findById(ticketId)
      .populate("customerId", "name email")
      .populate("mechanicId", "name email phoneNo shopName");
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

exports.updateSingleTicket = BigPromise(async (req, res, next) => {
  const ticketId = req.params.id;
  const updatedVal = {
    customerId: req.body?.customerId,
    mechanicId: req.body?.mechanicId,
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
    await MechanicTicket.findByIdAndUpdate(ticketId, {
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

exports.onTimeVerifyTicketOTP = BigPromise(async (req, res, next) => {
  const { id, onTimeOTP } = req.body;

  const mechanicTicket = await MechanicTicket.findById(id);

  if (!mechanicTicket || mechanicTicket.status === "completed") {
    return next(new CustomError("Ticket is invalid", 401));
  }

  const isValidOTP = mechanicTicket.isOnTimeOTPValidated(onTimeOTP);

  if (!isValidOTP) {
    return next(new CustomError("OTP not matched", 401));
  }

  mechanicTicket.isVerifiedOnTimeOTP = true;
  await mechanicTicket.save();

  return res.status(201).json({
    success: true,
    isVerifiedOnTimeOTP: mechanicTicket.isVerifiedOnTimeOTP,
  });
});

exports.scheduledArrivalVerifyTicketOTP = BigPromise(async (req, res, next) => {
  const { id, scheduledArrivedOTP } = req.body;

  const mechanicTicket = await MechanicTicket.findById(id);

  if (!mechanicTicket || mechanicTicket.status === "completed") {
    return next(new CustomError("Ticket is invalid", 401));
  }

  const isValidOTP =
    mechanicTicket.isScheduledArriveOTPValidated(scheduledArrivedOTP);

  if (!isValidOTP) {
    return next(new CustomError("OTP not matched", 401));
  }

  mechanicTicket.isVerifiedscheduledArrivedOTP = true;
  await mechanicTicket.generateScheduledWorkshopOTP();
  await mechanicTicket.save();

  return res.status(201).json({
    success: true,
    isVerifiedArrivedOTP: mechanicTicket.isVerifiedscheduledArrivedOTP,
  });
});

exports.scheduledWorkshopVerifyTicketOTP = BigPromise(
  async (req, res, next) => {
    const { id, scheduledWorkshopOTP } = req.body;

    const mechanicTicket = await MechanicTicket.findById(id);

    if (!mechanicTicket || mechanicTicket.status === "completed") {
      return next(new CustomError("Ticket is invalid", 401));
    }

    const isValidOTP =
      mechanicTicket.isScheduledWorkshopOTPValidated(scheduledWorkshopOTP);

    if (!isValidOTP) {
      return next(new CustomError("OTP not matched", 401));
    }

    mechanicTicket.isVerifiedscheduledWorkshopOTP = true;
    await mechanicTicket.generateScheduledDeliveredOTP();
    await mechanicTicket.save();

    return res.status(201).json({
      success: true,
      isVerifiedWorkshopOTP: mechanicTicket.isVerifiedscheduledWorkshopOTP,
    });
  }
);

exports.scheduledDeliverVerifyTicketOTP = BigPromise(async (req, res, next) => {
  const { id, scheduledDeliveredOTP } = req.body;

  const mechanicTicket = await MechanicTicket.findById(id);

  if (!mechanicTicket || mechanicTicket.status === "completed") {
    return next(new CustomError("Ticket is invalid", 401));
  }

  const isValidOTP = mechanicTicket.isScheduledDeliveredOTPValidated(
    scheduledDeliveredOTP
  );

  if (!isValidOTP) {
    return next(new CustomError("OTP not matched", 401));
  }

  mechanicTicket.isVerifiedscheduledDeliveredOTP = true;
  await mechanicTicket.save();

  return res.status(201).json({
    success: true,
    isVerifiedDeliveredOTP: mechanicTicket.isVerifiedscheduledDeliveredOTP,
  });
});

exports.getNearestMechanicList = BigPromise(async (req, res, next) => {
  const { currentLocation } = req.body;

  const { latitude, longitude } = currentLocation;
});