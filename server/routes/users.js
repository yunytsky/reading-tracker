import express from "express";
import {verifyJWT} from "../middleware/auth.js";
import { addBook, deleteBook, editBook, getBook, getBooks, editBookAuthors, getAuthors, deleteAuthor, createAuthor, editAuthor } from "../controllers/users.js";

const router = express.Router();


router.get("/:userId/books", verifyJWT, getBooks);
router.get("/:userId/books/:bookId", verifyJWT, getBook);
router.get("/:userId/authors", verifyJWT, getAuthors);

router.post("/:userId/books", verifyJWT, addBook);

router.patch("/:userId/books/:bookId/edit", verifyJWT, editBook);
router.patch("/:userId/books/:bookId/edit/authors", verifyJWT, editBookAuthors);
router.patch("/:userId/authors/create", verifyJWT, createAuthor)
router.patch("/:userId/authors/:authorId/edit", verifyJWT, editAuthor)

router.delete("/:userId/authors/:authorId/delete", verifyJWT, deleteAuthor);
router.delete("/:userId/books/:bookId", verifyJWT, deleteBook);

export default router;