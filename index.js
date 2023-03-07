require("dotenv").config();
const app = require("./app");
const connectWithDB = require("./config/dbConfig");
const PORT = process.env.PORT;

// DB configuration
connectWithDB(process.env.MONGODB_URI);

app.listen(PORT, (req, res) => {
  console.log(`App listening at http://localhost:${PORT}`);
});
