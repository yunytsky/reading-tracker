import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";
import { useEffect, useState } from "react";
import { getBooks, getBooksGenres, getColors, getUserGenres } from "../../api";
import uniqolor from "uniqolor";
import randomColor from "randomcolor";
import { useOutletContext } from "react-router-dom";
import { arraysEqual } from "../../utils";

const GenreStats = () => {
  const [allYears, selectedYears] = useOutletContext();

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "left",
        align: "start",
        labels: {
          color: "#40404A"
        }
      }
    },
  };

  const [data, setData] = useState([]);
  const [labels, setLabels] = useState([]);

  const [colors, setColors] = useState([]);

  //Fetch data + on filter
  useEffect(() => {
    const fetchData = async () => {
      try {
        selectedYears.sort();

        // Fetch user genres and books
        const config = { withCredentials: true };

        let queryString;
        if(!arraysEqual(allYears, selectedYears)){
          queryString = "?filter=true";
        }

        if(!arraysEqual(allYears, selectedYears)){
            const formattedYears = selectedYears.map(year => year+"-01-01");
            queryString += `&finishedReading=${formattedYears.join("%2C%20")}`
        }

        const [resUserGenres, resBooks, resBooksGenres, resColors] = await Promise.all([
          getUserGenres(config),
          getBooks(config, queryString),
          getBooksGenres(config),
          getColors()
        ]);

        const allGenres = resUserGenres.data.genres;
        const allBooks = resBooks.data.books;
        const allBooksGenres = resBooksGenres.data.genres;
        const allColors = resColors.data.colors;

        //Set labels
        const genreNames = allGenres.map(genre => genre.name);
        setLabels(genreNames);
        
        //Set data
        const booksCountByGenre = [];
        const finishedBooks = allBooks.filter(book => book.status === "finished");
        const finishedBooksGenres = allBooksGenres.filter(genre =>
          finishedBooks.some(book => book.bookId === genre.bookId)
        );
        allGenres.forEach(genre => {
          const finishedBooksByGenre = finishedBooksGenres.filter(finishedGenre => finishedGenre.genreId === genre.genreId);
          booksCountByGenre.push(finishedBooksByGenre.length)
        })

        setData(booksCountByGenre);

        //Set colors
        const genreColors = allGenres.map(genre => genre.color);

        const genreColorsValues = genreColors.map(genreColor =>
          allColors.find(color => color.name === genreColor)
        ).map(color => `#${color.main}`);
        
        setColors(genreColorsValues);
        
        //Setting random colors with uniqolor:
        // const genreColorsValues = genreNames.map(genreName => uniqolor(genreName).color);
        // setColors(genreColorsValues)

        
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, [selectedYears])

  
  const chartData = {
      labels, 
      datasets: [
          {
              label: "Read",
              data: data,
              backgroundColor: colors,
              borderRadius: 5
          },
      ],
  };



  return (
    <div className="chart doughnut-chart">
      <Doughnut options={options} data={chartData} />
    </div>
  );
};

export default GenreStats;
