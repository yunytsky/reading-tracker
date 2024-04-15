import express from "express";
import {verifyJWT} from "../middleware/auth.js";
import { addBook, deleteBook, getYearRange, editBook, getBook, deleteGenre, getBooks, editGenre, editBookAuthors, editBookGenres, createGenre, getAuthors, deleteAuthor, createAuthor, editAuthor, getGenres, getBooksGenres } from "../controllers/users.js";

const router = express.Router();


router.get("/:userId/books", verifyJWT, getBooks);
// router.get("/:userId/books?filtered=true&filter_name=years&years=2022", verifyJWT);

router.get("/:userId/books/years", verifyJWT, getYearRange);

router.get("/:userId/books/genres", verifyJWT, getBooksGenres)
router.get("/:userId/books/:bookId", verifyJWT, getBook);
router.get("/:userId/authors", verifyJWT, getAuthors);
router.get("/:userId/genres", verifyJWT, getGenres);

router.post("/:userId/books", verifyJWT, addBook);

router.patch("/:userId/books/:bookId/edit", verifyJWT, editBook);
router.patch("/:userId/books/:bookId/edit/authors", verifyJWT, editBookAuthors);
router.patch("/:userId/books/:bookId/edit/genres", verifyJWT, editBookGenres);
router.patch("/:userId/authors/create", verifyJWT, createAuthor)
router.patch("/:userId/genres/create", verifyJWT, createGenre)
router.patch("/:userId/authors/:authorId/edit", verifyJWT, editAuthor)
router.patch("/:userId/genres/:genreId/edit", verifyJWT, editGenre)

router.delete("/:userId/authors/:authorId/delete", verifyJWT, deleteAuthor);
router.delete("/:userId/genres/:genreId/delete", verifyJWT, deleteGenre);
router.delete("/:userId/books/:bookId", verifyJWT, deleteBook);

export default router;