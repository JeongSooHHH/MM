// require("dotenv").config();
// const { createApp } = require("./app");
// const requestIp = require("request-ip");
// const { MongoClient } = require("mongodb");
// const express = require("express");
// // const logger = require("./logger");
// const PORT = process.env.PORT;
// const bodyParser = require("body-parser");
// const mongoUrl = process.env.DBURL;

// const app = express();

// const server = async () => {
//   try {
//     const client = new MongoClient(mongoUrl, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     await client.connect();
//     const app = createApp();
//     app.use(bodyParser.json());
//     app.use(bodyParser.urlencoded({ extended: false }));
//     console.log("MongoDb Native Connected!!");

//     app.use(express.json());
//     app.listen(PORT, () => {
//       console.log(`Server Listening on port ${PORT}`);
//       // logger.info(`Server Listening on port ${PORT}`);
//     });
//   } catch (err) {
//     console.log(err);
//   }
// };

// app.get("/", (req, res) => {
//   // logger.info("GET /");
//   res.sendStatus(200);
// });

// app.get("/error", (req, res) => {
//   // logger.error("Error message");
//   res.sendStatus(500);
// });

// server();

//==============위 네이티브 아래 몽구스 =====================================//
require("dotenv").config();
const { createApp } = require("./app");
const requestIp = require("request-ip");
const mongoose = require("mongoose");
const express = require("express");
// const logger = require("./logger");
const PORT = process.env.PORT;
const bodyParser = require("body-parser");
const mongoUrl = process.env.DBURL;

const app = express();

const server = async () => {
  try {
    mongoose.set("strictQuery", false);
    await mongoose.connect(mongoUrl);
    const app = createApp();
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    console.log("MongoDb Connected!!");

    app.use(express.json());
    app.listen(PORT, () => {
      console.log(`Server Listening on port ${PORT}`);
      // logger.info(`Server Listening on port ${PORT}`);
    });
  } catch (err) {
    console.log(err);
  }
};

app.get("/", (req, res) => {
  logger.info("GET /");
  res.sendStatus(200);
});

app.get("/error", (req, res) => {
  logger.error("Error message");
  res.sendStatus(500);
});

// app.listen(8080, () => {
//    logger.info('Server listening on port 8080');
// });
server();
