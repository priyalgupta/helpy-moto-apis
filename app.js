const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const morgan = require("morgan");
const ticketRoute = require("./routes/mechanicTicketRoute");
const userRoute = require("./routes/userRoute");
const mechanicRoute = require("./routes/mechanicRoute");

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// middleware setup the logger with custom token formats
app.use(morgan("dev"));

// Routes
app.use("/api/v1", ticketRoute);
app.use("/api/v1", userRoute);
app.use("/api/v1", mechanicRoute);

app.get("/signuptests", (req, res) => {
  res.render("signupTest");
});

module.exports = app;
