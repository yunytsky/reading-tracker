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
export const getBooks = (config, queryString) => {
  if(queryString){
    return instance.get(`/users/1/books/${queryString}`, config);
  }
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

export const getUserGenres = (config) => {
  return instance.get(`/users/1/genres`, config);
};
//fix userId
export const deleteBook = (config, bookId) => {
  return instance.delete(`/users/1/books/${bookId}`, config);
};

export const editBookAuthors = (data, config, bookId) => {
  return instance.patch(`/users/1/books/${bookId}/edit/authors`, data, config);
};

export const editBookGenres = (data, config, bookId) => {
  return instance.patch(`/users/1/books/${bookId}/edit/genres`, data, config);
};

export const deleteAuthor = (config, authorId) => {
  return instance.delete(`/users/1/authors/${authorId}/delete`, config);
};

export const deleteGenre = (config, genreId) => {
  return instance.delete(`/users/1/genres/${genreId}/delete`, config);
};

export const createAuthor = (data, config) => {
  return instance.patch(`/users/1/authors/create`, data, config);
};

export const createGenre = (data, config) => {
  return instance.patch(`/users/1/genres/create`, data, config);
};


export const editAuthor = (data, config, authorId) => {
    return instance.patch(`/users/1/authors/${authorId}/edit`, data, config);
}

export const editGenre = (data, config, genreId) => {
  return instance.patch(`/users/1/genres/${genreId}/edit`, data, config);
}

export const getBooksGenres = (config) => {
  return instance.get(`/users/1/books/genres`, config);
}

export const getYearRange = (config) => {
  return instance.get(`/users/1/books/years`, config);
}