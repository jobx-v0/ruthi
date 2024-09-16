import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API_URL = BACKEND_URL + "/api/interview";

export const fetchQuestionsAPI = async (authToken) => {
  return axios.get(`${API_URL}/questions`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });
};

export const createInterviewAPI = async (
  authToken,
  userId,
  jobId,
  questionIds
) => {
  return axios.post(
    `${API_URL}/create-interview`,
    { user_id: userId, job_id: jobId, question_ids: questionIds },
    {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    }
  );
};

export const submitInterviewAPI = async (authToken, userId, jobId) => {
  return axios.post(
    `${API_URL}/submit-interview`,
    { userId, jobId },
    {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    }
  );
};
