import pool from "./config.js"

export function findByUsername(username) {
    return pool.execute(`
        SELECT * FROM users
        WHERE username = ?
    `, [username]);
}

export function findByEmail(email) {
    return pool.execute(`
        SELECT * FROM users
        WHERE email = ?
    `,[email]);
}

export  function createUser(email, username, country, password) {
    return pool.execute(`
        INSERT INTO users (email, username, country, password) 
        VALUES (?, ?, ?, ?)
    `, [email, username, country, password]);
}

export function getUserAuthors(userId) {
    return pool.execute(`
        SELECT * FROM authors 
        WHERE userId = ?
    `, [userId]);
}

export function getUserBooks(userId) {
    return pool.execute(`
        SELECT * FROM books 
        WHERE userId = ?
    `, [userId]);
}

export function getUserBook(userId, bookId) {
    return pool.execute(`
        SELECT * FROM books 
        WHERE userId = ? AND bookId = ?
    `, [userId, bookId]);
}

export async function getBookAuthors(bookId) {
    const [bookAuthors] = await pool.execute(`
        SELECT * FROM bookauthors 
        WHERE bookId = ?
    `, [bookId]);

    const authorIds = bookAuthors.map(bookAuthor => bookAuthor.authorId);
    const placeholders = authorIds.map(() => '?').join(', ');

    return await pool.execute(`
        SELECT * FROM authors 
        WHERE authorId IN (${placeholders})
    `, authorIds);
}

export async function getBookGenres(bookId) {
    const [bookGenres] = await pool.execute(`
        SELECT * FROM bookgenres 
        WHERE bookId = ?
    `, [bookId]);

    const genreIds = bookGenres.map(bookGenre => bookGenre.genreId);
    const placeholders = genreIds.map(() => '?').join(', ');

    return await pool.execute(`
        SELECT * FROM genres 
        WHERE genreId IN (${placeholders})
    `, genreIds);
}

export function getUserGenres(userId) {
    return pool.execute(`
        SELECT * FROM genres 
        WHERE userId = ?
    `, [userId]);
}

export function addBookEntry(userId, name) {
    return pool.execute(`
        INSERT INTO books (userId, name)
        VALUES(?, ?)
    `, [userId, name]);
}

export function editBookEntry(column, value, bookId) {
    return pool.execute(`
        UPDATE books
        SET ${column} = ?
        WHERE bookId = ?
    `, [value, bookId]);
}

export function addBookAuthor(bookId, authorId) {
    return pool.execute(`
        INSERT INTO bookauthors
        VALUES(?, ?)
    `, [bookId, authorId]);
}

export function deleteBookAuthor(bookId) {
    return pool.execute(`
        DELETE *  FROM bookauthors
        WHERE bookId = ?
    `, [bookId]);
}

export function getBookOwner(bookId) {
    return pool.execute(`
        SELECT userId FROM books
        WHERE bookId = ?
    `, [bookId]);
}

export function deleteBookEntry(bookId) {
    return pool.execute(`
        DELETE FROM books 
        WHERE bookId = ?
    `, [bookId]);
}

export function getColors() {
    return pool.execute(`
        SELECT * FROM colors;
    `);
}