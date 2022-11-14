import request from "request";
import dotenv from "dotenv";
dotenv.config();
import express from "express";

const app = express();
const port = 4000;
// import {getData ,linkdown ,electric} from './fetchImage.js'
const url_line_notification = "https://notify-api.line.me/api/notify";

app.get("/", (req, res) => {
 getData();
  res.send("Send Line Notify is Successfully.");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

async function getData() {
  var options = {
    method: "GET",
    url: "https://264495661212239:sAB7tRZ_UCunOtqZdeX2LiKsEdw@api.cloudinary.com/v1_1/satjay/resources/image/",
    headers: {},
  };
  request(options, function (error, response) {
    if (error) throw new Error(error);
    const data = response.body;
    const results = JSON.parse(data);
    const electric = results.resources[0].secure_url;
    const linkdown = results.resources[1].secure_url;
    console.log(electric, "\n", linkdown);

    request(
      {
        method: "POST",
        uri: url_line_notification,
        header: {
          "Content-Type": "multipart/form-data",
        },
        auth: {
          bearer: process.env.TOKEN,
        },
        form: {
          message: "⚡️🔋📈 รายงานสถิติไฟฟ้าดับ ศูนย์วิศวกรรมชุมพร ประจำสัปดาห์ ",
          imageThumbnail: electric,
          imageFullsize: electric,
        },
      },
      (err, httpResponse, body) => {
        if (err) {
          console.log(err);
        } else {
          console.log(body);
        }
      }
    );

    request(
      {
        method: "POST",
        uri: url_line_notification,
        header: {
          "Content-Type": "multipart/form-data",
        },
        auth: {
          bearer: process.env.TOKEN,
        },
        form: {
          message:
            "🔌📶📈 รายงานสถิติ Link NT Down ศูนย์วิศวกรรมชุมพร ประจำสัปดาห์ ",
          imageThumbnail: linkdown,
          imageFullsize: linkdown,
        },
      },
      (err, httpResponse, body) => {
        if (err) {
          console.log(err);
        } else {
          console.log(body);
        }
      }
    );
  });
}
