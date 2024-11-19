import axios from "axios";

//const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
//const API_URL = BACKEND_URL + "/api/job";
const API_URL = process.env.REACT_APP_BACKEND_URL + "/api";
export const fetchJobsAPI = async (
  authToken,
  searchQuery = "",
  page = 1,
  limit = 10
) => {
  try {
    const response = await axios.get(`${API_URL}/jobs`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
      params: {
        search: searchQuery,
        page: page,
        limit: limit,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching jobs:", error);
    throw error;
  }
};
// To featch all the job by id.

export const fetchJobByIdAPI = async (authToken, id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching job by ID:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

export const addJobAPI = async (authToken, newJobData) => {
  try {
    await axios.post(`${API_URL}/postjob`, newJobData, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
  } catch (error) {
    console.error("Error adding job:", error);
    throw error;
  }
};

export const updateJobAPI = async (authToken, id, updatedJobData) => {
  try {
    await axios.put(`${API_URL}/jobs/${id}`, updatedJobData, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
  } catch (error) {
    console.error("Error updating job:", error);
    throw error;
  }
};

export const deleteJobAPI = async (authToken, id) => {
  try {
    await axios.delete(`${API_URL}/jobs/${id}`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
  } catch (error) {
    console.error("Error deleting job:", error);
    throw error;
  }
};
