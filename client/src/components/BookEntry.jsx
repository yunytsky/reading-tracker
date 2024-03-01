import { useEffect, useState } from "react";

const BookEntry = (props) => {
    const [finishedColors, setFinishedColors] = useState({});
    const [readingColors, setReadingColors] = useState({});
    const [plannedColors, setPlannedColors] = useState({});
    const [noneColors, setNoneColors] = useState({});

    useEffect(() => {
        if(props.colors){
            const red = props.colors.find(color => color.name === 'red');
            const green = props.colors.find(color => color.name === 'green');
            const blue = props.colors.find(color => color.name === 'blue');
            const gray = props.colors.find(color => color.name === 'gray');

            setFinishedColors({backgroundColor: `#${green.background}`, color: `#${green.foreground}`});
            setReadingColors({backgroundColor: `#${red.background}`, color: `#${red.foreground}`});
            setPlannedColors({backgroundColor: `#${blue.background}`, color: `#${blue.foreground}`});
            setNoneColors({backgroundColor: `#${gray.background}`, color: `#${gray.foreground}`});

        }
    }, [])


    return (
      <div className="book-entry">
        <div
          className="book-entry-img"
          style={
            props.status === "finished"
              ? { backgroundColor: finishedColors.backgroundColor }
              : props.status === "reading"
              ? { backgroundColor: readingColors.backgroundColor }
              : props.status === "planned"
              ? { backgroundColor: plannedColors.backgroundColor }
              : { backgroundColor: noneColors.backgroundColor }
          }
        >
          <img
            src={
              props.status === "finished"
                ? "http://localhost:3000/img/books/finished.svg"
                : props.status === "reading"
                ? "http://localhost:3000/img/books/reading.svg"
                : props.status === "planned"
                ? "http://localhost:3000/img/books/planned.svg"
                : "http://localhost:3000/img/books/none.svg"
            }
            alt=""
          />
        </div>
        <h5 className="book-entry-name">{props.name}</h5>
        <div
          className="book-entry-status status"
          style={
            props.status === "finished"
              ? finishedColors
              : props.status === "reading"
              ? readingColors
              : props.status === "planned"
              ? plannedColors
              : noneColors
          }
        >
          {props.status}
        </div>
      </div>
    );
};

export default BookEntry;