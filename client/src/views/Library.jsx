import BookEntry from "../components/BookEntry";
import { getBooks, getColors, getYearRange } from "../api";
import {useLoaderData} from "react-router-dom";
import LibraryToolbar from "../components/LibraryToolbar";
import Breadcrumbs from "../components/Breadcrumbs";
import { useContext, useEffect, useState } from "react";
import { arraysEqual } from "../utils";
import { AuthContext } from "../context/AuthContext";

const Library = () => {
  const {user} = useContext(AuthContext);

  const [books, setBooks] = useState([]);
  const [colors, setColors] = useState([]);
  const [allYears, setAllYears] = useState([]);
  const [selectedYears, setSelectedYears] = useState([]);
  const [allStatuses, setAllStatuses] = useState(["finished", "none", "planned", "reading"]);
  const [selectedStatuses, setSelectedStatuses] = useState(["finished", "none", "planned", "reading"]);

  //Set years and colors
  useEffect(() => {
    const fetchData = async () => {
      try {
        const config = {withCredentials: true};
        const yearsRes = await getYearRange(config, user.userId);

        setAllYears(yearsRes.data.yearRange);
        setSelectedYears(yearsRes.data.yearRange);

        const colorsRes = await getColors();
        setColors(colorsRes.data.colors);


    } catch (error) {
        console.log(error);
    }
    }

    fetchData();
  }, [])

  // Fetch data + on filter
  useEffect(() => {
    const fetchData = async () => {
      try {
        const config = {withCredentials: true};

        selectedYears.sort()
        selectedStatuses.sort()

        let queryString;

        if(!arraysEqual(allYears, selectedYears) || !arraysEqual(allStatuses, selectedStatuses)){
          queryString = "?filter=true";
        }

        if(!arraysEqual(allYears, selectedYears)){
          const formattedYears = selectedYears.map(year => year+"-01-01");
          queryString += `&finishedReading=${formattedYears.join("%2C%20")}`
        }

        if(!arraysEqual(allStatuses, selectedStatuses)){
          queryString += `&status=${selectedStatuses.join("%2C%20")}`
        }

        const booksRes = await getBooks(config, user.userId, queryString);

        setBooks(booksRes.data.books);

      } catch (error) {
        console.log(error); 
      }
    }
    fetchData();
  }, [selectedYears, selectedStatuses])


  return (
    <div className="library">
      <Breadcrumbs />

      <h3>My library</h3>

      {selectedYears && (
        <LibraryToolbar
          allYears={allYears}
          allStatuses={allStatuses}
          selectedYears={selectedYears}
          selectedStatuses={selectedStatuses}
          setSelectedYears={setSelectedYears}
          setSelectedStatuses={setSelectedStatuses}
        />
      )}

      <div className="book-entries">
        {books.length > 0 &&
          colors.length > 0 &&
          books
            .slice()
            .reverse()
            .map((book, index) => (
              <BookEntry
                book={book}
                name={book.name}
                status={book.status}
                finishedReadingYear={
                  book.finishedReading
                    ? new Date(book.finishedReading).getFullYear()
                    : null
                }
                bookId={book.bookId}
                key={index}
                colors={colors}
              />
            ))}
        
        {books.length === 0 && (<div className="data-empty">No books. Click an Add button to create an entry</div>)}
      </div>
    </div>
  );
};



export default Library;