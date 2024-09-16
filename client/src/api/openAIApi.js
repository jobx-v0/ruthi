import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API_URL = BACKEND_URL + "/api/openai";

export const evaluateInterview = async (authToken) => {
  return axios.get(`${API_URL}/evaluate`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });
};
