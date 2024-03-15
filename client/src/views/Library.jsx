import { useEffect, useState } from "react";
import BookEntry from "../components/BookEntry";
import { getBooks, getColors } from "../api";
import {useLoaderData} from "react-router-dom";
import LibraryToolbar from "../components/LibraryToolbar";
import Breadcrumbs from "../components/Breadcrumbs";

const Library = () => {
    const data = useLoaderData();

    return (
      <div className="library">
        <Breadcrumbs/>

        <h3>My library</h3>

        <LibraryToolbar />

        <div className="book-entries">
          {data &&
            data.booksData &&
            data.booksData.books
              .slice()
              .reverse()
              .map((book, index) => (
                <BookEntry
                  name={book.name}
                  status={book.status}
                  finishedReading={book.finishedReading}
                  key={index}
                  colors={data.colorsData.colors}
                />
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