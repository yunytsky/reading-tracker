import { useLoaderData, useNavigate, useParams } from "react-router-dom";
import { createAuthor, createGenre, deleteAuthor, deleteBook, deleteGenre, editAuthor, editBook, editBookAuthors, editBookGenres, editGenre, getBook, getColors, getUserAuthors, getUserGenres } from "../api";
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
  //Genres form related states and refs
  const [genresFormVisible, setGenresFormVisible] = useState(false);
  const genresFormRef = useRef(null);
  const genresFormChosenRef = useRef(null);
  const [userGenres, setUserGenres] = useState(null);
  const [finalBookGenres, setFinalBookGenres] = useState(null);
  const [addNewGenreInputVisible, setAddNewGenreInputVisible] = useState(false);
  const [genreNameEditable, setGenreNameEditable] = useState({});
  const [genreName, setGenreName] = useState("");
  const [newGenreName,setNewGenreName] = useState("");
  const genresFormListRef = useRef(null);
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
          statusDropdownRef.current !== null &&
          !statusDropdownRef.current.contains(event.target) &&
          statusDropdownButtonRef.current !== null &&
          !statusDropdownButtonRef.current.contains(event.target)
        ) {
          setStatusDropdownVisible(false);
        } else if (
          scoreDropdownRef.current !== null &&
          !scoreDropdownRef.current.contains(event.target) &&
          scoreDropdownButtonRef.current !== null &&
          !scoreDropdownButtonRef.current.contains(event.target)
        ) {
          setScoreDropdownVisible(false);
        } else if (
          finishedReadingDropdownRef.current !== null &&
          !finishedReadingDropdownRef.current.contains(event.target) &&
          finishedReadingDropdownButtonRef.current !== null &&
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
        }  else if (
          genresFormRef.current !== null &&
          !genresFormRef.current.contains(event.target)
        ) {
          setGenresFormVisible(false);
          if (colorDropdownVisible) {
            setColorDropdownVisible(false);
          }
        } else if (
          colorDropdownRef.current !== null &&
          !colorDropdownRef.current.contains(event.target) &&
          authorsFormListRef.current !== null
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

   //Fetch user genres when genres form gets opened and make a copy of a genres array
   useEffect(() => {
    if(genresFormVisible && bookData.bookGenres){
      setFinalBookGenres(bookData.bookGenres);
    }
    const fetchGenres = async () => {
      if (genresFormVisible && !userGenres) {
        try {
          const config = { withCredentials: true };
          const res = await getUserGenres(config);
          setUserGenres(res.data.genres);
        } catch (error) {
          console.log(error);
        }
      }
    };
    fetchGenres();
  }, [genresFormVisible]);


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

  const handleDeleteBookAuthor = (author) => {

    setFinalBookAuthors(prevAuthors => {
      const editedArray = prevAuthors.filter(obj => obj.authorId !== author.authorId);
      return editedArray; 
  });
  };

  const handleDeleteBookGenre = (genre) => {
    setFinalBookGenres(prevGenres => {
      const editedArray = prevGenres.filter(obj => obj.genreId !== genre.genreId);
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

  const handleAddBookGenre = (e, genre) => {
    //Check if there are no more than 3 genres and if this genre is not already added
    if(finalBookGenres.length === 3 || finalBookGenres.some(existingGenre=>existingGenre.genreId===genre.genreId)){
      const genreElement = e.currentTarget.querySelector(".genre");
      if (genreElement) {
          genreElement.classList.add("shake");
          setTimeout(() => {
            genreElement.classList.remove("shake");
          }, 500);
      }
      return;
    }

    setFinalBookGenres(prev => [...prev, genre]);
    
  };

  const handleDeleteUserAuthor = async (e, authorId) => {
    e.stopPropagation();
    try {
      const config = { withCredentials: true };
      const res = await deleteAuthor(config, authorId);
      if(!res){
        throw new error;
      }
      const resAuthors = await getUserAuthors(config);
      setUserAuthors(resAuthors.data.authors);
      const updatedBookAuthors = bookData.bookAuthors.filter(author => author.authorId !== authorId);
      bookData.bookAuthors = updatedBookAuthors;
      const updatedFinalBookAuthors = finalBookAuthors.filter(author => author.authorId !== authorId);
      setFinalBookAuthors(updatedFinalBookAuthors);

    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteUserGenre = async (e, genreId) => {
    e.stopPropagation();
    try {
      const config = { withCredentials: true };
      const res = await deleteGenre(config, genreId);
      if(!res){
        throw new error;
      }
      const resGenres = await getUserGenres(config);
      setUserGenres(resGenres.data.genres);
      const updatedBookGenres = bookData.bookGenres.filter(genre => genre.genreId !== genreId);
      bookData.bookGenres = updatedBookGenres;
      const updatedFinalBookGenres = finalBookGenres.filter(genre => genre.genreId !== genreId);
      setFinalBookGenres(updatedFinalBookGenres);
    } catch (error) {
      console.log(error);
    }
  };

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
  };
  useEffect(() => {console.log(genreName)}, [genreName])
  
  const handleAddUserGenre = async () => {
    try {
      const config = {withCredentials: true};
      const data = {name: genreName};
      await createGenre(data, config);
      const res = await getUserGenres(config);
      setUserGenres(res.data.genres);
      setGenreName("");
      setAddNewGenreInputVisible(false);
    } catch (error) {
      console.log(error)
    }
  };

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
  };

  const handleEditUserGenre = async (column, value, genreId) => {
    try {
      const config = {withCredentials: true};
      const data = {column: column, value: value};
      await editGenre(data, config, genreId);

      const res = await getUserGenres(config);
      setUserGenres(res.data.genres);

      if(column === "color"){
        for (let i = 0; i < finalBookGenres.length; i++) {
          const genre = finalBookGenres[i];
          if(genre.genreId === genreId){
            genre.color = value;
          }
        }
      }else if(column === "name"){
        for (let i = 0; i < finalBookGenres.length; i++) {
          const genre = finalBookGenres[i];
          if(genre.genreId === genreId){
            genre.name = value;
          }
        }
      }


      if(!deepEqual(colorDropdownVisible ,{})){
        setColorDropdownVisible({});
      }else if(!deepEqual(genreNameEditable, {})){
        setGenreNameEditable({});
      }

    } catch (error) {
      console.log(error);
    }
  };


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

  const handleGenresFormSubmit = async () => {
    try {
      const config = { withCredentials: true };
      const bookId = params.bookId;

      let genresModified = false;
      if(bookData.bookGenres.length !== finalBookGenres.length){
        genresModified = true;
      }else{
        for (let i = 0; i < bookData.bookGenres.length; i++) {
          const obj1 = bookData.bookGenres[i];
          const obj2 = finalBookGenres[i];
          if (!deepEqual(obj1, obj2)) {
            genresModified = true;
            break;
          }
      }
      }
    
      if(genresModified){
        const res = await editBookGenres({bookGenres: finalBookGenres}, config, bookId);
        window.location.reload();
      }else{
        toggleDropdownOrForm(setGenresFormVisible);
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
              Authors:
              {bookData.bookAuthors && bookData.bookAuthors.length > 0 ? (
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
                          onClick={() => {
                            handleDeleteBookAuthor(author);
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
                                onClick={(e) => {
                                  e.stopPropagation();
                                }}
                                onChange={(e) => {
                                  setNewAuthorName(e.target.value);
                                }}
                                onBlur={() => {
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
                                        className={author.color === color.name ? "color-dropdown-option selected" : "color-dropdown-option"}
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
                        onClick={() => {
                          if (authorName == "") {
                            setAddNewAuthorInputVisible(false);
                            return;
                          }
                          handleAddUserAuthor();
                        }}
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
            <div className="book-property">
              Genres:
              {bookData.bookGenres && bookData.bookGenres.length > 0 ? (
                bookData.bookGenres.map((genre, index) => {
                  const genreColor = colorsData.colors.find(
                    (color) => color.name === genre.color
                  );
                  return (
                    <div
                      className="book-genre genre big"
                      style={{
                        backgroundColor: `#${genreColor.background}`,
                        color: `#${genreColor.foreground}`,
                      }}
                      key={index}
                      onClick={() => {
                        toggleDropdownOrForm(setGenresFormVisible);
                      }}
                    >
                      {genre.name}
                    </div>
                  );
                })
              ) : (
                <div
                  className="book-property-empty"
                  onClick={() => {
                    toggleDropdownOrForm(setGenresFormVisible);
                  }}
                >
                  {" "}
                  +
                </div>
              )}
            </div>

            {genresFormVisible && (
              <div
                className="book-property-form genres-form"
                ref={genresFormRef}
              >
                <h5>Choose up to 3 genres</h5>
                <h6 className="genres-form-chosen-heading">Selected:</h6>
                <div
                  className="genres-form-chosen-list"
                  ref={genresFormChosenRef}
                >
                  {finalBookGenres &&
                    finalBookGenres.map((genre, index) => {
                      const genreColor = colorsData.colors.find(
                        (color) => color.name === genre.color
                      );
                      return (
                        <div
                          className="genres-form-genre genres-form-genre-chosen genre small"
                          style={{
                            backgroundColor: `#${genreColor.background}`,
                            color: `#${genreColor.foreground}`,
                          }}
                          key={index}
                          onClick={() => {
                            handleDeleteBookGenre(genre);
                          }}
                        >
                          {genre.name}
                        </div>
                      );
                    })}
                </div>

                <div className="genres-form-list" ref={genresFormListRef}>
                  {userGenres &&
                    userGenres.map((genre, index) => {
                      const genreColor = colorsData.colors.find(
                        (color) => color.name === genre.color
                      );

                      return (
                        <div
                          className="genres-form-list-element"
                          key={index}
                          onClick={(e) => {
                            handleAddBookGenre(e, genre);
                          }}
                        >
                          <div className="genres-form-list-element-left">
                            <button
                              className="genres-form-genre-rename-button"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (!deepEqual(genreNameEditable, {})) {
                                  setGenreNameEditable({});
                                } else {
                                  setNewGenreName(genre.name);
                                  setGenreNameEditable((prevEditable) => ({
                                    [genre.genreId]:
                                      !prevEditable[genre.genreId],
                                  }));
                                }
                              }}
                            >
                              <img src={editIcon} alt="rename" />
                            </button>
                            {genreNameEditable[genre.genreId] ? (
                              <input
                                className="genres-form-genre-rename-input"
                                autoFocus
                                value={newGenreName}
                                onClick={(e) => {
                                  e.stopPropagation();
                                }}
                                onChange={(e) => {
                                  setNewGenreName(e.target.value);
                                }}
                                onBlur={() => {
                                  if (
                                    newGenreName === genre.name ||
                                    newGenreName === ""
                                  ) {
                                    setGenreNameEditable({});
                                    return;
                                  }
                                  handleEditUserGenre(
                                    "name",
                                    newGenreName,
                                    genre.genreId
                                  );
                                }}
                                type="text"
                              />
                            ) : (
                              <div
                                className="genres-form-genre genre small"
                                style={{
                                  backgroundColor: `#${genreColor.background}`,
                                  color: `#${genreColor.foreground}`,
                                }}
                              >
                                {genre.name}
                              </div>
                            )}
                          </div>
                          <div className="genres-form-list-element-right">
                            <button
                              className="genres-form-genre-delete-button"
                              onClick={(e) => {
                                handleDeleteUserGenre(e, genre.genreId);
                              }}
                            >
                              <img src={crossIcon} alt="delete" />
                            </button>
                            <button
                              className="genres-form-genre-change-color-button"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (!deepEqual(colorDropdownVisible, {})) {
                                  setColorDropdownVisible({});
                                } else {
                                  setColorDropdownVisible((prevVisible) => ({
                                    [genre.genreId]:
                                      !prevVisible[genre.genreId],
                                  }));
                                }
                              }}
                            >
                              <img src={dotsIcon} alt="color" />
                            </button>

                            {colorDropdownVisible[genre.genreId] && (
                              <div
                                onClick={(e) => {
                                  e.stopPropagation();
                                }}
                                ref={colorDropdownRef}
                                className="book-property-dropdown genres-form-dropdown color-dropdown"
                              >
                                <h6>Choose color:</h6>
                                <div className="color-dropdown-options">
                                  {colorsData &&
                                    colorsData.colors.map((color, index) => (
                                      <div
                                      className={genre.color === color.name ? "color-dropdown-option selected" : "color-dropdown-option"}
                                        key={index}
                                        onClick={() => {
                                          handleEditUserGenre(
                                            "color",
                                            color.name,
                                            genre.genreId
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

                <div className="genres-form-add-new">
                  {addNewGenreInputVisible ? (
                    <div className="genres-form-add-new editable">
                      <input
                        autoFocus
                        type="text"
                        className="genres-form-add-new-input"
                        value={genreName}
                        onChange={(e) => {
                          setGenreName(e.target.value);
                        }}
                      />
                      <div className="genres-form-add-new-buttons">
                        <button
                          className="genres-form-add-new-button"
                          onClick={() => {
                            if (genreName == "") {
                              setAddNewGenreInputVisible(false);
                              return;
                            }
                            handleAddUserGenre();
                          }}
                        >
                          Add
                        </button>
                        <button
                          className="genres-form-add-new-button"
                          onClick={() => {
                            setGenreName("");
                            setAddNewGenreInputVisible(false);
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      className="genres-form-add-new-button"
                      onClick={() => {
                        setAddNewGenreInputVisible(true);
                      }}
                    >
                      <b>+</b> Add genre
                    </button>
                  )}
                </div>

                {/* Save, cancel btns */}
                <div className="genres-form-buttons">
                  <button
                    className="genres-form-save-button button"
                    onClick={handleGenresFormSubmit}
                  >
                    Save
                  </button>
                  <button
                    className="genres-form-cancel-button button empty"
                    onClick={() => {
                      toggleDropdownOrForm(setGenresFormVisible);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
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

      <button onClick={handleDelete} className="book-delete-button delete-button">
        Delete
      </button>

      <div
        id="overlay"
        style={authorsFormVisible || genresFormVisible ? { display: "block" } : { display: "none" }}
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