import { useLoaderData } from "react-router-dom";
import { getBook, getColors } from "../api";
import { useEffect, useState } from "react";
import starIcon from "../assets/star.svg"

const Book = () => {
    const {bookData, colorsData} = useLoaderData();
    const [finishedColors, setFinishedColors] = useState({});
    const [readingColors, setReadingColors] = useState({});
    const [plannedColors, setPlannedColors] = useState({});
    const [noneColors, setNoneColors] = useState({});

    const [finishedReadingYear, setFinishedReadingYear] = useState(null);

    useEffect(() => {
        if(colorsData){
            const red = colorsData.colors.find(color => color.name === 'red');
            const green = colorsData.colors.find(color => color.name === 'green');
            const blue = colorsData.colors.find(color => color.name === 'blue');
            const gray = colorsData.colors.find(color => color.name === 'gray');

            setFinishedColors({backgroundColor: `#${green.background}`, color: `#${green.foreground}`});
            setReadingColors({backgroundColor: `#${red.background}`, color: `#${red.foreground}`});
            setPlannedColors({backgroundColor: `#${blue.background}`, color: `#${blue.foreground}`});
            setNoneColors({backgroundColor: `#${gray.background}`, color: `#${gray.foreground}`});
        }

        if(bookData.book.status === "finished" && bookData.book.finishedReading) {
          const date = new Date(bookData.book.finishedReading);
          const year = date.getFullYear();
          setFinishedReadingYear(year);
        }

    }, [])

    return (
      <div className="book">
        {bookData && bookData.book && bookData.bookAuthors && (
          <>
            <h3 className="book-name">{bookData.book.name}</h3>
            <div className="book-properties">
              {/* Status */}
              <div className="book-property">
                Status:
                <div
                  className="book-status"
                  style={
                    bookData.book.status === "finished"
                      ? finishedColors
                      : bookData.book.status === "reading"
                      ? readingColors
                      : bookData.book.status === "planned"
                      ? plannedColors
                      : noneColors
                  }
                >
                  {bookData.book.status}
                </div>
              </div>
              {/* Authors */}
              <div className="book-property">
                Authors:{" "}
                {bookData.bookAuthors.map((author, index) => {
                  const authorColor = colorsData.colors.find(
                    (color) => color.name === author.color
                  );
                  return (
                    <div
                      className="book-author"
                      style={{
                        backgroundColor: `#${authorColor.background}`,
                        color: `#${authorColor.foreground}`,
                      }}
                      key={index}
                    >
                      {author.name}
                    </div>
                  );
                })}
              </div>
              {/* Genres */}
              <div className="book-property">Genres: {bookData.book.genre}</div>
              {/* Score */}
              <div className="book-property">
                Score:{" "}
                <div className="book-score">
                  {bookData.book.score} <img src={starIcon} alt="score-star" />{" "}
                </div>
              </div>
              {/* Finished reading year */}
              <div className="book-property">
                Finished reading year:{" "}
                <span className="book-finished-reading">
                  {finishedReadingYear}
                </span>
              </div>
              {/* Summary */}
              <div className="book-property summary">
                Summary: <p className="book-summary">{bookData.book.summary}</p>
              </div>
            </div>
          </>
        )}

        <button className="book-delete-button">
            Delete
        </button>
      </div>
    );
};

export const bookLoader = async ({params}) => {
    try {
        const config = {withCredentials: true}; 
        const bookId = params.bookId;
        const bookRes = await getBook(config, bookId);
        const colorsRes = await getColors();

        return {bookData: bookRes.data, colorsData: colorsRes.data};
    } catch (error) {
        return error;
    }
}

export default Book;