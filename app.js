require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const port = process.env.PORT || 3001;

//API security
app.use(helmet());

//handle CORS error
app.use(cors());

//MongoDB Connection Setup
const mongoose = require("mongoose");

// const mongoose = require('mongoose');
const mongoURI = "mongodb://localhost:27017/CLINT";

async function connectToMongo() {
    await mongoose.connect(mongoURI).then(()=> console.log("Connected to Mongo Successfully")).catch(err => console.log(err));
  }
  
connectToMongo();

// app.use(morgan("tiny"));
// // Set body bodyParser

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Load routers
const userRouter = require("./src/routers/user.router");
const ticketRouter = require("./src/routers/ticket.router");
const tokensRouter = require("./src/routers/tokens.router");

//Use Routers
app.use("/v1/user", userRouter);
app.use("/v1/ticket", ticketRouter);
app.use("/v1/tokens", tokensRouter);

//Error handler
const handleError = require("./src/utils/errorHandler");

app.use((req, res, next) => {
  const error = new Error("Resources not found!");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  handleError(error, res);
});

app.listen(port, () => {
  console.log(`API is ready on http://localhost:${port}`);
});
