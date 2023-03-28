const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const morgan = require("morgan");
const cleanerRoute = require("./routes/cleanerRoute");
const driverRoute = require("./routes/driverRoute");
const mechanicRoute = require("./routes/mechanicRoute");
const cleanerTicketRoute = require("./routes/cleanerTicketRoute");
const driverTicketRoute = require("./routes/hireDriverTicketRoute");
const mechanicTicketRoute = require("./routes/mechanicTicketRoute");
const userRoute = require("./routes/userRoute");

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// middleware setup the logger with custom token formats
app.use(morgan("dev"));

app.get("/test", (req, res) => {
  res.end("testing Mechanic APIs");
});

// Routes
app.use("/api/v1", cleanerRoute);
app.use("/api/v1", cleanerTicketRoute);
app.use("/api/v1", driverRoute);
app.use("/api/v1", driverTicketRoute);
app.use("/api/v1", mechanicRoute);
app.use("/api/v1", mechanicTicketRoute);
app.use("/api/v1", userRoute);

app.get("/signuptests", (req, res) => {
  res.render("signupTest");
});

module.exports = app;
