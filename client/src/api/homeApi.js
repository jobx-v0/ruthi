import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API_URL = BACKEND_URL + "/api/interview";
// const API_URL = 'https://jobx-32a058281844.herokuapp.com/api/interview';

export const fetchInterviewCountsAPI = (authToken) => {
  return axios.get(`${API_URL}/count`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });
};
