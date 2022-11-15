import puppeteer from "puppeteer";
import cloudinary from "cloudinary";
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
  secure: true,
});
async function doScreenCapture(url, site_name) {
  const d = new Date();
  const current_time = `${d.getFullYear()}_${d.getMonth() + 1}_
    ${d.getDate()}_${d.getHours()}_${d.getMinutes()}`;
  const cloudinary_options = {
    public_id: `newsshot/${site_name}`,
  };
  const browser = await puppeteer.launch();
  const page = await browser.newPage({
    executablePath: "/usr/bin/google-chrome",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  }
  );
  await page.goto(url, { waitUntil: "networkidle0" })
  let shotResult = await page
    .screenshot()
    .then((result) => {
      console.log(`${site_name} got some results.`);
      return result;
    })
    .catch((e) => {
      console.error(`[${site_name}] Error in snapshotting news`, e);
      return false;
    });
  if (shotResult) {
    return cloundinaryPromise(shotResult, cloudinary_options);
  } else {
    return null;
  }
  await browser.close();
}
const news_sites = [
  {
    name: "LinkDown",
    url: "https://datastudio.google.com/embed/reporting/1634adb4-9550-4239-a4a7-b2a9f25c2f5e/page/7xD8",
    //https://datastudio.google.com/embed/reporting/1634adb4-9550-4239-a4a7-b2a9f25c2f5e/page/7xD8
  },
  {
    name: "ElectricFail",
    url: "https://datastudio.google.com/embed/reporting/8c3f65d2-dc3f-47e5-87f0-6284cd2ac60a/page/7xD8",
    //https://datastudio.google.com/embed/reporting/8c3f65d2-dc3f-47e5-87f0-6284cd2ac60a/page/7xD8
  },
];
function cloundinaryPromise(shotResult, cloudinary_options) {
  return new Promise(function (res, rej) {
    cloudinary.v2.uploader
      .upload_stream(cloudinary_options, function (error, cloudinary_result) {
        if (error) {
          console.error("Upload to cloudinary failed: ", error);
          rej(error);
        }
        console.log(cloudinary_result);
        res(cloudinary_result);
      })
      .end(shotResult);
  });
}
async function doSnapshots(news_sites) {
  let cloundiary_promises = [];
  for (let i = 0; i < news_sites.length; i++) {
    try {
      let cloudinary_snapshot = await doScreenCapture(
        news_sites[i]["url"],
        news_sites[i]["name"]
      );
      if (cloudinary_snapshot) {
        cloundiary_promises.push(cloudinary_snapshot);
      }
    } catch (e) {
      console.error(
        `[${news_sites[i]["name"] || "Unknown site"
        }] Error in snapshotting news`,
        e
      );
    }
  }
  Promise.all(cloundiary_promises).then(function (val) {
    //process.exit();
  });
}
// doSnapshots(news_sites);
export { doSnapshots, news_sites };
