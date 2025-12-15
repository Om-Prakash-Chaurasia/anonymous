const express = require("express"); // importing express
const dotenv = require("dotenv"); // importing dotenv
const connectDB = require("./config/db"); // importing db connection
const userRoutes = require("./routes/user.routes");
const cors = require("cors");

const app = express(); // creating app

dotenv.config(); // configuring dotenv

app.use(express.json()); //  middleware to convert into json

app.use(cors());

// app.use("/api/user", require("./routes/user.routes"));
app.use("/api/user", userRoutes);

const PORT = process.env.PORT; // using port from .env

connectDB(); // database connection call

// creating server
app.listen(PORT, () => {
  console.log(`Server is up and running on port ${PORT}`);
});
