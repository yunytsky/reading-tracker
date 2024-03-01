import { useEffect, useState } from "react";
import BookEntry from "../components/BookEntry";
import { getBooks, getColors } from "../api";
import {useLoaderData} from "react-router-dom";

const Library = () => {
    const data = useLoaderData();


    return(
        <div className="library">
            <h3>My library</h3>
            <div className="book-entries">
                {data && data.booksData && data.booksData.books.map((book, index) => (
                    <BookEntry name={book.name} status={book.status} key={index} colors={data.colorsData.colors}/>
                ))}
            </div>
        </div>
    );
};

export const libraryLoader = async () => {
    try {
        const config = {withCredentials: true};

        const booksRes = await getBooks(config);
        const colorsRes = await getColors();

        return {booksData: booksRes.data, colorsData: colorsRes.data};
    } catch (error) {
        return error;
    }
}

export default Library;