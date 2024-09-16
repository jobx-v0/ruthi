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
