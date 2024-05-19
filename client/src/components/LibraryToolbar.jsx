import { useContext, useEffect, useRef, useState } from "react";
import { addBook } from "../api";
import { useNavigate } from "react-router-dom";
import arrowIcon from "../assets/arrow.svg";
import { AuthContext } from "../context/AuthContext";
const LibraryToolbar = ({
  allYears,
  allStatuses,
  selectedYears,
  selectedStatuses,
  setSelectedYears,
  setSelectedStatuses,
}) => {
  const navigate = useNavigate();
  const {user} = useContext(AuthContext);

  const [addBookFormVisible, setAddBookFormVisible] = useState(false);
  const [bookName, setBookName] = useState("");
  const [bookNameError, setBookNameError] = useState(false);
  const addBookFormRef = useRef(null);
  const addBookButtonRef = useRef(null);

  const [yearFilterDropdownVisible, setYearFilterDropdownVisible] =
    useState(false);
  const yearFilterDropdownButtonRef = useRef(null);
  const yearFilterDropdownRef = useRef(null);

  const [statusFilterDropdownVisible, setstatusFilterDropdownVisible] =
    useState(false);
  const statusFilterDropdownButtonRef = useRef(null);
  const statusFilterDropdownRef = useRef(null);

  const handleAddBook = async (e) => {
    try {
      e.preventDefault();

      if(setBookNameError){
        setBookNameError(false);
      }

      if(bookName === ""){
        setBookNameError(true);
        return;
      }
      
      const config = { withCredentials: true };
      const data = { name: bookName };

      const res = await addBook(data, config, user.userId);
      setAddBookFormVisible(false);

      navigate(`/library/book/${res.data.book}`);
    } catch (error) {
      console.log(error)
    }
  };

  //Restrict screen height when overlay is visible
  useEffect(() => {
    const handleBodyStyles = () => {
      if (addBookFormVisible) {
        window.scrollTo(0, 0);
        document.body.style.height = "100vh";
        document.body.style.overflow = "hidden";
      } else if (yearFilterDropdownVisible) {
        document.body.style.overflowX = "hidden";
      } else {
        document.body.style.height = "auto";
        document.body.style.overflow = "visible";
      }
    };

    handleBodyStyles();
    return () => {
      // Clean up
      document.body.style.height = "auto";
      document.body.style.overflow = "visible";
    };
  }, [addBookFormVisible, yearFilterDropdownVisible]);

  //Hide popup-form/dropdown-menu when clicked elsewhere
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        addBookFormRef.current !== null &&
        !addBookFormRef.current.contains(event.target) &&
        addBookButtonRef.current !== null &&
        !addBookButtonRef.current.contains(event.target)
      ) {
        setAddBookFormVisible(false);
        setBookName("");
        setBookNameError(false);
      }

      if (
        yearFilterDropdownRef.current !== null &&
        !yearFilterDropdownRef.current.contains(event.target) &&
        yearFilterDropdownButtonRef.current !== null &&
        !yearFilterDropdownButtonRef.current.contains(event.target)
      ) {
        setYearFilterDropdownVisible(false);
      }
      if (
        statusFilterDropdownRef.current !== null &&
        !statusFilterDropdownRef.current.contains(event.target) &&
        statusFilterDropdownButtonRef.current !== null &&
        !statusFilterDropdownButtonRef.current.contains(event.target)
      ) {
        setstatusFilterDropdownVisible(false);
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
        {/* Finished reading filter */}
        <div
          className="finished-reading-filter filter"
          ref={yearFilterDropdownButtonRef}
          onClick={() => {
            setYearFilterDropdownVisible((prevVisible) => !prevVisible);
          }}
        >
          <div className="filter-name">Finished reading</div>{" "}
          <div className="filter-selected">
            <span
              className={
                selectedYears.length === allYears.length
                  ? "filter-selected-name all"
                  : "filter-selected-name"
              }
            >
              {selectedYears.length === allYears.length
                ? "All"
                : selectedYears.length}
            </span>
            <img className="filter-arrow" src={arrowIcon} />
          </div>
          {yearFilterDropdownVisible && (
            <div
              ref={yearFilterDropdownRef}
              onClick={(e) => {
                e.stopPropagation();
              }}
              className="filter-dropdown"
            >
              <div className="filter-dropdown-options">
                {allYears &&
                  allYears
                    .map((year, index) => (
                      <label
                        key={index}
                        className="filter-dropdown-option finished-reading-filter-dropdown-option"
                      >
                        <input
                          type="checkbox"
                          value={year}
                          name="finished-reading-year"
                          checked={selectedYears.some(
                            (selectedYear) => selectedYear === year
                          )}
                          onChange={() => {
                            if (
                              selectedYears.some(
                                (selectedYear) => selectedYear === year
                              )
                            ) {
                              setSelectedYears((prevSelectedYears) => {
                                return prevSelectedYears.filter(
                                  (prevSelectedYear) =>
                                    prevSelectedYear !== year
                                );
                              });
                            } else {
                              setSelectedYears((prevSelectedYears) => [
                                ...prevSelectedYears,
                                year,
                              ]);
                            }
                          }}
                        />
                        {year}
                      </label>
                    ))
                    .reverse()}
                {allYears.length === 0 && (
                  <div className="filter-dropdown-empty-option">
                    No finished books
                  </div>
                )}
              </div>

              <div className="filter-dropdown-actions">
                <button
                  className="filter-dropdown-action-button"
                  onClick={() => {
                    setSelectedYears(allYears);
                  }}
                >
                  Select all
                </button>
                <button
                  className="filter-dropdown-action-button"
                  onClick={() => {
                    setSelectedYears([]);
                  }}
                >
                  Deselect all
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Status filter */}
        <div
          className="status-filter filter"
          ref={statusFilterDropdownButtonRef}
          onClick={() => {
            setstatusFilterDropdownVisible((prevVisible) => !prevVisible);
          }}
        >
          <div className="filter-name">Status</div>{" "}
          <div className="filter-selected">
            <span
              className={
                selectedStatuses.length === allStatuses.length
                  ? "filter-selected-name all"
                  : "filter-selected-name"
              }
            >
              {" "}
              {selectedStatuses.length === allStatuses.length
                ? "All"
                : selectedStatuses.length}
            </span>
            <img className="filter-arrow" src={arrowIcon} />
          </div>
          {statusFilterDropdownVisible && (
            <div
              ref={statusFilterDropdownRef}
              onClick={(e) => {
                e.stopPropagation();
              }}
              className="filter-dropdown"
            >
              <div className="filter-dropdown-options">
                {allStatuses &&
                  allStatuses.map((status, index) => (
                    <label
                      key={index}
                      className="filter-dropdown-option status-filter-dropdown-option"
                    >
                      <input
                        type="checkbox"
                        value={status}
                        name="finished-reading-year"
                        checked={selectedStatuses.some(
                          (selectedStatus) => selectedStatus === status
                        )}
                        onChange={() => {
                          if (
                            selectedStatuses.some(
                              (selectedStatus) => selectedStatus === status
                            )
                          ) {
                            setSelectedStatuses((prevSelectedStatuses) => {
                              return prevSelectedStatuses.filter(
                                (prevSelectedStatus) =>
                                  prevSelectedStatus !== status
                              );
                            });
                          } else {
                            setSelectedStatuses((prevSelectedStatuses) => [
                              ...prevSelectedStatuses,
                              status,
                            ]);
                          }
                        }}
                      />
                      {status}
                    </label>
                  ))}
              </div>

              <div className="filter-dropdown-actions">
                <button
                  className="filter-dropdown-action-button"
                  onClick={() => {
                    setSelectedStatuses(allStatuses);
                  }}
                >
                  Select all
                </button>
                <button
                  className="filter-dropdown-action-button"
                  onClick={() => {
                    setSelectedStatuses([]);
                  }}
                >
                  Deselect all
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="buttons">
        <button
          className="button"
          ref={addBookButtonRef}
          onClick={() => {
            setAddBookFormVisible((prevVisible) => !prevVisible);
            setBookNameError(false);
          }}
        >
          Add +
        </button>
      </div>

      {addBookFormVisible && (
        <form className="add-book-form" ref={addBookFormRef}>
          <label className="add-book-form-label form-label" htmlFor="book-name">
            <h5>Enter a book name:</h5>
          </label>

          <textarea
            className={
              bookNameError
                ? "add-book-form-input form-input error"
                : "add-book-form-input form-input"
            }
            type="text"
            id="book-name"
            name="book-name"
            value={bookName}
            onChange={(e) => {
              setBookName(e.target.value);
            }}
            required
            rows={4}
          ></textarea>

          {bookNameError && (
            <div className="add-book-form-error">Enter a book name</div>
          )}

          <div className="add-book-form-buttons">
            <button
              type="button"
              className="button empty"
              onClick={() => {
                setBookName("");
                setAddBookFormVisible((prevVisible) => !prevVisible);
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="button"
              onClick={(e) => {
                handleAddBook(e);
              }}
            >
              Add
            </button>
          </div>
        </form>
      )}

      <div
        id="overlay"
        className={yearFilterDropdownVisible ? "transparent" : null}
        style={
          addBookFormVisible || yearFilterDropdownVisible
            ? { display: "block" }
            : { display: "none" }
        }
      ></div>
    </div>
  );
};

export default LibraryToolbar;
