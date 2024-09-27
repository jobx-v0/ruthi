import axios from "axios";

const BACKEND_URL = "http://localhost:8080";
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
