import { useState } from "react";
import Breadcrumbs from "../components/Breadcrumbs";
import GenreStats from "../components/charts/GenreStats";
import BookStats from "../components/charts/BooksStats";

const Review = () => {
    const [selectedTab, setSelectedTab] = useState("book-stats");

    const [amounts, setAmounts] = useState([33, 53, 85, 41, 44]);
    const [categories, setCategories] = useState([
        "Groceries",
        "Electricity",
        "Health",
        "Other",
        "Sport",
    ]);

    const chartData = {
        labels: categories, 
        datasets: [
            {
                label: "Spent",
                data: amounts,
                fill: true,
                borderRadius: 10,
            },
        ],
    };



    return (
      <div className="review">
        <Breadcrumbs />

        <h3>Review</h3>

        <div className="review-tabs">
          <button
            className={
              selectedTab === "book-stats"
                ? "review-tab selected"
                : "review-tab"
            }
            onClick={() => {
              setSelectedTab("book-stats");
            }}
          >
            Book statistics
          </button>
          <button
            className={
              selectedTab === "genre-stats"
                ? "review-tab selected"
                : "review-tab"
            }
            onClick={() => {
              setSelectedTab("genre-stats");
            }}
          >
            Genre statistics
          </button>
        </div>
        <div className="review-toolbar">
          <div className="finished-reading-filter filter">Year</div>
        </div>

        {selectedTab === "book-stats" ? (
          <BookStats />
        ) : selectedTab === "genre-stats" ? (
          <GenreStats chartData={chartData} />
        ) : null}
        
      </div>
    );
}

export default Review;