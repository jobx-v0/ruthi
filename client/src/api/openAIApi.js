import axios from "axios";

const BACKEND_URL = "http://localhost:8080";
const API_URL = BACKEND_URL + "/api/openai";

export const evaluateInterview = async (authToken) => {
  return axios.get(`${API_URL}/evaluate`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });
};
