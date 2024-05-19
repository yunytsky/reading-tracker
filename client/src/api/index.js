import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:3000",
});

const INTERCEPTOR_401_EXCLUDED = ['/log-in'];

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response.status === 401 && !INTERCEPTOR_401_EXCLUDED.some(route => error.config.url.includes(route))) {
      try {
        const res = await instance.post(`/auth/log-out`, {}, {withCredentials: true});
        localStorage.removeItem("user");
        window.location.href = "/login";

      } catch (error) {
        
      }
  
      throw error;
    }else{
      throw error;
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
  return instance.post(`/auth/log-out`, {}, config);
};

export const verifyAccount = (data, config) => {
  return instance.patch(`/auth/verify`, data, config);
};

export const sendVerificationCode = (data, config) => {
  return instance.post(`/auth/send-verification-code`, data, config);
}

export const deleteAccount = (data, config) => {
  return instance.delete(`/auth/account`, {...config, data});
}

export const updateUserCountry = (data, config, userId) => {
  return instance.patch(`/users/${userId}/update-country`, data, config);
}

export const changeUserAvatar = (data, config, userId) => {
  return instance.patch(`/users/${userId}/change-avatar`, data, config);
}

export const changeUserPassword = (data, config) => {
  return instance.patch(`/auth/change-password`, data, config);
}

export const getBooks = (config, userId, queryString) => {
  if(queryString){
    return instance.get(`/users/${userId}/library/books/${queryString}`, config);
  }
  return instance.get(`/users/${userId}/library/books`, config);
};

export const getBook = (config, bookId, userId) => {
  return instance.get(`/users/${userId}/library/books/${bookId}`, config);
};

export const getColors = (config) => {
  return instance.get(`/colors`, config);
};

export const getAvatars = (config) => {
  return instance.get(`/avatars`, config);
};

export const addBook = (data, config, userId) => {
  return instance.post(`/users/${userId}/library/books`, data, config);
};

export const editBook = (data, config, bookId, userId) => {
  return instance.patch(`/users/${userId}/library/books/${bookId}/edit`, data, config);
};

export const getUserAuthors = (config, userId) => {
  return instance.get(`/users/${userId}/library/authors`, config);
};

export const getUserGenres = (config, userId) => {
  return instance.get(`/users/${userId}/library/genres`, config);
};

export const deleteBook = (config, bookId, userId) => {
  return instance.delete(`/users/${userId}/library/books/${bookId}`, config);
};

export const editBookAuthors = (data, config, bookId, userId) => {
  return instance.patch(`/users/${userId}/library/books/${bookId}/edit/authors`, data, config);
};

export const editBookGenres = (data, config, bookId, userId) => {
  return instance.patch(`/users/${userId}/library/books/${bookId}/edit/genres`, data, config);
};

export const deleteAuthor = (config, authorId, userId) => {
  return instance.delete(`/users/${userId}/library/authors/${authorId}/delete`, config);
};

export const deleteGenre = (config, genreId, userId) => {
  return instance.delete(`/users/${userId}/library/genres/${genreId}/delete`, config);
};

export const createAuthor = (data, config, userId) => {
  return instance.patch(`/users/${userId}/library/authors/create`, data, config);
};

export const createGenre = (data, config, userId) => {
  return instance.patch(`/users/${userId}/library/genres/create`, data, config);
};

export const editAuthor = (data, config, authorId, userId) => {
    return instance.patch(`/users/${userId}/library/authors/${authorId}/edit`, data, config);
}

export const editGenre = (data, config, genreId, userId) => {
  return instance.patch(`/users/${userId}/library/genres/${genreId}/edit`, data, config);
}

export const getBooksGenres = (config, userId) => {
  return instance.get(`/users/${userId}/library/books/genres`, config);
}

export const getYearRange = (config, userId) => {
  return instance.get(`/users/${userId}/library/books/years`, config);
}