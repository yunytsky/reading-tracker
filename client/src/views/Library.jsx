import { useEffect, useState } from "react";
import BookEntry from "../components/BookEntry";
import { getBooks } from "../api";
import {useLoaderData} from "react-router-dom";

const Library = () => {
    const data = useLoaderData();


    return(
        <div className="library">
            <h3>My library</h3>
            <div className="book-entries">
                {data && data.books && data.books.map((book, index) => (
                    <BookEntry name={book.name} status={book.status} key={index}/>
                ))}
            </div>
        </div>
    );
};

export const libraryLoader = async () => {
    try {
        const config = {withCredentials: true};
        const res = await getBooks(config);
        return res.data;
    } catch (error) {
        return error;
    }
}

export default Library;