import { useEffect, useState } from "react";
import BookEntry from "../components/BookEntry";

const Library = () => {
    const [books, setBooks] = useState();

    //Fetch data
    useEffect(() => {
        
    }, [])

    return(
        <div className="library">
            <h3>My library</h3>
            <div className="book-entries">
                <BookEntry/>
            </div>
        </div>
    );
};

export default Library;