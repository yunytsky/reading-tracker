import { useLoaderData, useNavigate, useParams } from "react-router-dom";
import { createAuthor, deleteAuthor, deleteBook, editAuthor, editBook, editBookAuthors, getBook, getColors, getUserAuthors } from "../api";
import { useEffect, useRef, useState } from "react";
import Breadcrumbs from "../components/Breadcrumbs";

import starIcon from "../assets/star.svg";
import dotsIcon from "../assets/dots.svg";
import editIcon from "../assets/edit.svg";
import crossIcon from "../assets/cross.svg";
import { deepEqual } from "../utils";


const Book = () => {
  const params = useParams();
  const navigate = useNavigate();

  const { bookData, colorsData } = useLoaderData();
  //-------------------------------------------------
  //Colors
  const [finishedColors, setFinishedColors] = useState({});
  const [readingColors, setReadingColors] = useState({});
  const [plannedColors, setPlannedColors] = useState({});
  const [noneColors, setNoneColors] = useState({});
  //Year
  const [finishedReadingYear, setFinishedReadingYear] = useState(null);
  //-------------------------------------------------

  //-------------------------------------------------
  //Status dropdown
  const [statusDropdownVisible, setStatusDropdownVisible] = useState(false);
  const statusDropdownRef = useRef(null);
  const statusDropdownButtonRef = useRef(null);
  //Score dropdown
  const [scoreDropdownVisible, setScoreDropdownVisible] = useState(false);
  const scoreDropdownRef = useRef(null);
  const scoreDropdownButtonRef = useRef(null);
  //Finished reading year dropdown
  const [finishedReadingDropdownVisible, setFinishedReadingDropdownVisible] = useState(false);
  const finishedReadingDropdownRef = useRef(null);
  const finishedReadingDropdownButtonRef = useRef(null);
  //Summary
  const [summaryEditable, setSummaryEditable] = useState(false);
  //-------------------------------------------------

  //-------------------------------------------------
  //Authors form related states and refs
  const [authorsFormVisible, setAuthorsFormVisible] = useState(false);
  const authorsFormRef = useRef(null);
  const authorsFormChosenRef = useRef(null);
  const [userAuthors, setUserAuthors] = useState(null);
  const [finalBookAuthors, setFinalBookAuthors] = useState(null);
  const [finalBookAuthorsError, setFinalBookAuthorsError] = useState(false);
  const [colorDropdownVisible, setColorDropdownVisible] = useState({});
  const [addNewAuthorInputVisible, setAddNewAuthorInputVisible] = useState(false);
  const [authorNameEditable, setAuthorNameEditable] = useState({});
  const [authorName, setAuthorName] = useState("");
  const [newAuthorName,setNewAuthorName] = useState("");
  const colorDropdownRef = useRef(null);
  const authorsFormListRef = useRef(null);
  //-------------------------------------------------

  //-------------------------------------------------
  //Toggle dropdown/form function
  const toggleDropdownOrForm = (setVisible) => {
    setVisible((prevVisible) => !prevVisible);
  };


  //Hide dropdown menu/form when clicked elsewhere
  useEffect(() => {
      const handleClickOutside = (event) => {
        if (
          statusDropdownRef.current != null &&
          !statusDropdownRef.current.contains(event.target) &&
          statusDropdownButtonRef !== null &&
          !statusDropdownButtonRef.current.contains(event.target)
        ) {
          setStatusDropdownVisible(false);
        } else if (
          scoreDropdownRef.current != null &&
          !scoreDropdownRef.current.contains(event.target) &&
          scoreDropdownButtonRef !== null &&
          !scoreDropdownButtonRef.current.contains(event.target)
        ) {
          setScoreDropdownVisible(false);
        } else if (
          finishedReadingDropdownRef.current != null &&
          !finishedReadingDropdownRef.current.contains(event.target) &&
          finishedReadingDropdownButtonRef !== null &&
          !finishedReadingDropdownButtonRef.current.contains(event.target)
        ) {
          setFinishedReadingDropdownVisible(false);
        } else if (
          authorsFormRef.current != null &&
          !authorsFormRef.current.contains(event.target)
        ) {
          setAuthorsFormVisible(false);
          if (colorDropdownVisible) {
            setColorDropdownVisible(false);
          }
        } else if (
          colorDropdownRef.current != null &&
          !colorDropdownRef.current.contains(event.target) &&
          authorsFormListRef !== null
      ) {
          // Close all color dropdowns
          let buttonClicked = false;
          const buttons = authorsFormListRef.current.querySelectorAll(".authors-form-author-change-color-button");
          for (let i = 0; i < buttons.length; i++) {
            const button = buttons[i];
            if(button.contains(event.target)){
              buttonClicked = true;
              break;
            }
          }

          if(!buttonClicked){
            setColorDropdownVisible({});
          }
      }
        
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
  }, []);

  //Restrict screen height when form is visible
  useEffect(() => {
      // Function to handle body styles when the add book form is visible
      const handleBodyStyles = () => {
        if (authorsFormVisible) {
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
  }, [authorsFormVisible]);
    
  //-------------------------------------------------

  //-------------------------------------------------
  //Set colors and a year
  useEffect(() => {
    if (colorsData) {
      const red = colorsData.colors.find((color) => color.name === "red");
      const green = colorsData.colors.find((color) => color.name === "green");
      const blue = colorsData.colors.find((color) => color.name === "blue");
      const gray = colorsData.colors.find((color) => color.name === "gray");

      setFinishedColors({
        backgroundColor: `#${green.background}`,
        color: `#${green.foreground}`,
      });
      setReadingColors({
        backgroundColor: `#${red.background}`,
        color: `#${red.foreground}`,
      });
      setPlannedColors({
        backgroundColor: `#${blue.background}`,
        color: `#${blue.foreground}`,
      });
      setNoneColors({
        backgroundColor: `#${gray.background}`,
        color: `#${gray.foreground}`,
      });
    }

    if (bookData.book.finishedReading) {
      const date = new Date(bookData.book.finishedReading);
      const year = date.getFullYear();
      setFinishedReadingYear(year);
    }
  }, []);

  //Fetch user authors when authors form gets opened and make a copy of an authors array
  useEffect(() => {
    if(authorsFormVisible && bookData.bookAuthors){
      setFinalBookAuthors(bookData.bookAuthors);
    }
    const fetchAuthors = async () => {
      if (authorsFormVisible && !userAuthors) {
        try {
          const config = { withCredentials: true };
          const res = await getUserAuthors(config);
          setUserAuthors(res.data.authors);
        } catch (error) {
          console.log(error);
        }
      }
    };
    fetchAuthors();
  }, [authorsFormVisible]);

  //-------------------------------------------------

  //-------------------------------------------------
  const handleEdit = async (data) => {
    try {
      const config = { withCredentials: true };
      const bookId = params.bookId;
      const res = await editBook(data, config, bookId);
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };
  
  const handleDelete = async () => {
      try {
        const config = { withCredentials: true };
        const bookId = params.bookId;
        const res = await deleteBook(config, bookId);
        navigate("/library");
      } catch (error) {
        console.log(error);
      }
  };

  const handleDeleteBookAuthor = (e, author) => {

    setFinalBookAuthors(prevAuthors => {
      const editedArray = prevAuthors.filter(obj => obj.authorId !== author.authorId);
      return editedArray; 
  });
  };

  const handleAddBookAuthor = (e, author) => {
    //Check if there are no more than 3 authors and if this author is not already added
    if(finalBookAuthors.length === 3 || finalBookAuthors.some(existingAuthor=>existingAuthor.authorId===author.authorId)){
      const authorElement = e.currentTarget.querySelector(".author");
      if (authorElement) {
          authorElement.classList.add("shake");
          setTimeout(() => {
              authorElement.classList.remove("shake");
          }, 500);
      }
      return;
    }

    setFinalBookAuthors(prev => [...prev, author]);
    
  };

  const handleDeleteUserAuthor = async (e, authorId) => {
    e.stopPropagation();
    try {
      const config = { withCredentials: true };
      await deleteAuthor(config, authorId);
      const res = await getUserAuthors(config);
      setUserAuthors(res.data.authors);
      const updatedBookAuthors = bookData.bookAuthors.filter(author => author.authorId !== authorId);
      bookData.bookAuthors = updatedBookAuthors;
      const updatedFinalBookAuthors = finalBookAuthors.filter(author => author.authorId !== authorId);
      setFinalBookAuthors(updatedFinalBookAuthors);

    } catch (error) {
      console.log(error);
    }
  }

  const handleAddUserAuthor = async () => {
    try {
      const config = {withCredentials: true};
      const data = {name: authorName};
      await createAuthor(data, config);
      const res = await getUserAuthors(config);
      setUserAuthors(res.data.authors);
      setAuthorName("");
      setAddNewAuthorInputVisible(false);
    } catch (error) {
      console.log(error)
    }
  }

  const handleEditUserAuthor = async (column, value, authorId) => {
    try {
      const config = {withCredentials: true};
      const data = {column: column, value: value};
      await editAuthor(data, config, authorId)

      const res = await getUserAuthors(config);
      setUserAuthors(res.data.authors);

      if(column === "color"){
        for (let i = 0; i < finalBookAuthors.length; i++) {
          const author = finalBookAuthors[i];
          if(author.authorId === authorId){
            author.color = value;
          }
        }
      }else if(column === "name"){
        for (let i = 0; i < finalBookAuthors.length; i++) {
          const author = finalBookAuthors[i];
          if(author.authorId === authorId){
            author.name = value;
          }
        }
      }


      if(!deepEqual(colorDropdownVisible ,{})){
        setColorDropdownVisible({});
      }else if(!deepEqual(authorNameEditable, {})){
        setAuthorNameEditable({});
      }


    } catch (error) {
      console.log(error);
    }
  }

  const handleAuthorsFormSubmit = async () => {
    try {
      const config = { withCredentials: true };
      const bookId = params.bookId;

      let authorsModified = false;
      if(bookData.bookAuthors.length !== finalBookAuthors.length){
        authorsModified = true;
      }else{
        for (let i = 0; i < bookData.bookAuthors.length; i++) {
          const obj1 = bookData.bookAuthors[i];
          const obj2 = finalBookAuthors[i];
          if (!deepEqual(obj1, obj2)) {
            authorsModified = true;
            break;
          }
      }
      }
    
      if(authorsModified){
        const res = await editBookAuthors({bookAuthors: finalBookAuthors}, config, bookId);
        window.location.reload();
      }else{
        toggleDropdownOrForm(setAuthorsFormVisible);
      }

    } catch (error) {
      console.log(error);
    }
  };
  //-------------------------------------------------

  return (
    <div className="book">
      <Breadcrumbs />

      {bookData && bookData.book && bookData.bookAuthors && (
        <>
          <h3 className="book-name">{bookData.book.name}</h3>
          <div className="book-properties">
            {/* Status */}
            <div className="book-property">
              Status:
              <div
                className="book-status status big"
                ref={statusDropdownButtonRef}
                onClick={() => {
                  toggleDropdownOrForm(setStatusDropdownVisible);
                }}
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
              {statusDropdownVisible && (
                <div
                  ref={statusDropdownRef}
                  className="book-property-dropdown status-dropdown"
                >
                  <div className="status-dropdown-options">
                    <div
                      className={
                        bookData.book.status === "finished"
                          ? "status-dropdown-option selected"
                          : "status-dropdown-option"
                      }
                      onClick={() => {
                        handleEdit({ column: "status", value: "finished" });
                      }}
                    >
                      finished
                    </div>
                    <div
                      className={
                        bookData.book.status === "reading"
                          ? "status-dropdown-option selected"
                          : "status-dropdown-option"
                      }
                      onClick={() => {
                        handleEdit({ column: "status", value: "reading" });
                      }}
                    >
                      reading
                    </div>
                    <div
                      className={
                        bookData.book.status === "planned"
                          ? "status-dropdown-option selected"
                          : "status-dropdown-option"
                      }
                      onClick={() => {
                        handleEdit({ column: "status", value: "planned" });
                      }}
                    >
                      planned
                    </div>
                    <div
                      className={
                        bookData.book.status === "none"
                          ? "status-dropdown-option selected"
                          : "status-dropdown-option"
                      }
                      onClick={() => {
                        handleEdit({ column: "status", value: "none" });
                      }}
                    >
                      none
                    </div>
                  </div>
                </div>
              )}
            </div>
            {/* Authors */}
            <div className="book-property">
              Authors:{" "}
              {bookData.bookAuthors.length > 0 ? (
                bookData.bookAuthors.map((author, index) => {
                  const authorColor = colorsData.colors.find(
                    (color) => color.name === author.color
                  );
                  return (
                    <div
                      className="book-author author big"
                      style={{
                        backgroundColor: `#${authorColor.background}`,
                        color: `#${authorColor.foreground}`,
                      }}
                      key={index}
                      onClick={() => {
                        toggleDropdownOrForm(setAuthorsFormVisible);
                      }}
                    >
                      {author.name}
                    </div>
                  );
                })
              ) : (
                <div
                  className="book-property-empty"
                  onClick={() => {
                    toggleDropdownOrForm(setAuthorsFormVisible);
                  }}
                >
                  {" "}
                  +
                </div>
              )}
            </div>
            {authorsFormVisible && (
              <div
                className="book-property-form authors-form"
                ref={authorsFormRef}
              >
                <h5>Choose up to 3 authors</h5>
                <h6 className="authors-form-chosen-heading">Selected:</h6>
                <div
                  className="authors-form-chosen-list"
                  ref={authorsFormChosenRef}
                >
                  {finalBookAuthors &&
                    finalBookAuthors.map((author, index) => {
                      const authorColor = colorsData.colors.find(
                        (color) => color.name === author.color
                      );
                      return (
                        <div
                          className="authors-form-author authors-form-author-chosen author small"
                          style={{
                            backgroundColor: `#${authorColor.background}`,
                            color: `#${authorColor.foreground}`,
                          }}
                          key={index}
                          onClick={(e) => {
                            handleDeleteBookAuthor(e, author);
                          }}
                        >
                          {author.name}
                        </div>
                      );
                    })}
                </div>

                <div className="authors-form-list" ref={authorsFormListRef}>
                  {userAuthors &&
                    userAuthors.map((author, index) => {
                      const authorColor = colorsData.colors.find(
                        (color) => color.name === author.color
                      );

                      return (
                        <div
                          className="authors-form-list-element"
                          key={index}
                          onClick={(e) => {
                            handleAddBookAuthor(e, author);
                          }}
                        >
                          <div className="authors-form-list-element-left">
                            <button
                              className="authors-form-author-rename-button"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (!deepEqual(authorNameEditable, {})) {
                                  setAuthorNameEditable({});
                                } else {
                                  setNewAuthorName(author.name);
                                  setAuthorNameEditable((prevEditable) => ({
                                    [author.authorId]:
                                      !prevEditable[author.authorId],
                                  }));
                                }
                              }}
                            >
                              <img src={editIcon} alt="rename" />
                            </button>
                            {authorNameEditable[author.authorId] ? (
                              <input
                                className="authors-form-author-rename-input"
                                autoFocus
                                value={newAuthorName}
                                onChange={(e) => {
                                  setNewAuthorName(e.target.value);
                                }}
                                onBlur={(e) => {
                                  if (
                                    newAuthorName === author.name ||
                                    newAuthorName === ""
                                  ) {
                                    setAuthorNameEditable({});
                                    return;
                                  }
                                  handleEditUserAuthor(
                                    "name",
                                    newAuthorName,
                                    author.authorId
                                  );
                                }}
                                type="text"
                              />
                            ) : (
                              <div
                                className="authors-form-author author small"
                                style={{
                                  backgroundColor: `#${authorColor.background}`,
                                  color: `#${authorColor.foreground}`,
                                }}
                              >
                                {author.name}
                              </div>
                            )}
                          </div>
                          <div className="authors-form-list-element-right">
                            <button
                              className="authors-form-author-delete-button"
                              onClick={(e) => {
                                handleDeleteUserAuthor(e, author.authorId);
                              }}
                            >
                              <img src={crossIcon} alt="delete" />
                            </button>
                            <button
                              className="authors-form-author-change-color-button"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (!deepEqual(colorDropdownVisible, {})) {
                                  setColorDropdownVisible({});
                                } else {
                                  setColorDropdownVisible((prevVisible) => ({
                                    [author.authorId]:
                                      !prevVisible[author.authorId],
                                  }));
                                }
                              }}
                            >
                              <img src={dotsIcon} alt="color" />
                            </button>

                            {colorDropdownVisible[author.authorId] && (
                              <div
                                onClick={(e) => {
                                  e.stopPropagation();
                                }}
                                ref={colorDropdownRef}
                                className="book-property-dropdown authors-form-dropdown color-dropdown"
                              >
                                <h6>Choose color:</h6>
                                <div className="color-dropdown-options">
                                  {colorsData &&
                                    colorsData.colors.map((color, index) => (
                                      <div
                                        className="color-dropdown-option"
                                        key={index}
                                        onClick={() => {
                                          handleEditUserAuthor(
                                            "color",
                                            color.name,
                                            author.authorId
                                          );
                                        }}
                                      >
                                        <div
                                          className="color-dropdown-option-color"
                                          style={{
                                            backgroundColor: `#${color.foreground}`,
                                          }}
                                        ></div>
                                        <div className="color-dropdown-option-name">
                                          {color.name}
                                        </div>
                                      </div>
                                    ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                </div>

                {/* Add author button*/}
                {!addNewAuthorInputVisible && (
                  <button
                    className="authors-form-add-new-button"
                    onClick={() => {
                      setAddNewAuthorInputVisible(true);
                    }}
                  >
                    <b>+</b> Add author
                  </button>
                )}
                {addNewAuthorInputVisible && (
                  <div className="authors-form-add-new">
                    <input
                      autoFocus
                      type="text"
                      className="authors-form-add-new-input"
                      value={authorName}
                      onChange={(e) => {
                        setAuthorName(e.target.value);
                      }}
                    />
                    <div className="authors-form-add-new-buttons">
                      <button
                        className="authors-form-add-new-button"
                        onClick={handleAddUserAuthor}
                      >
                        Add
                      </button>
                      <button
                        className="authors-form-add-new-button"
                        onClick={() => {
                          setAuthorName("");
                          setAddNewAuthorInputVisible(false);
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* Save, cancel btns */}
                <div className="authors-form-buttons">
                  <button
                    className="authors-form-save-button button"
                    onClick={handleAuthorsFormSubmit}
                  >
                    Save
                  </button>
                  <button
                    className="authors-form-cancel-button button empty"
                    onClick={() => {
                      toggleDropdownOrForm(setAuthorsFormVisible);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Genres */}
            <div className="book-property">Genres: {bookData.book.genre}</div>
            {/* Score */}
            <div className="book-property">
              Score:{" "}
              {bookData.book.score ? (
                <div
                  className="book-score"
                  ref={scoreDropdownButtonRef}
                  onClick={() => {
                    toggleDropdownOrForm(setScoreDropdownVisible);
                  }}
                >
                  {bookData.book.score}
                  <img src={starIcon} alt="score-star" />
                </div>
              ) : (
                <div
                  ref={scoreDropdownButtonRef}
                  onClick={() => {
                    toggleDropdownOrForm(setScoreDropdownVisible);
                  }}
                  className="book-property-empty"
                >
                  +
                </div>
              )}
              {scoreDropdownVisible && (
                <div
                  ref={scoreDropdownRef}
                  className="book-property-dropdown score-dropdown"
                >
                  <div className="score-dropdown-options">
                    {Array.from({ length: 10 }, (_, index) => index).map(
                      (scoreNum, index) => (
                        <div
                          key={index}
                          className={
                            bookData.book.score === scoreNum + 1
                              ? "score-dropdown-option selected"
                              : "score-dropdown-option"
                          }
                          onClick={() => {
                            handleEdit({
                              column: "score",
                              value: scoreNum + 1,
                            });
                          }}
                        >
                          {scoreNum + 1}
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>
            {/* Finished reading year */}
            <div className="book-property">
              Finished reading year:{" "}
              {finishedReadingYear ? (
                <span
                  className="book-finished-reading"
                  ref={finishedReadingDropdownButtonRef}
                  onClick={() => {
                    toggleDropdownOrForm(setFinishedReadingDropdownVisible);
                  }}
                >
                  {finishedReadingYear}
                </span>
              ) : (
                <div
                  ref={finishedReadingDropdownButtonRef}
                  onClick={() => {
                    toggleDropdownOrForm(setFinishedReadingDropdownVisible);
                  }}
                  className="book-property-empty"
                >
                  +
                </div>
              )}
              {finishedReadingDropdownVisible && (
                <div
                  ref={finishedReadingDropdownRef}
                  className="book-property-dropdown finished-reading-dropdown"
                >
                  <div className="finished-reading-dropdown-options">
                    {Array.from(
                      { length: new Date().getFullYear() - 1924 },
                      (_, index) => 1925 + index
                    )
                      .reverse()
                      .map((year, index) => (
                        <div
                          key={index}
                          className={
                            finishedReadingYear === year
                              ? "finished-reading-dropdown-option selected"
                              : "finished-reading-dropdown-option"
                          }
                          onClick={() => {
                            handleEdit({
                              column: "finishedReading",
                              value: `${year}-01-01`,
                            });
                          }}
                        >
                          {year}
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
            {/* Summary */}

            <div className="book-property summary">
              Summary:{" "}
              {summaryEditable ? (
                <textarea
                  rows={5}
                  className="book-summary editable"
                  defaultValue={bookData.book.summary}
                  autoFocus
                  onFocus={(e) => {
                    e.target.setSelectionRange(-1, -1);
                  }}
                  onBlur={(e) => {
                    if (e.target.value === bookData.book.summary) {
                      setSummaryEditable(false);
                      return;
                    }

                    handleEdit({
                      column: "summary",
                      value: e.target.value,
                    });
                  }}
                ></textarea>
              ) : bookData.book.summary ? (
                <p
                  className="book-summary"
                  onClick={() => {
                    if (!summaryEditable) {
                      setSummaryEditable(true);
                    }
                  }}
                >
                  {bookData.book.summary}
                </p>
              ) : (
                <div
                  className="book-property-empty"
                  onClick={() => {
                    if (!summaryEditable) {
                      setSummaryEditable(true);
                    }
                  }}
                >
                  Add summary +
                </div>
              )}
            </div>
          </div>
        </>
      )}

      <button onClick={handleDelete} className="book-delete-button">
        Delete
      </button>

      <div
        id="overlay"
        style={authorsFormVisible ? { display: "block" } : { display: "none" }}
      ></div>
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