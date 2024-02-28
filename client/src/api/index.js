import axios from "axios";

const apiBaseURL = "http://localhost:3000"

export const login = (data, config) => {
    return axios.post(`${apiBaseURL}/auth/log-in`, data, config);
}

export const signup = async (data, config) => {
    const res = await axios.post(`${apiBaseURL}/auth/sign-up`, data, config);
    return res.data;
}

export const logout = async(data, config) => {
    const res = await axios.post(`${apiBaseURL}/auth/log-out`, data, config);
    return res.data; 
}

//fix  userid later
export const getBooks = async(data, config) => {
    const res = await axios.post(`${apiBaseURL}/1/books`, data, config);
    return res.data; 
}