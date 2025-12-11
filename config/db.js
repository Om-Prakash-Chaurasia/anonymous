const mongoose = require("mongoose"); // importing mongoose

// creating connection for db
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI); // importing URI from .env
    console.log("✅ Database connected : ", conn.connection.host); // message after successful connection to db
  } catch (error) {
    console.error("❌ Failed to connect database", error); // in case of error
    process.exit(1); // exiting the connection
  }
};

module.exports = connectDB; // exporting the db connection module
