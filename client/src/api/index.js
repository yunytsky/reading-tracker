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

export const logout = (config) => {
    return instance.post(`/auth/log-out`, config);
}

//fix  userid later
export const getBooks = (config) => {
    return instance.get(`/users/1/books`, config);
}
//fix  userid later
export const getBook = (config, bookId) => {
    return instance.get(`/users/1/books/${bookId}`, config);
}

export const getColors = (config) => {
    return instance.get(`/colors`, config);
}

//fix  userid later
export const addBook = (data, config) => {
    return instance.post(`/users/1/books`, data, config);
}