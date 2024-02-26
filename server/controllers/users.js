import { getUserBooks, getUserBook, addBookEntry, editBookEntry, getBookOwner, deleteBookEntry, getBookAuthors } from "../database/functions.js";

export async function getBooks(req, res) {
    try {
        const [books] = await getUserBooks(req.user.sub);
        return res.status(200).json({error: false, books: books});
    } catch (error) {
        return res.status(500).json({error: true, message: error.message});
    }
};

export async function getBook(req, res) {
    try {
        const [data] = await getUserBook(req.user.sub, req.params.bookId);
        const book = data[0];
        
        if(!book) {
            return res.status(404).json({error: true, message: "Book is not found"});
        }

        const [bookAuthors] = await getBookAuthors(req.params.bookId);
    
        return res.status(200).json({error: false, book: book, bookAuthors: bookAuthors});
    } catch (error) {
        return res.status(500).json({error: true, message: error.message});
    }
}

export async function addBook(req, res) {
    try {
        const [data] = await addBookEntry(req.user.sub, req.body.name)
        return res.status(201).json({error: false, book: data.insertId})
    } catch (error) {
        return res.status(500).json({error: true, message: error.message});
    } 
}

export async function editBook(req, res) {
    try {
        const [bookOwner] = await getBookOwner(req.params.bookId);
        if(bookOwner.length === 0 || bookOwner[0].userId != req.user.sub) {
            return res.status(403).json({error: true, message: "Forbidden"});
        }

        await editBookEntry(req.body.column, req.body.value, req.params.bookId);
        return res.status(200).json({error: false, message: "Successfully updated"});

    } catch (error) {
        console.log(error)
        if (
          error.code === "ER_CHECK_CONSTRAINT_VIOLATED" ||
          error.code === "ER_BAD_FIELD_ERROR" ||
          error.code === "ER_DUP_ENTRY" ||
          error.code === "ER_SIGNAL_EXCEPTION" ||
          error.code === "ER_DATA_TOO_LONG"
        ) {
          return res.status(400).json({ error: true, message: error.message });
        } else {
          return res.status(500).json({ error: true, message: error.message });
        }
    }

}

export async function deleteBook(req, res) {
    try {
        const [bookOwner] = await getBookOwner(req.params.bookId);
        if(bookOwner.length === 0 || bookOwner[0].userId != req.user.sub) {
            return res.status(403).json({error: true, message: "Forbidden"});
        }

        await deleteBookEntry(req.params.bookId);
        return res.status(200).json({error: false, message: "Successfully deleted"});

    } catch (error) {
          return res.status(500).json({ error: true, message: error.message }); 
    }

}

export async function editBookAuthors(req, res) {
    try {
        const [bookOwner] = await getBookOwner(req.params.bookId);
        if(bookOwner.length === 0 || bookOwner[0].userId != req.user.sub) {
            return res.status(403).json({error: true, message: "Forbidden"});
        }

        //get a list of book authors
        // check if there are new ones or if some got deleted
        //if so call deleteBookAuthor on those
        // or addBookAuthor

    } catch (error) {
        console.log(error)
        if (
          error.code === "ER_CHECK_CONSTRAINT_VIOLATED" ||
          error.code === "ER_BAD_FIELD_ERROR" ||
          error.code === "ER_DUP_ENTRY" ||
          error.code === "ER_SIGNAL_EXCEPTION" ||
          error.code === "ER_DATA_TOO_LONG"
        ) {
          return res.status(400).json({ error: true, message: error.message });
        } else {
          return res.status(500).json({ error: true, message: error.message });
        }
    }

}