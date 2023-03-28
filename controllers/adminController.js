const BigPromise = require("../middlewares/bigPromise");
const CustomError = require("../utils/customError");
const MechanicTicket = require("../models/mechanicTicket");
const User = require("../models/user");
const Mechanic = require("../models/mechanic");
const Driver = require("../models/driver");
const Cleaner = require("../models/cleaner");
const DriverTicket = require("../models/hireDriverTicket");
const CleanerTicket = require("../models/cleanerTicket");

// Admin User Routes Access
exports.adminGetAllUsers = BigPromise(async (req, res, next) => {
  const { _id } = req.decodedUser;

  try {
    const user = await User.find({});
    if (!user) {
      return next(new CustomError("No User Found", 401));
    } else if (user < 1) {
      return next(new CustomError("User list is empty", 400));
    }

    res.status(201).json({
      success: true,
      user,
    });

  } catch (error) {
    console.log(error);
    return next(new CustomError("No User Found", 401));
  }
});
exports.adminUpdateSingleUser = BigPromise(async (req, res, next) => {
  const uId = req.params.id;

  try {
    await User.findByIdAndUpdate(uId, { ...req.body })
      .then((err, data) => {
        if (err)
          return next(new CustomError("Error while updating user!", 401));
        return res.status(201).json({
          success: true,
          user: data,
        });
      })
      .catch((err) => {
        console.log(err);
        return next(new CustomError("Error while updating user!", 401));
      });
  } catch (error) {
    console.log(error);
    return next(new CustomError("Error while updating user!", 401));
  }
});
exports.adminDisableSingleUser = BigPromise(async (req, res, next) => {
  const uId = req.params.id;

  try {
    const user = await User.findById(uId);
    if (!user) {
      return next(new CustomError("No user found!", 401));
    }

    if (user.accountDisable === false) {
      user.accountDisable = true;
      await user.save();

      return res.status(201).json({
        success: true,
        user,
      });
    } else {
      user.accountDisable = false;
      await user.save();

      return res.status(201).json({
        success: true,
        user,
      });
    }
  } catch (error) {
    console.log(error);
    return next(new CustomError("Error while disabling user!", 401));
  }
});
exports.adminDeleteSingleUser = BigPromise(async (req, res, next) => {
  const uId = req.params.id;

  try {
    await User.findByIdAndRemove(uId);
    res.status(201).json({
      success: true,
    });
  } catch (error) {
    console.log(error);
    return next(new CustomError("Error while deleting user!", 401));
  }
});
exports.adminGetSingleUser = BigPromise(async (req, res, next) => {
  const uId = req.params.id;

  try {
    const user = await User.findById(uId);
    if (!user) {
      return next(new CustomError("User not found", 401));
    }

    res.status(201).json({
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
    return next(new CustomError("Error to get user details!", 401));
  }
});
exports.adminResetUserPassword = BigPromise(async (req, res, next) => {
  const uId = req.params.id;
  const { password } = req.req;

  try {
    const user = await User.findById(uId).select(+password);

    if (!user) {
      return next(new CustomError("No User Found", 401));
    }

    user.password = password;
    await user.save();

    res.status(201).json({
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
    return next(new CustomError("User Password Failed", 401));
  }
});

// Admin Mechanic Routes Access
exports.adminGetAllMechanics = BigPromise(async (req, res, next) => {
  try {
    const mechanic = await Mechanic.find({});
    if (!mechanic) {
      return next(new CustomError("No mechanic Found", 401));
    } else if (mechanic < 1) {
      return next(new CustomError("Mechanic list is empty", 400));
    }

    res.status(201).json({
      success: true,
      mechanic,
    });
  } catch (error) {
    console.log(error);
    return next(new CustomError("No mechanic Found", 401));
  }
});
exports.adminUpdateSingleMechanic = BigPromise(async (req, res, next) => {
  const uId = req.params.id;

  try {
    await Mechanic.findByIdAndUpdate(uId, { ...req.body })
      .then((err, data) => {
        if (err)
          return next(new CustomError("Error while updating mechanic!", 401));
        return res.status(201).json({
          success: true,
          mechanic: data,
        });
      })
      .catch((err) => {
        console.log(err);
        return next(new CustomError("Error while updating mechanic!", 401));
      });
  } catch (error) {
    console.log(error);
    return next(new CustomError("Error while updating mechanic!", 401));
  }
});
exports.adminDisableMechanic = BigPromise(async (req, res, next) => {
  const uId = req.params.id;

  try {
    const mechanic = await Mechanic.findById(uId);
    if (!mechanic) {
      return next(new CustomError("No mechanic found!", 401));
    }

    if (mechanic.accountDisable === false) {
      mechanic.accountDisable = true;
      await mechanic.save();

      return res.status(201).json({
        success: true,
        mechanic,
      });
    } else {
      mechanic.accountDisable = false;
      await mechanic.save();

      return res.status(201).json({
        success: true,
        mechanic,
      });
    }
  } catch (error) {
    console.log(error);
    return next(new CustomError("Error while disabling mechanic!", 401));
  }
});
exports.adminDeleteSingleMechanic = BigPromise(async (req, res, next) => {
  const uId = req.params.id;

  try {
    await Mechanic.findByIdAndRemove(uId);
    res.status(201).json({
      success: true,
    });
  } catch (error) {
    console.log(error);
    return next(new CustomError("Error while deleting Mechanic!", 401));
  }
});
exports.adminGetSingleMechanic = BigPromise(async (req, res, next) => {
  const uId = req.params.id;

  try {
    const mechanic = await Mechanic.findById(uId);
    if (!mechanic) {
      return next(new CustomError("Mechanic not found", 401));
    }

    res.status(201).json({
      success: true,
      mechanic,
    });
  } catch (error) {
    console.log(error);
    return next(new CustomError("Error to get mechanic details!", 401));
  }
});
exports.adminResetMechanicPassword = BigPromise(async (req, res, next) => {
  const uId = req.params.id;
  const { password } = req.req;

  try {
    const mechanic = await Mechanic.findById(uId).select(+password);

    if (!mechanic) {
      return next(new CustomError("No Mechanic Found", 401));
    }

    mechanic.password = password;
    await mechanic.save();

    res.status(201).json({
      success: true,
      mechanic,
    });
  } catch (error) {
    console.log(error);
    return next(new CustomError("Mechanic Password Failed", 401));
  }
});

// Admin Driver Routes Access
exports.adminGetAllDriver = BigPromise(async (req, res, next) => {
  try {
    const driver = await Driver.find({});
    if (!driver) {
      return next(new CustomError("No driver Found", 401));
    } else if (driver < 1) {
      return next(new CustomError("Driver list is empty", 400));
    }

    res.status(201).json({
      success: true,
      driver,
    });
  } catch (error) {
    console.log(error);
    return next(new CustomError("No driver Found", 401));
  }
});
exports.adminUpdateSingleDriver = BigPromise(async (req, res, next) => {
  const uId = req.params.id;

  try {
    await Driver.findByIdAndUpdate(uId, { ...req.body })
      .then((err, data) => {
        if (err)
          return next(new CustomError("Error while updating driver!", 401));
        return res.status(201).json({
          success: true,
          driver: data,
        });
      })
      .catch((err) => {
        console.log(err);
        return next(new CustomError("Error while updating driver!", 401));
      });
  } catch (error) {
    console.log(error);
    return next(new CustomError("Error while updating driver!", 401));
  }
});
exports.adminDisableDriver = BigPromise(async (req, res, next) => {
  const uId = req.params.id;

  try {
    const driver = await Driver.findById(uId);
    if (!driver) {
      return next(new CustomError("No driver found!", 401));
    }

    if (driver.accountDisable === false) {
      driver.accountDisable = true;
      await driver.save();

      return res.status(201).json({
        success: true,
        driver,
      });
    } else {
      driver.accountDisable = false;
      await driver.save();

      return res.status(201).json({
        success: true,
        driver,
      });
    }
  } catch (error) {
    console.log(error);
    return next(new CustomError("Error while disabling driver!", 401));
  }
});
exports.adminDeleteSingleDriver = BigPromise(async (req, res, next) => {
  const uId = req.params.id;

  try {
    await Driver.findByIdAndRemove(uId);
    res.status(201).json({
      success: true,
    });
  } catch (error) {
    console.log(error);
    return next(new CustomError("Error while deleting Driver!", 401));
  }
});
exports.adminGetSingleDriver = BigPromise(async (req, res, next) => {
  const uId = req.params.id;

  try {
    const driver = await Driver.findById(uId);
    if (!driver) {
      return next(new CustomError("Driver not found", 401));
    }

    res.status(201).json({
      success: true,
      driver,
    });
  } catch (error) {
    console.log(error);
    return next(new CustomError("Error to get driver details!", 401));
  }
});
exports.adminResetDriverPassword = BigPromise(async (req, res, next) => {
  const uId = req.params.id;
  const { password } = req.req;

  try {
    const driver = await Driver.findById(uId).select(+password);

    if (!driver) {
      return next(new CustomError("No Driver Found", 401));
    }

    driver.password = password;
    await driver.save();

    res.status(201).json({
      success: true,
      driver,
    });
  } catch (error) {
    console.log(error);
    return next(new CustomError("Driver Password Failed", 401));
  }
});

// Admin Cleaner Routes Access
exports.adminGetAllCleaners = BigPromise(async (req, res, next) => {
  try {
    const cleaner = await Cleaner.find({});
    if (!cleaner) {
      return next(new CustomError("No cleaner Found", 401));
    } else if (cleaner < 1) {
      return next(new CustomError("Cleaner list is empty", 400));
    }

    res.status(201).json({
      success: true,
      cleaner,
    });
  } catch (error) {
    console.log(error);
    return next(new CustomError("No cleaner Found", 401));
  }
});
exports.adminUpdateSingleCleaner = BigPromise(async (req, res, next) => {
  const uId = req.params.id;

  try {
    await Cleaner.findByIdAndUpdate(uId, { ...req.body })
      .then((err, data) => {
        if (err)
          return next(new CustomError("Error while updating cleaner!", 401));
        return res.status(201).json({
          success: true,
          cleaner: data,
        });
      })
      .catch((err) => {
        console.log(err);
        return next(new CustomError("Error while updating cleaner!", 401));
      });
  } catch (error) {
    console.log(error);
    return next(new CustomError("Error while updating cleaner!", 401));
  }
});
exports.adminDisableCleaner = BigPromise(async (req, res, next) => {
  const uId = req.params.id;

  try {
    const cleaner = await Cleaner.findById(uId);
    if (!cleaner) {
      return next(new CustomError("No cleaner found!", 401));
    }

    if (cleaner.accountDisable === false) {
      cleaner.accountDisable = true;
      await cleaner.save();

      return res.status(201).json({
        success: true,
        cleaner,
      });
    } else {
      cleaner.accountDisable = false;
      await cleaner.save();

      return res.status(201).json({
        success: true,
        cleaner,
      });
    }
  } catch (error) {
    console.log(error);
    return next(new CustomError("Error while disabling cleaner!", 401));
  }
});
exports.adminDeleteSingleCleaner = BigPromise(async (req, res, next) => {
  const uId = req.params.id;

  try {
    await Cleaner.findByIdAndRemove(uId);
    res.status(201).json({
      success: true,
    });
  } catch (error) {
    console.log(error);
    return next(new CustomError("Error while deleting Cleaner!", 401));
  }
});
exports.adminGetSingleCleaner = BigPromise(async (req, res, next) => {
  const uId = req.params.id;

  try {
    const cleaner = await Cleaner.findById(uId);
    if (!cleaner) {
      return next(new CustomError("Cleaner not found", 401));
    }

    res.status(201).json({
      success: true,
      cleaner,
    });
  } catch (error) {
    console.log(error);
    return next(new CustomError("Error to get cleaner details!", 401));
  }
});
exports.adminResetCleanerPassword = BigPromise(async (req, res, next) => {
  const uId = req.params.id;
  const { password } = req.req;

  try {
    const cleaner = await Cleaner.findById(uId).select(+password);

    if (!cleaner) {
      return next(new CustomError("No Cleaner Found", 401));
    }

    cleaner.password = password;
    await cleaner.save();

    res.status(201).json({
      success: true,
      cleaner,
    });
  } catch (error) {
    console.log(error);
    return next(new CustomError("Cleaner Password Failed", 401));
  }
});

// Admin Mechanic Ticket Routes Access
exports.adminGetAllMechanicTickets = BigPromise(async (req, res, next) => {
  const ticket = await MechanicTicket.find({})
    .populate("customerId", "name email")
    .populate("mechanicId", "name email phoneNo shopName");
  if (!ticket) {
    return next(new CustomError("No Ticket Found", 401));
  } else if (ticket < 1) {
    return next(new CustomError("Ticket list is empty", 400));
  }

  return res.status(201).json({
    success: true,
    ticket,
  });
});
exports.adminUpdateAMechanicTicket = BigPromise(async (req, res, next) => {
  const ticketId = req.params.id;

  try {
    await MechanicTicket.findByIdAndUpdate(ticketId, {
      ...req.body,
    })
      .then((error, data) => {
        if (error) {
          return next(new CustomError("Ticket can not be updated", 401));
        }
        return res.status(201).json({
          success: true,
          ticket: data,
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
exports.adminDeleetAMechanicTicket = BigPromise(async (req, res, next) => {
  const ticketId = req.params.id;
  try {
    await MechanicTicket.findByIdAndRemove(ticketId);
    return res.status(201).json({
      success: true,
    });
  } catch (error) {
    console.log(error);
    return next(new CustomError("Ticket can not be remove", 401));
  }
});
exports.adminGetSingleMechanicTicket = BigPromise(async (req, res, next) => {
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

// Admin Driver Ticket Routes Access
exports.adminGetAllDriverTickets = BigPromise(async (req, res, next) => {
  const ticket = await DriverTicket.find({})
    .populate("customerId", "name email")
    .populate("driverId", "name email phoneNo shopName");
  if (!ticket) {
    return next(new CustomError("No Ticket Found", 401));
  } else if (ticket < 1) {
    return next(new CustomError("Ticket list is empty", 400));
  }

  return res.status(201).json({
    success: true,
    ticket,
  });
});
exports.adminUpdateSingleDriverTicket = BigPromise(async (req, res, next) => {
  const ticketId = req.params.id;

  try {
    await DriverTicket.findByIdAndUpdate(ticketId, {
      ...req.body,
    })
      .then((error, data) => {
        if (error) {
          return next(new CustomError("Ticket can not be updated", 401));
        }
        return res.status(201).json({
          success: true,
          ticket: data,
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
exports.adminDeleteSingleDriverTicket = BigPromise(async (req, res, next) => {
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
exports.adminGetSingleDriverTicket = BigPromise(async (req, res, next) => {
  const ticketId = req.params.id;

  try {
    const ticket = await DriverTicket.findById(ticketId)
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

// Admin Cleaner Ticket Routes Access
exports.adminGetAllCleanerTickets = BigPromise(async (req, res, next) => {
  const ticket = await CleanerTicket.find({})
    .populate("customerId", "name email")
    .populate("cleanerId", "name email phoneNo shopName");
  if (!ticket) {
    return next(new CustomError("No Ticket Found", 401));
  } else if (ticket < 1) {
    return next(new CustomError("Ticket list is empty", 400));
  }

  return res.status(201).json({
    success: true,
    ticket,
  });
});
exports.adminUpdateSingleCleanerTicket = BigPromise(async (req, res, next) => {
  const ticketId = req.params.id;

  try {
    await CleanerTicket.findByIdAndUpdate(ticketId, {
      ...req.body,
    })
      .then((error, data) => {
        if (error) {
          return next(new CustomError("Ticket can not be updated", 401));
        }
        return res.status(201).json({
          success: true,
          ticket: data,
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
exports.adminDeleteSingleCleanerTicket = BigPromise(async (req, res, next) => {
  const ticketId = req.params.id;
  try {
    await CleanerTicket.findByIdAndRemove(ticketId);
    return res.status(201).json({
      success: true,
    });
  } catch (error) {
    console.log(error);
    return next(new CustomError("Ticket can not be remove", 401));
  }
});
exports.adminGetSingleCleanerTicket = BigPromise(async (req, res, next) => {
  const ticketId = req.params.id;

  try {
    const ticket = await CleanerTicket.findById(ticketId)
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
