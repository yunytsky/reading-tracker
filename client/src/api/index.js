import axios from "axios";


const instance = axios.create({
    baseURL: "http://localhost:3000"
});

instance.interceptors.response.use((response) => response, (error) => {
    if(error.response.status === 401){
        //logout api call
        window.location.href = "/login";
    }
});


export const login =   (data, config) => {
    return instance.post(`/auth/log-in`, data, config);
}

export const signup =  (data, config) => {
    return instance.post(`/auth/sign-up`, data, config);
}

export const logout = (data, config) => {
    return instance.post(`/auth/log-out`, data, config);
}

//fix  userid later
export const getBooks = (config) => {
    return instance.get(`/users/1/books`, config);
}

export const getColors = (config) => {
    return instance.get(`/colors`, config);
}