import axios from "axios"

// TODO : If this file got larger make separate files for the ENDPOINTS

const BASE_API = axios.create({
    baseURL : "http://localhost:8090/creditor"
})

// ======================================== ENDPOINTS =============================================

const ENDPOINTS = {
    FETCH_CREDITORS : ""
}

// ================================= GET SERVICE FUNCTIONS ========================================

export const fetchCreditorData = async () => {
 const response = await BASE_API.get(ENDPOINTS.FETCH_CREDITORS);
 return response.data;
}

// ================================= POST SERVICE FUNCTIONS ========================================


