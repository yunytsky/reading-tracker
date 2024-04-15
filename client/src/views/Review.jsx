import { useEffect, useRef, useState } from "react";
import Breadcrumbs from "../components/Breadcrumbs";
import { NavLink, Outlet } from "react-router-dom";
import arrowIcon from "../assets/arrow.svg";
import { getBooks } from "../api";

const Review = () => {
  const [yearFilterDropdownVisible, setYearFilterDropdownVisible] = useState(false);
  const yearFilterDropdownButtonRef = useRef(null);
  const yearFilterDropdownRef = useRef(null);
  const [years, setYears] = useState([]);
  const [selectedYears, setSelectedYears] = useState([]);

  //Hide dropdown menu/form when clicked elsewhere
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        yearFilterDropdownRef.current !== null &&
        !yearFilterDropdownRef.current.contains(event.target) &&
        yearFilterDropdownButtonRef.current !== null &&
        !yearFilterDropdownButtonRef.current.contains(event.target)
      ) {
        setYearFilterDropdownVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  //Fetch years (filters data)
  useEffect(() => {
    const fetchData = async () => {
      try {
        //Set years
        const config = { withCredentials: true };
        const res = await getBooks(config);

        const finishedBooks = res.data.books.filter(
          (book) => book.status === "finished"
        );
        const finishedBooksYears = finishedBooks.map((book) =>
          new Date(book.finishedReading).getFullYear()
        );

        const minYear = Math.min(...finishedBooksYears);
        const currentYear = new Date().getFullYear();

        const years = Array.from(
          { length: currentYear - minYear + 1 },
          (_, i) => currentYear - i
        );

        setYears(years);
        setSelectedYears(years);
        
      } catch (error) {
        console.log(error);
      }
    }

    fetchData();
  }, [])

  return (
    <div className="review">
      <Breadcrumbs />

      <h3>Review</h3>

      <div className="review-tabs">
        <NavLink
          to={"/review/books-stats"}
          className={({ isActive }) =>
            isActive ? "review-tab selected" : "review-tab"
          }
        >
          Books statistics
        </NavLink>
        <NavLink
          to={"/review/genre-stats"}
          className={({ isActive }) =>
            isActive ? "review-tab selected" : "review-tab"
          }
        >
          Genre statistics
        </NavLink>
      </div>

      <div className="review-toolbar">
        <div className="filters">
          <div
            className="finished-reading-filter filter"
            ref={yearFilterDropdownButtonRef}
            onClick={() => {
              setYearFilterDropdownVisible((prevVisible) => !prevVisible);
            }}
          >
            <div className="filter-name">Year</div>{" "}
            <div className="filter-selected">
              <span className="filter-selected-name">All years</span>
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
                  {years &&
                    years.map((year, index) => (
                      <label  key={index} className="filter-dropdown-option finished-reading-filter-dropdown-option">
                        <input
                          type="checkbox"
                          value={year}
                          name="finished-reading-year"
                          checked={selectedYears.some(selectedYear => selectedYear === year)}
                          onChange={() => {
                              if(selectedYears.some(selectedYear => selectedYear === year)){
                                setSelectedYears(prevSelectedYears => {
                                  return prevSelectedYears.filter(prevSelectedYear => prevSelectedYear !== year);
                                });
                              }else{
                                setSelectedYears(prevSelectedYears => [...prevSelectedYears, year])
                              }
                            }}
                        />
                        {year}
                      </label>
                    ))}
                </div>

                <div className="filter-dropdown-actions">
                  <button className="filter-dropdown-action-button" onClick={() => {setSelectedYears(years);}}>
                    Select all
                  </button> 
                  <button className="filter-dropdown-action-button" onClick={() => {setSelectedYears([]);}}>
                    Deselect all
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Outlet context={[years, selectedYears]}/>
    </div>
  );
};

export default Review;
