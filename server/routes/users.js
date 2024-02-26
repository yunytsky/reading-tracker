import express from "express";
import {verifyJWT} from "../middleware/auth.js";
import { addBook, deleteBook, editBook, getBook, getBooks, editBookAuthors } from "../controllers/users.js";

const router = express.Router();


router.get("/:userId/books", verifyJWT, getBooks);
router.get("/:userId/books/:bookId", verifyJWT, getBook);
router.post("/:userId/books", verifyJWT, addBook);
router.patch("/:userId/books/:bookId/edit", verifyJWT, editBook);
router.delete("/:userId/books/:bookId", verifyJWT, deleteBook);
router.patch("/:userId/books/:bookId/edit/authors", verifyJWT, editBookAuthors);

export default router;