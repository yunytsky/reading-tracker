import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:3000",
});

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 401) {
      //logout api call
      window.location.href = "/login";
    }
  }
);

export const login = (data, config) => {
  return instance.post(`/auth/log-in`, data, config);
};

export const signup = (data, config) => {
  return instance.post(`/auth/sign-up`, data, config);
};

export const logout = (config) => {
  return instance.post(`/auth/log-out`, config);
};

//fix  userid later
export const getBooks = (config) => {
  return instance.get(`/users/1/books`, config);
};
//fix  userid later
export const getBook = (config, bookId) => {
  return instance.get(`/users/1/books/${bookId}`, config);
};

export const getColors = (config) => {
  return instance.get(`/colors`, config);
};

//fix  userid later
export const addBook = (data, config) => {
  return instance.post(`/users/1/books`, data, config);
};

//fix userId a
export const editBook = (data, config, bookId) => {
  return instance.patch(`/users/1/books/${bookId}/edit`, data, config);
};

//fix  userid later
export const getUserAuthors = (config) => {
  return instance.get(`/users/1/authors`, config);
};
//fix userId
export const deleteBook = (config, bookId) => {
  return instance.delete(`/users/1/books/${bookId}`, config);
};

export const editBookAuthors = (data, config, bookId) => {
  return instance.patch(`/users/1/books/${bookId}/edit/authors`, data, config);
};

export const deleteAuthor = (config, authorId) => {
  return instance.delete(`/users/1/authors/${authorId}/delete`, config);
};

export const createAuthor = (data, config) => {
  return instance.patch(`/users/1/authors/create`, data, config);
};

export const editAuthor = (data, config, authorId) => {
    return instance.patch(`/users/1/authors/${authorId}/edit`, data, config);
}