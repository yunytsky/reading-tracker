import express from "express";
import {verifyJWT} from "../middleware/auth.js";
import { addBook, deleteBook, getYearRange, editBook, getBook, deleteGenre, getBooks, editGenre, editBookAuthors, editBookGenres, createGenre, getAuthors, deleteAuthor, createAuthor, editAuthor, getGenres, getBooksGenres } from "../controllers/library.js";

const router = express.Router({mergeParams: true});

router.get("/books", verifyJWT, getBooks);
router.get("/books/years", verifyJWT, getYearRange);
router.get("/books/genres", verifyJWT, getBooksGenres)
router.get("/books/:bookId", verifyJWT, getBook);
router.get("/authors", verifyJWT, getAuthors);
router.get("/genres", verifyJWT, getGenres);

router.post("/books", verifyJWT, addBook);

router.patch("/books/:bookId/edit", verifyJWT, editBook);
router.patch("/books/:bookId/edit/authors", verifyJWT, editBookAuthors);
router.patch("/books/:bookId/edit/genres", verifyJWT, editBookGenres);
router.patch("/authors/create", verifyJWT, createAuthor)
router.patch("/genres/create", verifyJWT, createGenre)
router.patch("/authors/:authorId/edit", verifyJWT, editAuthor)
router.patch("/genres/:genreId/edit", verifyJWT, editGenre)

router.delete("/authors/:authorId/delete", verifyJWT, deleteAuthor);
router.delete("/genres/:genreId/delete", verifyJWT, deleteGenre);
router.delete("/books/:bookId", verifyJWT, deleteBook);

export default router;