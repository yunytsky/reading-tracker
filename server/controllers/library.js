import { getUserBooks, getUserBook, addBookEntry, editBookEntry, getBookOwner, deleteBookEntry, getBookEntryAuthors, getUserAuthors, addUserAuthor, deleteBookEntryAuthor, addBookEntryAuthor, deleteUserAuthor, deleteBookEntriesAuthors, editUserAuthor, getUserGenres, deleteBookEntryGenre, addBookEntryGenre, editUserGenre, deleteBookEntriesGenres, addUserGenre, deleteUserGenre, getBookEntriesGenres, getBookEntryGenres, getFinishedBooksYears, deleteBookEntryGenres, deleteBookEntryAuthors } from "../database/functions.js";

export async function getBooks(req, res) {
    try {
        if(req.params.userId != req.user.sub){
            return res.status(401).json({error: true, message: "Unauthorized"});
        }

        let filter;
        if(req.query && req.query.filter == "true"){
            filter = req.query;
        }

        const [books] = await getUserBooks(req.user.sub, filter);
        
        return res.status(200).json({error: false, message: "Success", books: books});
    } catch (error) {
        return res.status(500).json({error: true, message: error.message});
    }
};

export async function getBook(req, res) {
    try {
        if(req.params.userId != req.user.sub){
            return res.status(401).json({error: true, message: "Unauthorized"});
        }

        const [data] = await getUserBook(req.user.sub, req.params.bookId);
        const book = data[0];

        if(!book) {
            return res.status(404).json({error: true, message: "Book is not found"});
        }

        const [bookAuthors] = await getBookEntryAuthors(req.params.bookId);
        const [bookGenres] = await getBookEntryGenres(req.params.bookId);

        return res.status(200).json({error: false, message: "Success", book: book, bookAuthors: bookAuthors, bookGenres: bookGenres});
    } catch (error) {
        return res.status(500).json({error: true, message: error.message});
    }
}

export async function addBook(req, res) {
    try {
        if(req.params.userId != req.user.sub){
            return res.status(401).json({error: true, message: "Unauthorized"});
        }

        const [data] = await addBookEntry(req.user.sub, req.body.name)
        return res.status(201).json({error: false, message: "Success", book: data.insertId})
    } catch (error) {
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

export async function editBook(req, res) {
    try {
        if(req.params.userId != req.user.sub){
            return res.status(401).json({error: true, message: "Unauthorized"});
        }

        const [bookOwner] = await getBookOwner(req.params.bookId);
        if(bookOwner.length === 0 || bookOwner[0].userId != req.user.sub) {
            return res.status(403).json({error: true, message: "Forbidden"});
        }

        await editBookEntry(req.body.column, req.body.value, req.params.bookId, req.user.sub);
        return res.status(200).json({error: false, message: "Successfully updated"});

    } catch (error) {
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
        if(req.params.userId != req.user.sub){
            return res.status(401).json({error: true, message: "Unauthorized"});
        }

        //Check if user owns this book
        const [bookOwner] = await getBookOwner(req.params.bookId);
        if(bookOwner.length === 0 || bookOwner[0].userId != req.user.sub) {
            return res.status(403).json({error: true, message: "Forbidden"});
        }

        //Delete references (from bookgenres)
        await deleteBookEntryGenres(req.params.bookId);
        //Delete references (from bookauthors)
        await deleteBookEntryAuthors(req.params.bookId);

        await deleteBookEntry(req.params.bookId);
        return res.status(200).json({error: false, message: "Successfully deleted"});

    } catch (error) {
        return res.status(500).json({ error: true, message: error.message }); 
    }

}

export async function editBookAuthors(req, res) {
    try {
        if(req.params.userId != req.user.sub){
            return res.status(401).json({error: true, message: "Unauthorized"});
        }

        const [bookOwner] = await getBookOwner(req.params.bookId);
        if(bookOwner.length === 0 || bookOwner[0].userId != req.user.sub) {
            return res.status(403).json({error: true, message: "Forbidden"});
        }
        const [initialBookAuthors] = await getBookEntryAuthors(req.params.bookId);

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

export async function editBookGenres(req, res) {
    try {
        if(req.params.userId != req.user.sub){
            return res.status(401).json({error: true, message: "Unauthorized"});
        }

        const [bookOwner] = await getBookOwner(req.params.bookId);
        if(bookOwner.length === 0 || bookOwner[0].userId != req.user.sub) {
            return res.status(403).json({error: true, message: "Forbidden"});
        }

        const [initialBookGenres] = await getBookEntryGenres(req.params.bookId);

        const deletedGenres = initialBookGenres.filter(initialGenre => {
            return !req.body.bookGenres.some((genre) => genre.genreId === initialGenre.genreId);
          }).map(deletedGenre => deletedGenre.genreId);

        const addedGenres = req.body.bookGenres.filter(genre => {
            return !initialBookGenres.some(initialGenre => initialGenre.genreId === genre.genreId); 
        }).map(addedGenre => addedGenre.genreId);

        if(deletedGenres.length>0){
            await Promise.all(deletedGenres.map(genreId => deleteBookEntryGenre(req.params.bookId, genreId)));
        }

        if(addedGenres.length>0){
            await Promise.all(addedGenres.map(genreId => addBookEntryGenre(req.params.bookId, genreId)));
        }

        return res.status(200).json({ error: false, message: "Successfully updated" });


    } catch (error) {
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
        if(req.params.userId != req.user.sub){
            return res.status(401).json({error: true, message: "Unauthorized"});
        }

        const [authors] = await getUserAuthors(req.user.sub);
        return res.status(200).json({error: false, message: "Success", authors: authors});
    } catch (error) {
        return res.status(500).json({error: true, message: error.message});
    }
}

export async function getGenres(req, res) {
    try {
        if(req.params.userId != req.user.sub){
            return res.status(401).json({error: true, message: "Unauthorized"});
        }

        const [genres] = await getUserGenres(req.user.sub);
        return res.status(200).json({error: false, message: "Success", genres: genres});
    } catch (error) {
        return res.status(500).json({error: true, message: error.message});
    }
}

export async function createAuthor(req, res) {
    try {
        if(req.params.userId != req.user.sub){
            return res.status(401).json({error: true, message: "Unauthorized"});
        }

        await addUserAuthor(req.body.name, req.user.sub);
        return res.status(200).json({error: false, message: "Successfully created"});

    } catch (error) {
          return res.status(500).json({ error: true, message: error.message }); 
    }   
}

export async function createGenre(req, res) {
    try {
        if(req.params.userId != req.user.sub){
            return res.status(401).json({error: true, message: "Unauthorized"});
        }

        await addUserGenre(req.body.name, req.user.sub);
        return res.status(200).json({error: false, message: "Successfully created"});

    } catch (error) {
        return res.status(500).json({ error: true, message: error.message }); 
    }   
}

export async function deleteAuthor(req, res) {
    try {
        if(req.params.userId != req.user.sub){
            return res.status(401).json({error: true, message: "Unauthorized"});
        }

        // Verify that this author is "owned" by this exactly user
        const [userAuthors] = await getUserAuthors(req.user.sub);
        const userHasAuthor = userAuthors.some(author => author.authorId == req.params.authorId);
        if(!userHasAuthor) {
            return res.status(403).json({error: true, message: "Forbidden"});
        }

        //Delete references (from bookauthors)
        await deleteBookEntriesAuthors(req.params.authorId);
        
        //Then delete it from authors
        await deleteUserAuthor(req.params.authorId, req.user.sub);
        return res.status(200).json({error: false, message: "Successfully deleted"});

    } catch (error) {
          return res.status(500).json({ error: true, message: error.message }); 
    } 
}

export async function deleteGenre(req, res) {
    try {
        if(req.params.userId != req.user.sub){
            return res.status(401).json({error: true, message: "Unauthorized"});
        }

        // Verify that this genre is "owned" by this exactly user
        const [userGenres] = await getUserGenres(req.user.sub);
        const userHasGenre = userGenres.some(genre => genre.genreId == req.params.genreId);
        if(!userHasGenre) {
            return res.status(403).json({error: true, message: "Forbidden"});
        }
        //Delete references (from bookgenres)
        await deleteBookEntriesGenres(req.params.genreId);
        
        //Then delete it from genres
        await deleteUserGenre(req.params.genreId, req.user.sub);
        return res.status(200).json({error: false, message: "Successfully deleted"});

    } catch (error) {
        return res.status(500).json({ error: true, message: error.message }); 
    } 
}

export async function editAuthor(req, res) {
    try {
        if(req.params.userId != req.user.sub){
            return res.status(401).json({error: true, message: "Unauthorized"});
        }

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

export async function editGenre(req, res) {
    try {
        if(req.params.userId != req.user.sub){
            return res.status(401).json({error: true, message: "Unauthorized"});
        }

        // Verify that this author is "owned" by this exactly user
        const [userGenres] = await getUserGenres(req.user.sub);
        const userHasGenre = userGenres.some(genre => genre.genreId == req.params.genreId);
        if(!userHasGenre) {
            return res.status(403).json({error: true, message: "Forbidden"});
        }

        await editUserGenre(req.body.column, req.body.value, req.params.genreId, req.user.sub);
        
        return res.status(200).json({error: false, message: "Successfully updated"});

    } catch (error) {
        return res.status(500).json({ error: true, message: error.message }); 

    }
}

export async function getBooksGenres(req, res) {
    try {
        if(req.params.userId != req.user.sub){
            return res.status(401).json({error: true, message: "Unauthorized"});
        }

        const [genres] = await getBookEntriesGenres();
        return res.status(200).json({error: false, message: "Success", genres: genres});
    } catch (error) {
        return res.status(500).json({ error: true, message: error.message }); 
    }
}

export async function getYearRange(req,res) {
    try {
        if(req.params.userId != req.user.sub){
            return res.status(401).json({error: true, message: "Unauthorized"});
        }
        
        const [allYears] = await getFinishedBooksYears(req.user.sub);
        const years = allYears.map(year => new Date(year.finishedReading).getFullYear());

        const minYear = Math.min(...years);
        const currentYear = new Date().getFullYear();
        const yearRange = Array.from(
          { length: currentYear - minYear + 1 },
          (_, i) => minYear + i
        );

        return res.status(200).json({error: false, message: "Success", yearRange: yearRange});
    } catch (error) {
        return res.status(500).json({ error: true, message: error.message }); 
    }
}