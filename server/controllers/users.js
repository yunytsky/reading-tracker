import { getUserBooks, getUserBook, addBookEntry, editBookEntry, getBookOwner, deleteBookEntry, getBookAuthors, getUserAuthors, addUserAuthor, deleteBookEntryAuthor, addBookEntryAuthor, deleteUserAuthor, deleteBookEntriesAuthors, editUserAuthor } from "../database/functions.js";

export async function getBooks(req, res) {
    try {
        const [books] = await getUserBooks(req.user.sub);
        return res.status(200).json({error: false, message: "Success", books: books});
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
        return res.status(200).json({error: false, message: "Success", book: book, bookAuthors: bookAuthors});
    } catch (error) {
        return res.status(500).json({error: true, message: error.message});
    }
}

export async function addBook(req, res) {
    try {
        const [data] = await addBookEntry(req.user.sub, req.body.name)
        return res.status(201).json({error: false, message: "Success", book: data.insertId})
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

        await editBookEntry(req.body.column, req.body.value, req.params.bookId, req.user.sub);
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
        const [initialBookAuthors] = await getBookAuthors(req.params.bookId);

        const deletedAuthors = initialBookAuthors.filter(initialAuthor => {
            return !req.body.bookAuthors.some((author) => author.authorId === initialAuthor.authorId);
          }).map(deletedAuthor => deletedAuthor.authorId);

        const addedAuthors = req.body.bookAuthors.filter(author => {
            return !initialBookAuthors.some(initialAuthor => initialAuthor.authorId === author.authorId); 
        }).map(addedAuthor => addedAuthor.authorId);


        if(deletedAuthors.length>0){
            await Promise.all(deletedAuthors.map(authorId => deleteBookEntryAuthor(req.params.bookId, authorId)));
        }

        if(addedAuthors.length>0){
            await Promise.all(addedAuthors.map(authorId => addBookEntryAuthor(req.params.bookId, authorId)));
        }

        return res.status(200).json({ error: false, message: "Successfully updated" });


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

export async function getAuthors(req, res) {
    try {
        const [authors] = await getUserAuthors(req.user.sub);
        return res.status(200).json({error: false, message: "Success", authors: authors});
    } catch (error) {
        return res.status(500).json({error: true, message: error.message});
    }
}

export async function createAuthor(req, res) {
    try {

        await addUserAuthor(req.body.name, req.user.sub);
        return res.status(200).json({error: false, message: "Successfully created"});

    } catch (error) {
          return res.status(500).json({ error: true, message: error.message }); 
    }   
}

export async function deleteAuthor(req, res) {
    try {
        // Verify that this author is "owned" by this exactly user
        const [userAuthors] = await getUserAuthors(req.user.sub);
        const userHasAuthor = userAuthors.some(author => author.authorId == req.params.authorId);
        if(!userHasAuthor) {
            return res.status(403).json({error: true, message: "Forbidden"});
        }

        //Delete references (from bookauthors)
        await deleteBookEntriesAuthors(req.params.authorId);
        
        //then delete it from authors
        await deleteUserAuthor(req.params.authorId);
        return res.status(200).json({error: false, message: "Successfully deleted"});

    } catch (error) {
          return res.status(500).json({ error: true, message: error.message }); 
    } 
}

export async function editAuthor(req, res) {
    try {
        // Verify that this author is "owned" by this exactly user
        const [userAuthors] = await getUserAuthors(req.user.sub);
        const userHasAuthor = userAuthors.some(author => author.authorId == req.params.authorId);
        if(!userHasAuthor) {
            return res.status(403).json({error: true, message: "Forbidden"});
        }


        await editUserAuthor(req.body.column, req.body.value, req.params.authorId, req.user.sub);
        
        return res.status(200).json({error: false, message: "Successfully updated"});

    } catch (error) {
        return res.status(500).json({ error: true, message: error.message }); 

    }
}