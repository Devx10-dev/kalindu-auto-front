import axios from "axios"

// TODO : If this file got larger make separate files for the ENDPOINTS

const BASE_API = axios.create({
    baseURL : "https://jsonplaceholder.typicode.com"
})

// ======================================== ENDPOINTS =============================================

const ENDPOINTS = {
    FETCH_CREDITORS : "/posts/1"
}

// ================================= GET SERVICE FUNCTIONS ========================================

export const fetchSinglePost = async () => {
 const response = await BASE_API.get(ENDPOINTS.FETCH_CREDITORS);
 return response.data;
}

// ================================= POST SERVICE FUNCTIONS ========================================


