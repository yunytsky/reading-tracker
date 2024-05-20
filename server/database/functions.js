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

export function findById(userId) {
    return pool.execute(`
        SELECT * FROM users
        WHERE userId = ?
    `, [userId]);
}

export  function createUser(email, username, country, password) {
    return pool.execute(`
        INSERT INTO users (email, username, country, password) 
        VALUES (?, ?, ?, ?)
    `, [email, username, country, password]);
}

export function changeUserPassword(password, userId) {
    return pool.execute(`
    UPDATE users
    SET password = ?
    WHERE userId = ?
`, [password, userId]);
}


export function changeUserCountry(country, userId) {
    return pool.execute(`
    UPDATE users
    SET country = ?
    WHERE userId = ?
`, [country, userId]);
}

export function changeUserAvatar(avatarId, userId) {
    return pool.execute(`
    UPDATE users
    SET avatarId = ?
    WHERE userId = ?
`, [avatarId, userId]);    
}

export function getUserAuthors(userId) {
    return pool.execute(`
        SELECT * FROM authors 
        WHERE userId = ?
    `, [userId]);
}

export function addUserAuthor(authorName, userId) {
    return pool.execute(`
        INSERT INTO authors(name, userId)
        VALUES(?,?)
    `, [authorName, userId]);
};

export function addUserGenre(genreName, userId) {
    return pool.execute(`
        INSERT INTO genres(name, userId)
        VALUES(?,?)
    `, [genreName, userId]);
};

export function deleteUserAuthor(authorId, userId) {
    return pool.execute(`
        DELETE FROM authors
        WHERE authorId = ? AND userId = ?
    `, [authorId, userId]);
}

export function deleteUserGenre(genreId, userId) {
    return pool.execute(`
        DELETE FROM genres
        WHERE genreId = ? AND userId = ?
    `, [genreId, userId]);
}

export function editUserAuthor(column, value, authorId, userId) {
    return pool.execute(`
        UPDATE authors
        SET ${column} = ?
        WHERE authorId = ? AND userId = ?
    `, [value, authorId, userId]);
}

export function editUserGenre(column, value, genreId, userId) {
    return pool.execute(`
        UPDATE genres
        SET ${column} = ?
        WHERE genreId = ? AND userId = ?
    `, [value, genreId, userId]);
}

export function getUserBooks(userId, filter) {
    if (filter) {
        let filterString = "";
        let filterValues = [];

        const filterNames = Object.keys(filter);
        
        for (let i = 1; i < filterNames.length; i++) {
            const filterName = filterNames[i];
            const value = filter[filterName];
            if(!value){
                filterString += `AND ${filterName} IS NULL `;
            }else{
                const valuesArray = value.split(",").map(value => value.trim()); 
                const placeholders = valuesArray.map(() => '?').join(', '); // Create placeholders for each value    
                filterString += `AND ${filterName} IN (${placeholders}) `;
                filterValues.push(...valuesArray)
            }

        }

        return pool.execute(`
            SELECT * FROM books 
            WHERE userId = ? ${filterString}
        `, [userId, ...filterValues]);
    }

    return pool.execute(`
        SELECT * FROM books 
        WHERE userId = ?
    `, [userId]);
}

// export function getBooks(bookIds){
//     const placeholders = authorIds.map(() => '?').join(', ');

//     return pool.execute(`
//     SELECT * FROM books 
//     WHERE bookId IN ${placeholders} 
// `, bookIds);
// }

export function getUserBook(userId, bookId) {
    return pool.execute(`
        SELECT * FROM books 
        WHERE userId = ? AND bookId = ?
    `, [userId, bookId]);
}

export async function getBookEntryAuthors(bookId) {
    const [bookAuthors] = await pool.execute(`
        SELECT * FROM bookauthors 
        WHERE bookId = ?
    `, [bookId]);

    if(bookAuthors.length>0){
        const authorIds = bookAuthors.map(bookAuthor => bookAuthor.authorId);
        const placeholders = authorIds.map(() => '?').join(', ');
    
        return await pool.execute(`
            SELECT * FROM authors 
            WHERE authorId IN (${placeholders})
        `, authorIds);
    }else{
        return [[]];
    }
}

export async function getBookEntryGenres(bookId) {
    const [bookGenres] = await pool.execute(`
        SELECT * FROM bookgenres 
        WHERE bookId = ?
    `, [bookId]);

    if(bookGenres.length>0){
        const genreIds = bookGenres.map(bookGenre => bookGenre.genreId);
        const placeholders = genreIds.map(() => '?').join(', ');
    
        return await pool.execute(`
            SELECT * FROM genres 
            WHERE genreId IN (${placeholders})
        `, genreIds);
    }else{
        return [[]];
    }
}

export async function getBookEntriesGenres() {
    return pool.execute(`
        SELECT * FROM bookgenres
    `);
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

export async function editBookEntry(column, value, bookId, userId) {
    if(column === "status"){
        const [book] = await getUserBook(userId, bookId);
        const prevStatus = book[0].status;
        if(value === "finished" && prevStatus !== value){
            const currentYear = new Date().getFullYear();
            await pool.execute(`
            UPDATE books
            SET finishedReading = ?
            WHERE bookId = ?
        `, [`${currentYear}-01-01`, bookId]);
        }else if(prevStatus==="finished" && prevStatus !== value){
            await pool.execute(`
            UPDATE books
            SET finishedReading = ?
            WHERE bookId = ?
        `, [null, bookId]);
        }
    }else if(column==="finishedReading"){
        const [book] = await getUserBook(userId, bookId);
        const prevStatus = book[0].status;
        if(prevStatus !== "finished"){
            await pool.execute(`
            UPDATE books
            SET status = ?
            WHERE bookId = ?
        `, ["finished", bookId]);
        }
    }

    return pool.execute(`
        UPDATE books
        SET ${column} = ?
        WHERE bookId = ?
    `, [value, bookId]);
}

export function addBookEntryAuthor(bookId, authorId) {
    return pool.execute(`
        INSERT INTO bookauthors
        VALUES(?, ?)
    `, [bookId, authorId]);
}

export function addBookEntryGenre(bookId, genreId) {
    return pool.execute(`
        INSERT INTO bookgenres
        VALUES(?, ?)
    `, [bookId, genreId]);
}

export function deleteBookEntryAuthor(bookId, authorId) {
    return pool.execute(`
        DELETE FROM bookauthors
        WHERE bookId = ? AND authorId = ?
    `, [bookId, authorId]);
}

export function deleteBookEntryGenre(bookId, genreId) {
    return pool.execute(`
        DELETE FROM bookgenres
        WHERE bookId = ? AND genreId = ?
    `, [bookId, genreId]);
}

export function deleteBookEntryAuthors(bookId) {
    return pool.execute(`
        DELETE FROM bookauthors
        WHERE bookId = ?
    `, [bookId]);
}

export function deleteBookEntryGenres(bookId) {
    return pool.execute(`
        DELETE FROM bookgenres
        WHERE bookId = ?
    `, [bookId]);
}

export function deleteBookEntriesAuthors(authorId) {
    return pool.execute(`
        DELETE FROM bookauthors
        WHERE authorId = ?
    `, [authorId]);
}

export function deleteBookEntriesGenres(genreId) {
    return pool.execute(`
        DELETE FROM bookgenres
        WHERE genreId = ?
    `, [genreId]);
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

export function getAvatars() {
    return pool.execute(`
        SELECT * FROM avatars;
    `);
}

export function getFinishedBooksYears(userId) {
    return pool.execute(`
        SELECT finishedReading FROM books
        WHERE userId = ? AND finishedReading IS NOT NULL
    `, [userId])
}

export function createVerificationInstance(email, code, expiresIn, type) {
    return pool.execute(`
    INSERT INTO verifications(email, code, expireAt, type)
    VALUES(?, ?, NOW() + INTERVAL ? MINUTE, ?)
`, [email, code, expiresIn, type])
}

export function getVerificationInstance(email, type) {
    return pool.execute(`
    SELECT * FROM verifications
    WHERE email = ? AND type = ?
`, [email, type]) 
}

export function updateVerificationInstance(code, expiresIn, verificaionId) {
    return pool.execute(`
    UPDATE verifications
    SET code = ?, expireAt = NOW() + INTERVAL ? MINUTE
    WHERE verificationId = ?
`, [code, expiresIn, verificaionId]) 
}

export function updateVerificationInstanceConfirmationStatus(status, verificaionId) {
    return pool.execute(`
    UPDATE verifications
    SET confirmed = ?
    WHERE verificationId = ?
`, [status, verificaionId]) 
}


export function deleteVerificationInstance(verificaionId) {
    return pool.execute(`
    DELETE FROM verifications
    WHERE verificationId = ?
`, [verificaionId]) 
}

export function updateUserVerifiedStatus(status, userId) {
    return pool.execute(`
        UPDATE users
        SET verified = ? WHERE userId = ?
    `, [status, userId]);
}

export function updateUserEmail(email, userId) {
    return pool.execute(`
        UPDATE users
        SET email = ? WHERE userId = ?
    `, [email, userId]);
}

export async function deleteUser(userId) {
    await pool.execute(`
        DELETE FROM bookgenres
        WHERE bookId IN (SELECT bookId FROM books WHERE userId = ?)
        OR genreId IN (SELECT genreId FROM genres WHERE userId = ?)
    `, [userId, userId]);

    await pool.execute(`
        DELETE FROM bookauthors
        WHERE authorId IN (SELECT authorId FROM authors WHERE userId = ?)
         OR bookId IN (SELECT bookId FROM books WHERE userId = ?)
    `, [userId, userId]);
    
    await pool.execute(`
        DELETE FROM genres
        WHERE userId = ?
    `, [userId]);

    await pool.execute(`
      DELETE FROM authors
      WHERE userId = ?
    `, [userId]);

    await pool.execute(`
      DELETE FROM books
      WHERE userId = ?
    `, [userId]);

    return pool.execute(`
        DELETE FROM users
        WHERE userId = ? 
    `, [userId]);
}