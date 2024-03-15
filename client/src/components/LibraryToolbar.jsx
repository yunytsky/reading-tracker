import { useEffect, useRef, useState } from "react";
import { addBook } from "../api";
import { useNavigate } from "react-router-dom";

const LibraryToolbar = () => {
  const [addBookFormVisible, setAddBookFormVisible] = useState(false);
  const [bookName, setBookName] = useState("");
  const navigate = useNavigate();
  const addBookFormRef = useRef(null);
  const addBookButtonRef = useRef(null);

  //Close the form on click
  useEffect(() => {}, []);

  const handleAddBook = async (e) => {
    try {
      e.preventDefault();
      const config = { withCredentials: true };
      const data = { name: bookName };

      const res = await addBook(data, config);
      console.log(res.data.book);
      setAddBookFormVisible(false);
      //rea.data.book returns an id
      //navigate to the book page here
    } catch (error) {}
  };

  //Restrict screen height when form is visible
  useEffect(() => {
    // Function to handle body styles when the add book form is visible
    const handleBodyStyles = () => {
      if (addBookFormVisible) {
        document.body.style.height = "100vh";
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.height = "auto";
        document.body.style.overflow = "visible";
      }
    };

    handleBodyStyles(); // Call it initially

    return () => {
      // Clean up
      document.body.style.height = "auto";
      document.body.style.overflow = "visible";
    };
  }, [addBookFormVisible]);

  //Hide popup form when clicked elsewhere
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        addBookFormRef.current != null &&
        !addBookFormRef.current.contains(event.target) &&
        addBookButtonRef !== null &&
        !addBookButtonRef.current.contains(event.target)
      ) {
        setAddBookFormVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="library-toolbar">
      <div className="filters">
        <div className="status-filter">
          Status
        </div>
        <div className="finished-reading-filter">
          Finished reading
        </div>
      </div>
      <div className="buttons">
        <button
          className="button"
          ref={addBookButtonRef}
          onClick={() => {
            setAddBookFormVisible((prevVisible) => !prevVisible);
          }}
        >
          Add +
        </button>
      </div>

      <form
        className="add-book-form"
        ref={addBookFormRef}
        style={addBookFormVisible ? { display: "flex" } : { display: "none" }}
      >
        <label className="add-book-form-label form-label" htmlFor="book-name">
          <h5>Enter a book name:</h5>
        </label>
        <textarea
          className="add-book-form-input form-input"
          type="text"
          id="book-name"
          name="book-name"
          value={bookName}
          onChange={(e) => {
            setBookName(e.target.value);
          }}
        />

        <button
          type="submit"
          className="button"
          onClick={(e) => {
            handleAddBook(e);
          }}
        >
          Add
        </button>
      </form>

      <div
        id="overlay"
        style={addBookFormVisible ? { display: "block" } : { display: "none" }}
      ></div>
    </div>
  );
};

export default LibraryToolbar;
