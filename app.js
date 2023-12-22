const express = require("express");
const app = express();
// const ErrorHandler = require("./middleware/Errors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");


// app.use(cors({
//   origin: ['http://localhost:3000',],
//   credentials: true
// })); 
  // https://taskreminder-intership.netlify.app/
app.use(cors({credentials: true, origin: 'https://taskreminder-intership.netlify.app'}));
// app.use(cors());
  app.use(express.json());
  app.use(cookieParser());
//set body Parser
  app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());

  app.use("/test", (req, res) => {
    res.send("Hello world this is Notes_Taking_App server 1!");
  });
  app.get("/servertest", (req, res) => {
    res.send("Hello world this is Notes_Taking_App server 2!");
  });

  
// configuring Server Line
if (process.env.NODE_ENV !== "PRODUCTION") {
    require("dotenv").config({
      path: "./.env",
    });
  }
  //Routes Import 
const user = require("./controller/user.controller");
const note = require("./controller/notes.controller");
const task= require("./controller/Tasks.Controller");
  //Routes Usage
  app.use("/api/user",user);
  app.use("/api/notes",note);
  app.use("/api/tasks",task);

  // ErrorHandling
  // app.use(ErrorHandler);
  
  module.exports = app;