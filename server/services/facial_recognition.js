const ffmpeg = require("fluent-ffmpeg");
const fs = require("fs");
const path = require("path");
const axios = require("axios");
const FormData = require("form-data");

require("dotenv").config();

const proctoringUrl = process.env.PROCTORING_SYSTEM_URL;

const generateRandomTimestamps = (duration, count) => {
  const timestamps = [];

  while (timestamps.length < count) {
    const randomTime = Math.random() * duration;

    if (timestamps.every((ts) => Math.abs(ts - randomTime) >= 1)) {
      timestamps.push(randomTime);
    }
  }

  return timestamps.sort((a, b) => a - b);
};

const captureRandomFrames = (videoDuration, videoPath, outputDir) => {
  return new Promise((resolve, reject) => {
    let numOfTimestamps;

    if (videoDuration > 120) {
      numOfTimestamps = 15;
    } else if (videoDuration > 60 && videoDuration <= 120) {
      numOfTimestamps = 12;
    } else if (videoDuration > 30 && videoDuration <= 60) {
      numOfTimestamps = 10;
    } else if (videoDuration > 20 && videoDuration <= 30) {
      numOfTimestamps = 5;
    } else if (videoDuration >= 6 && videoDuration <= 20) {
      numOfTimestamps = 3;
    } else {
      numOfTimestamps = 1;
    }

    const timestamps = generateRandomTimestamps(videoDuration, numOfTimestamps);

    const promises = timestamps.map((time) => {
      return new Promise((resolve, reject) => {
        ffmpeg(videoPath)
          .screenshots({
            timestamps: [time],
            filename: `frame_at_${time.toFixed(2)}.jpeg`,
            folder: outputDir,
          })
          .on("end", () => {
            resolve();
          })
          .on("error", (err) => {
            console.error(
              `Error capturing frame at ${time.toFixed(2)} seconds:`,
              err
            );
            reject(err);
          });
      });
    });

    Promise.all(promises)
      .then(() => resolve("All frames captured successfully"))
      .catch(reject);
  });
};

const sendImageForRecognition = async (imagePath) => {
  try {
    const formData = new FormData();
    formData.append("file", fs.createReadStream(imagePath));
    formData.append("userId", "66f590458326f7c16ba3e97a");

    const response = await axios.post(`${proctoringUrl}/recognize`, formData, {
      headers: {
        ...formData.getHeaders(),
      },
    });

    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 400) {
      return false;
    } else {
      console.error(`Error sending image ${imagePath}:`, error.message);
    }
  }
};

const processImages = async (timeStampImagesPath) => {
  try {
    const images = fs.readdirSync(timeStampImagesPath);
    let trueCount = 0; // Counter for successful responses

    for (const image of images) {
      const imagePath = path.join(timeStampImagesPath, image);

      if (fs.lstatSync(imagePath).isFile()) {
        const res = await sendImageForRecognition(imagePath);
        if (res === true) {
          trueCount++;
        }
      }
    }

    const totalImages = images.length;
    const score = totalImages > 0 ? (trueCount / totalImages) * 100 : 0;

    return score.toFixed(2);
  } catch (error) {
    console.error("Error processing images:", error.message);
  }
};

const Face_Recognition = {
  generateRandomTimestamps,
  captureRandomFrames,
  processImages,
};

module.exports = Face_Recognition;
