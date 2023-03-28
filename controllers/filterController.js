const BigPromise = require("../middlewares/bigPromise");
const CustomError = require("../utils/customError");
const CleanerTicket = require("../models/cleanerTicket");
const DriverTicket = require("../models/hireDriverTicket");
const MechanicTicket = require("../models/mechanicTicket");

exports.mechanicTicketStatus = BigPromise(async (req, res, next) => {
  const { status } = req.body;
  try {
    const ticketStatus = await MechanicTicket.find({ status });
    return res.json({
      result: true,
      status: ticketStatus,
    });
  } catch (error) {
    console.log(error);
    return next(new CustomError("Unauthorized credentials!", 401));
  }
});

exports.mechanicTicketPaymentStatus = BigPromise(async (req, res, next) => {
  const { paymentStatus } = req.body;
  try {
    const payStatus = await MechanicTicket.find({ paymentStatus });
    return res.json({
      result: true,
      paymentStatus: payStatus,
    });
  } catch (error) {
    console.log(error);
    return next(new CustomError("Unauthorized credentials!", 401));
  }
});

exports.mechanicTicketScheduleOfService = BigPromise(async (req, res, next) => {
  const { scheduleOfService } = req.body;
  try {
    const scheduledService = await MechanicTicket.find({ scheduleOfService });
    return res.json({
      result: true,
      scheduleOfService: scheduledService,
    });
  } catch (error) {
    console.log(error);
    return next(new CustomError("Shedule of service denied!", 401));
  }
});

exports.mechanicTicketTypesOfService = BigPromise(async (req, res, next) => {
  const { typesOfServices } = req.body;
  try {
    const serviceType = await MechanicTicket.find({ typesOfServices });
    return res.json({
      result: true,
      typesOfServices: serviceType,
    });
  } catch (error) {
    console.log(error);
    return next(new CustomError("Service not found!", 401));
  }
});

exports.driverTicketStatus = BigPromise(async (req, res, next) => {
  const { status } = req.body;
  try {
    const driverTicketStatus = await DriverTicket.find({
      status,
    });

    return res.status(201).json({
      success: true,
      status: driverTicketStatus,
    });
  } catch (error) {
    console.log(error);
    return next(new CustomError("Unauthorized credentials!", 401));
  }
});

exports.driverTicketPaymentStatus = BigPromise(async (req, res, next) => {
  const { paymentStatus } = req.body;
  try {
    const driverPaymentStatus = await DriverTicket.find({
      paymentStatus,
    });

    return res.status(201).json({
      success: true,
      paymentStatus: driverPaymentStatus,
    });
  } catch (error) {
    console.log(error);
    return next(new CustomError("Unauthorized credentials!", 401));
  }
});

exports.driverTicketScheduleOfService = BigPromise(async (req, res, next) => {
  const { scheduleOfService } = req.body;
  try {
    const driverScheduleService = await DriverTicket.find({
      scheduleOfService,
    });

    return res.status(201).json({
      success: true,
      scheduleOfService: driverScheduleService,
    });
  } catch (error) {
    console.log(error);
    return next(new CustomError("Unauthorized credentials!", 401));
  }
});

exports.driverTicketTypesOfService = BigPromise(async (req, res, next) => {
  const { typesOfServices } = req.body;
  try {
    const driverTypesOfService = await DriverTicket.find({
      typesOfServices,
    });

    return res.status(201).json({
      success: true,
      typesOfServices: driverTypesOfService,
    });
  } catch (error) {
    console.log(error);
    return next(new CustomError("Unauthorized credentials!", 401));
  }
});

exports.cleanerTicketStatus = BigPromise(async (req, res, next) => {
  const { status } = req.body;
  try {
    const cleanerStatus = await CleanerTicket.find({
      status,
    });

    return res.status(201).json({
      success: true,
      status: cleanerStatus,
    });
  } catch (error) {
    console.log(error);
    return next(new CustomError("Unauthorized credentials!", 401));
  }
});

exports.cleanerTicketPaymentStatus = BigPromise(async (req, res, next) => {
  const { paymentStatus } = req.body;
  try {
    const cleanerPaymentStatus = await CleanerTicket.find({
      paymentStatus,
    });

    return res.status(201).json({
      success: true,
      paymentStatus: cleanerPaymentStatus,
    });
  } catch (error) {
    console.log(error);
    return next(new CustomError("Unauthorized credentials!", 401));
  }
});

exports.cleanerTicketScheduleOfService = BigPromise(async (req, res, next) => {
  const { scheduleOfService } = req.body;
  try {
    const cleanerScheduleStatus = await CleanerTicket.find({
      scheduleOfService,
    });

    return res.status(201).json({
      success: true,
      scheduleOfService: cleanerScheduleStatus,
    });
  } catch (error) {
    console.log(error);
    return next(new CustomError("Schedule of service denied!", 401));
  }
});

exports.cleanerTicketTypesOfService = BigPromise(async (req, res, next) => {
  const { typesOfServices } = req.body;
  try {
    const cleanerTypesOfStatus = await CleanerTicket.find({
      typesOfServices,
    });

    return res.status(201).json({
      success: true,
      typesOfServices: cleanerTypesOfStatus,
    });
  } catch (error) {
    console.log(error);
    return next(new CustomError("Service not found!", 401));
  }
});