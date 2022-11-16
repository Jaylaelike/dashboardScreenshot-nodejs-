'use strict';
import express from "express";
const app = express();
// const port = 8080;
import { doSnapshots, news_sites } from "./snapshot.js";
import dotenv from 'dotenv';
dotenv.config();


app.get("/", (req, res) => {
  doSnapshots(news_sites);
  res.send("App is Successfully.")
});

//use pm2 node restart RUN : ./node_modules/.bin/pm2 start index.js --watch
app.get("/restart", (_, res) => {
  process.exit(1);
});


app.listen(process.env.PORT || 8080, () => {
  console.log(`Example app listening ...`);
});
