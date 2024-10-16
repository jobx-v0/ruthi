import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API_URL = BACKEND_URL + "/api/azure";

export const transcribeInterviewAPI = async (authToken, userId, jobId) => {
  return axios.post(`${API_URL}/transcribe`, {
    body: {
      userId: userId,
      jobId: jobId,
    },
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });
};

export const getSasURL = async (
  authToken,
  userId,
  jobId,
  questionId,
  chunkNumber
) => {
  return axios.get(
    `${API_URL}/sas/${userId}/${jobId}/${questionId}/${chunkNumber}`,
    {
      body: {
        userId,
        jobId,
        questionId,
        chunkNumber,
      },
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    }
  );
};

export const uploadChunkToAzureAPI = async (sasUrl, blob) => {
  return await axios.put(sasUrl, blob, {
    headers: {
      "x-ms-blob-type": "BlockBlob",
    },
  });
};
