const mongoose = require("mongoose");
const logger = require("../logger");

console.log(process.env.MONGODB_URI);
const conn = mongoose.connection;

let mongo_connected = false;
conn.on("connected", function () {
  console.log("database is connected successfully 😍!!");
  mongo_connected = true;
});
conn.on("disconnected", function () {
  console.log("database is disconnected successfully");
  mongo_connected = false;
});

conn.on("error", (error) => {
  console.log("Error while connecting the db 😱!!");
  mongo_connected = false;
});

const connectMongo = async () => {
  console.log("Connect Mongo called....");
  console.log("is mongo Connected : ", mongo_connected);
  return new Promise((resolve, reject) => {
    try {
      if (!mongo_connected)
        mongoose.connect(
          `${process.env.MONGODB_URI}`,
          { useNewUrlParser: true, useUnifiedTopology: true },
          () => {
            resolve();
          }
        );
      else resolve();
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  connectMongo,
};
