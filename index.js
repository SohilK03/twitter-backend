// const express = require("express");
import express from "express";
import { PORT } from "./config/config.js";

const app = express();
app.get("/", (req, res) => {
  res.send("Hello, Twitter Backend Running");
});
app.listen(process.env.PORT || PORT, (req, res) => {
  console.log(`Server Running on ${PORT}`);
});
