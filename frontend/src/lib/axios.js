import axios from "axios";

export const axiosInstance = axios.create({
    baseURL : "http://localhost:5001/api",
    withCredentials : true   // we want to send the cookies with every single requests
})