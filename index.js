'use strict';
import express from "express";
const app = express();
const port = 8080;
import { doSnapshots,news_sites } from "./snapshot.js";
import dotenv from 'dotenv';
dotenv.config();


app.get("/", (req, res) => {
    doSnapshots(news_sites)
  res.send("App is Successfully.");
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
