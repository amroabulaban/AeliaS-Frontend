import axios from "axios";

//best practice to be in a constants file but no need for now
const BASE_URL = "http://localhost:8000";
const commInstance = axios.create({
  baseURL: BASE_URL,
});

// Get a list of all users.
export const getUsers = async () => {
  try {
    const response = await commInstance.get("/");
    return response.data;
  } catch (error) {
    return error;
  }
};

//Get a single user by ID.
export const getUserById = async (id) => {
  try {
    const response = await commInstance.get(`/users/${id}`);
    return response.data;
  } catch (error) {
    return error;
  }
};

//Create a new user.
export const createUser = async (data) => {
  try {
    const response = await commInstance.post("/users", data);
    return response;
  } catch (error) {
    return error;
  }
};

//Update an existing user.
export const updateUser = async (id, data) => {
  try {
    const response = await commInstance.put(`/users/${id}`, data);
    return response.data;
  } catch (error) {
    return error;
  }
};

//Delete a user.
export const deleteUser = async (id) => {
  try {
    const response = await commInstance.delete(`/users/${id}`);
    return response.data;
  } catch (error) {
    return error;
  }
};
