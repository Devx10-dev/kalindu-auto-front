import axios from "axios";

const BASE_API = axios.create({
  baseURL: "https://jsonplaceholder.typicode.com",
});

const ENDPOINTS = {
  FETCH_CREDITORS: "/posts/1",
};

// get service functions

export const fetchSinglePost = async () => {
  const response = await BASE_API.get(ENDPOINTS.FETCH_CREDITORS);
  return response.data;
};

// post service functions
