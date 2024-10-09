const axios = require("axios");
const {
  BlobServiceClient,
  generateBlobSASQueryParameters,
  BlobSASPermissions,
} = require("@azure/storage-blob");
const { DefaultAzureCredential } = require("@azure/identity");
const ffmpeg = require("fluent-ffmpeg");
const sdk = require("microsoft-cognitiveservices-speech-sdk");
const fs = require("fs");
const path = require("path");
const InterviewService = require("./interviewService");

require("dotenv").config();

const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME;
const AZURE_STORAGE_CONNECTION_STRING =
  process.env.AZURE_STORAGE_CONNECTION_STRING;
const credential = new DefaultAzureCredential();

class AzureServiceError extends Error {
  constructor(message, code) {
    super(message);
    this.name = "AzureServiceError";
    this.code = code;
  }
}

const downloadBlob = async (sasUrl, downloadFilePath) => {
  try {
    const response = await axios.get(sasUrl, { responseType: "stream" });
    const writer = fs.createWriteStream(downloadFilePath);
    response.data.pipe(writer);
    await new Promise((resolve, reject) => {
      writer.on("finish", resolve);
      writer.on("error", reject);
    });
  } catch (error) {
    throw new AzureServiceError(
      `Failed to download blob: ${error.message}`,
      "DOWNLOAD_ERROR"
    );
  }
};

const extractAudio = (videoPath, audioPath) => {
  return new Promise((resolve, reject) => {
    ffmpeg(videoPath)
      .output(audioPath)
      .noVideo()
      .on("end", () => {
        console.log("Audio extracted successfully");
        resolve();
      })
      .on("error", (err) => {
        console.error("FFmpeg error:", err.message);
        console.error("FFmpeg stderr:", stderr);
        reject(
          new AzureServiceError(
            `Failed to extract audio: ${err.message}\nStderr: ${stderr}`,
            "EXTRACTION_ERROR"
          )
        );
      })
      .run();
  });
};

const transcribeAudio = async (audioPath) => {
  const subscriptionKey = process.env.AZURE_SPEECH_KEY;
  const serviceRegion = process.env.AZURE_SPEECH_REGION;

  if (!subscriptionKey || !serviceRegion) {
    throw new AzureServiceError(
      "Azure Speech Service credentials are missing",
      "CREDENTIALS_ERROR"
    );
  }

  console.log(`Starting transcription of audio file: ${audioPath}`);

  try {
    const audioConfig = sdk.AudioConfig.fromWavFileInput(
      fs.readFileSync(audioPath)
    );
    const speechConfig = sdk.SpeechConfig.fromSubscription(
      subscriptionKey,
      serviceRegion
    );
    speechConfig.speechRecognitionLanguage = "en-US";

    const recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);

    return new Promise((resolve, reject) => {
      let transcription = "";

      recognizer.recognizing = (s, e) => {
        // console.log(`RECOGNIZING: Text=${e.result.text}`);
      };

      recognizer.recognized = (s, e) => {
        if (e.result.reason === sdk.ResultReason.RecognizedSpeech) {
          // console.log(`RECOGNIZED: Text=${e.result.text}`);
          transcription += `${e.result.text} `;
        } else if (e.result.reason === sdk.ResultReason.NoMatch) {
          console.log("NOMATCH: Speech could not be recognized.");
        }
      };

      recognizer.canceled = (s, e) => {
        console.log(`CANCELED: Reason=${e.reason}`);
        if (e.reason === sdk.CancellationReason.Error) {
          reject(
            new AzureServiceError(
              `Transcription error: ${e.errorDetails}`,
              "TRANSCRIPTION_ERROR"
            )
          );
        }
        recognizer.stopContinuousRecognitionAsync();
      };

      recognizer.sessionStopped = (s, e) => {
        console.log("Session stopped event.");
        recognizer.stopContinuousRecognitionAsync(() => {
          console.log("Final transcription:", transcription.trim());
          resolve(transcription.trim());
        });
      };

      recognizer.startContinuousRecognitionAsync(
        () => {
          console.log("Recognition started");
        },
        (err) => {
          console.error("Error starting recognition:", err);
          reject(
            new AzureServiceError(
              `Failed to start recognition: ${err}`,
              "RECOGNITION_START_ERROR"
            )
          );
        }
      );
    });
  } catch (error) {
    console.error("Error in transcribeAudio:", error);
    throw new AzureServiceError(
      `Failed to transcribe audio: ${error.message}`,
      "TRANSCRIPTION_ERROR"
    );
  }
};

const uploadBlob = async (sasUrl, content) => {
  try {
    await axios.put(sasUrl, content, {
      headers: {
        "x-ms-blob-type": "BlockBlob",
        "Content-Type": "text/plain",
      },
    });
    console.log(`Uploaded text blob successfully`);
  } catch (error) {
    throw new AzureServiceError(
      `Failed to upload blob: ${error.message}`,
      "UPLOAD_ERROR"
    );
  }
};

const generateSasTokenForBlob = async (blobName) => {
  try {
    const blobServiceClient = new BlobServiceClient(
      `https://${accountName}.blob.core.windows.net`,
      credential
    );
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blobClient = containerClient.getBlobClient(blobName);

    const startsOn = new Date();
    const expiresOn = new Date(startsOn);
    expiresOn.setHours(expiresOn.getHours() + 1);

    const userDelegationKey = await blobServiceClient.getUserDelegationKey(
      startsOn,
      expiresOn
    );

    const sasOptions = {
      containerName,
      permissions: BlobSASPermissions.parse("rw"),
      startsOn,
      expiresOn,
    };

    const sasToken = generateBlobSASQueryParameters(
      sasOptions,
      userDelegationKey,
      accountName
    ).toString();
    return `${blobClient.url}?${sasToken}`;
  } catch (error) {
    throw new AzureServiceError(
      `Failed to generate SAS token: ${error.message}`,
      "SAS_TOKEN_ERROR"
    );
  }
};

const processVideo = async (userId, jobId, questionId) => {
  const videoBlobName = `${userId}/${jobId}/${questionId}.webm`;
  const videoFilePath = path.join(__dirname, "video.webm");
  const audioFilePath = path.join(__dirname, "audio.wav");
  // const transcriptBlobName = `${userId}/${jobId}/${questionId}.txt`;

  try {
    console.log("Processing video...");

    const transcriptionExists =
      await InterviewService.checkExistingTranscription(
        userId,
        jobId,
        questionId
      );

    if (transcriptionExists) {
      console.log("Transcription already exists");
      return;
    }
    const videoSasUrl = await generateSasTokenForBlob(videoBlobName);
    console.log("Generated SAS URL:", videoSasUrl);
    await downloadBlob(videoSasUrl, videoFilePath);
    console.log("Downloaded video file successfully");
    await extractAudio(videoFilePath, audioFilePath);
    console.log("Extracted audio file successfully");
    const transcription = await transcribeAudio(audioFilePath);
    console.log("Transcribed audio file successfully");
    // const transcriptSasUrl = await generateSasTokenForBlob(
    //   userId,
    //   transcriptBlobName
    // );
    // await uploadBlob(transcriptSasUrl, transcription);
    await InterviewService.updateAnswer(
      userId,
      jobId,
      questionId,
      transcription
    );
    console.log("Updated answer successfully");
  } catch (error) {
    throw new AzureServiceError(
      `Failed to process video: ${error.message}`,
      "PROCESS_VIDEO_ERROR"
    );
  } finally {
    if (fs.existsSync(videoFilePath)) {
      fs.unlinkSync(videoFilePath);
    }
    if (fs.existsSync(audioFilePath)) {
      fs.unlinkSync(audioFilePath);
    }
  }
};

const processVideoForAllQuestions = async (userId, jobId) => {
  try {
    const questionIds = await InterviewService.getQuestionIds(userId, jobId);
    for (const questionId of questionIds) {
      console.log("Processing question:", questionId);
      await processVideo(userId, jobId, questionId);
    }
  } catch (error) {
    throw new AzureServiceError(
      `Failed to process videos for all questions: ${error.message}`,
      "PROCESS_ALL_VIDEOS_ERROR"
    );
  }
};

let blobServiceClient;

if (process.env.AZURE_STORAGE_CONNECTION_STRING) {
  // Use the connection string if available
  blobServiceClient = BlobServiceClient.fromConnectionString(
    process.env.AZURE_STORAGE_CONNECTION_STRING
  );
  console.log("Using connection string for BlobServiceClient.");
} else if (accountName) {
  // Use DefaultAzureCredential if the connection string is not available
  const credential = new DefaultAzureCredential();
  blobServiceClient = new BlobServiceClient(
    `https://${accountName}.blob.core.windows.net`,
    credential
  );
  console.log("Using DefaultAzureCredential for BlobServiceClient.");
} else {
  throw new Error(
    "Neither AZURE_STORAGE_CONNECTION_STRING nor AZURE_STORAGE_ACCOUNT_NAME is set."
  );
}
// Fetch chunks from Azure Blob Storage
const fetchChunksFromAzure = async (prefix) => {
  const containerClient = blobServiceClient.getContainerClient(containerName);
  let blobs = [];
  for await (const blob of containerClient.listBlobsFlat({ prefix })) {
    blobs.push(blob.name);
  }
  return blobs;
};

// Download each chunk from Azure
const downloadChunk = async (blobName, localPath) => {
  const containerClient = blobServiceClient.getContainerClient(containerName);
  const blobClient = containerClient.getBlobClient(blobName);
  const downloadBlockBlobResponse = await blobClient.download(0);
  const writeStream = fs.createWriteStream(localPath);
  await new Promise((resolve, reject) => {
    downloadBlockBlobResponse.readableStreamBody.pipe(writeStream);
    downloadBlockBlobResponse.readableStreamBody.on("end", resolve);
    downloadBlockBlobResponse.readableStreamBody.on("error", reject);
  });
};

// Ensure directory exists
const ensureDirectoryExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

// Combine chunks into one video
const combineChunks = (chunkPaths, outputFilePath) => {
  return new Promise((resolve, reject) => {
    const writeStream = fs.createWriteStream(outputFilePath);

    chunkPaths.forEach((chunkPath) => {
      if (fs.existsSync(chunkPath)) {
        const data = fs.readFileSync(chunkPath);
        writeStream.write(data);
      } else {
        console.error(`Chunk file not found: ${chunkPath}`);
      }
    });

    writeStream.end();

    writeStream.on("finish", () => {
      resolve();
    });

    writeStream.on("error", (err) => {
      reject(`Error combining chunks: ${err.message}`);
    });
  });
};

// Upload final video to Azure Blob Storage
const uploadFinalVideoToAzure = async (videoPath, videoName) => {
  console.log("Uploading video to Azure storage cloud...");

  const containerClient = blobServiceClient.getContainerClient(containerName);
  const blockBlobClient = containerClient.getBlockBlobClient(videoName);
  const uploadBlobResponse = await blockBlobClient.uploadFile(videoPath);
  console.log("Final video uploaded to Azure:", uploadBlobResponse.requestId);
};

// Delete chunks from Azure Blob Storage
const deleteChunksFromAzure = async (chunks) => {
  console.log("Deleting chunks from the Azure cloud storage...");

  const containerClient = blobServiceClient.getContainerClient(containerName);
  for (const chunk of chunks) {
    const blockBlobClient = containerClient.getBlockBlobClient(chunk);
    await blockBlobClient.delete();
    console.log(`Deleted chunk: ${chunk}`);
  }
};

const getChunks = async (userId, jobId, questionId) => {
  const chunks = await fetchChunksFromAzure(
    `${userId}/${jobId}/${questionId}`.toString()
  );

  if (chunks.length === 0) {
    console.log(`No chunks found for question ${questionId}.`);
  } else {
    console.log(`Got Chunks for questionId ${questionId}:`, chunks.length);
    return chunks;
  }
};

const deleteChunksFromLocalDir = async (
  chunkPaths,
  userId,
  jobId,
  questionId
) => {
  chunkPaths.forEach((chunkPath) => {
    try {
      fs.unlinkSync(chunkPath);
    } catch (err) {
      console.error(`Error deleting chunk ${chunkPath}:`, err);
    }
  });

  const questionDir = path.join(
    __dirname,
    "tempChunks",
    userId,
    jobId,
    questionId
  );
  const jobDir = path.join(__dirname, "tempChunks", userId, jobId);

  try {
    fs.rmSync(questionDir, { recursive: true, force: true });
  } catch (err) {
    console.error(`Error deleting questionId directory ${questionDir}:`, err);
  }

  if (fs.existsSync(jobDir) && fs.readdirSync(jobDir).length === 0) {
    try {
      fs.rmSync(jobDir, { recursive: true, force: true });
    } catch (err) {
      console.error(`Error deleting jobId directory ${jobDir}:`, err);
    }
  }

  console.log("Directories cleaned up.");
};

// Download all chunks and save them locally in the proper directory
const combineAllChunksInToOneVideo = async (userId, jobId, questionId) => {
  const chunks = await getChunks(userId, jobId, questionId);

  const tempDir = path.join(__dirname, "tempChunks", userId, jobId, questionId);

  ensureDirectoryExists(tempDir);

  const chunkPaths = [];
  for (const chunk of chunks) {
    const localPath = path.join(__dirname, "tempChunks", chunk);
    await downloadChunk(chunk, localPath);
    chunkPaths.push(localPath);
  }

  const combinedVideoName = `${userId}${jobId}${questionId}.webm`;
  const combinedVideoPath = path.join(tempDir, combinedVideoName);
  const audioPath = path.join(tempDir, `${userId}${jobId}${questionId}.wav`);

  combineChunks(chunkPaths, combinedVideoPath);
  console.log("Video chunks combined.");

  await new Promise((resolve) => setTimeout(resolve, 5000));

  if (!fs.existsSync(combinedVideoPath)) {
    throw new Error(
      `Error combining video: ${combinedVideoPath} does not exist.`
    );
  }

  console.log(combinedVideoPath);

  await extractAudio(combinedVideoPath, audioPath);

  const transcription = await transcribeAudio(audioPath);

  await InterviewService.updateAnswer(
    userId,
    jobId,
    questionId,
    transcription.toString().trim()
  );
  console.log("Updated answer in DB successfully");

  await uploadFinalVideoToAzure(
    combinedVideoPath,
    `${userId}/${jobId}/${questionId}/${combinedVideoName}`
  );

  await deleteChunksFromAzure(chunks);

  await new Promise((resolve) => setTimeout(resolve, 2000));

  await deleteChunksFromLocalDir(chunkPaths, userId, jobId, questionId);

  return transcription.toString().trim();
};

const AzureService = {
  generateSasTokenForBlob,
  processVideo,
  processVideoForAllQuestions,
  fetchChunksFromAzure,
  downloadChunk,
  combineAllChunksInToOneVideo,
  extractAudio,
  transcribeAudio,
};

module.exports = AzureService;
