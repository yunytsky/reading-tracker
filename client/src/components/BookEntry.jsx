const BookEntry = (props) => {
    return(
        <div className="book-entry">
            <h5 className="book-entry-name">
                {props.name}
            </h5>
            <div className="book-entry-status status">
                {props.status}
            </div>
        </div>
    );
};

export default BookEntry;