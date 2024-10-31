const path = require("path");
const fs = require("fs");
const AzureService = require("../services/azureService");

const handleError = (res, error) => {
  console.error("Error:", error);
  const statusCode = error.name === "AzureServiceError" ? 500 : 400;
  res.status(statusCode).json({
    message: error.message,
    code: error.code || "UNKNOWN_ERROR",
  });
};

const handleTranscriptionForAllQuestions = async (req, res) => {
  const { user_id, job_id } = req.body;
  try {
    await AzureService.processVideoForAllQuestions(user_id, job_id);
    res
      .status(200)
      .json({ message: "Transcription process completed successfully." });
  } catch (error) {
    handleError(res, error);
  }
};

const handleTranscriptionForOneQuestion = async (req, res) => {
  const { userId, jobId, questionId } = req.body;
  try {
    await AzureService.processVideo(userId, jobId, questionId);
    res
      .status(200)
      .json({ message: "Transcription process completed successfully." });
  } catch (error) {
    handleError(res, error);
  }
};

const generateSasToken = async (req, res) => {
  const { userId, jobId, interviewId, questionId, chunkNo } = req.params;
  try {
    const sasUrl = await AzureService.generateSasTokenForBlob(
      `${userId}/${jobId}/${interviewId}/${questionId}/${chunkNo}.webm`
    );
    res.json({ sasUrl });
  } catch (error) {
    handleError(res, error);
  }
};

const generateSasTokenForUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const sasUrl = await AzureService.generateSasTokenForBlob(
      `${userId}/resume.pdf`
    );
    res.json({ sasUrl });
  } catch (error) {
    handleError(res, error);
  }
};

const downloadAudio = async (req, res) => {
  const audioFilePath = path.join(__dirname, "audio.wav");
  try {
    await res.download(audioFilePath, "audio.wav");
  } catch (error) {
    handleError(res, error);
  }
};

const combineVideo = async (req, res) => {
  const { userId, jobId, questionId } = req.body;

  try {
    // Fetch all chunks from Azure
    // const chunks = await AzureService.fetchChunksFromAzure(
    //   `${userId}/${jobId}/${questionId}`.toString()
    // ); // working verified
    // if (chunks.length === 0) {
    //   return res.status(404).json({ message: "No chunks found." });
    // }

    // console.log(chunks);

    // Download chunks to local temp directory
    await AzureService.combineAllChunksInToOneVideo(userId, jobId, questionId); // working verified

    // // Combine chunks into a single video file
    // const combinedVideoPath = path.join(tempDir, outputVideoName);
    // combineChunks(chunkPaths, combinedVideoPath);
    // console.log("Video chunks combined.");

    // // Upload the combined video back to Azure
    // await uploadFinalVideoToAzure(combinedVideoPath, outputVideoName);

    // // Delete the chunks from Azure
    // await deleteChunksFromAzure(chunks);

    // // Clean up local chunk files
    // chunkPaths.forEach((chunkPath) => fs.unlinkSync(chunkPath));

    res.json({ message: "Video combined and uploaded successfully!" });
  } catch (error) {
    console.error("Error combining video:", error);
    res.status(500).json({ error: "An error occurred while combining video." });
  }
};

const AzureController = {
  generateSasToken,
  generateSasTokenForUser,
  handleTranscriptionForOneQuestion,
  handleTranscriptionForAllQuestions,
  downloadAudio,
  combineVideo,
};

module.exports = AzureController;
