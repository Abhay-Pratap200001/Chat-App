import axios from 'axios'

export const axiosInstance = axios.create({
    baseURL: import.meta.env.MODE === "development" ? "http://localhost:7000/api" : "/api",
    withCredentials: true
})


export const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:7000":"/"