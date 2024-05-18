import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS } from "chart.js/auto";
import { useContext, useEffect, useState } from 'react';
import { getBooks } from '../../api';
import { useOutletContext } from 'react-router-dom';
import { arraysEqual } from '../../utils';
import { AuthContext } from '../../context/AuthContext';



const BooksStats = () => {
    const [allYears, selectedYears] = useOutletContext();
    const [labels, setLabels] = useState([]);
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const {user} = useContext(AuthContext);
    const options = {
        responsive: true,
        scales: {
            y: {
                ticks: {
                    precision: 0
                }
            }
        },
        plugins: {
            legend: {
                display: false
            }
        }
    };

    // Fetch data + on filter
    useEffect(() => {
        const fetchData = async () => {
            try {

                //Set labels
                selectedYears.sort()
                setLabels(selectedYears);

                //Set data             
                let queryString;

                if(!arraysEqual(allYears, selectedYears)){
                  queryString = "?filter=true";
                }

                if(!arraysEqual(allYears, selectedYears)){
                    const formattedYears = selectedYears.map(year => year+"-01-01");
                    queryString += `&finishedReading=${formattedYears.join("%2C%20")}`
                }

                const config = {withCredentials: true};
                const res = await getBooks(config, user.userId,queryString);

                const finishedBooks = res.data.books.filter(book => book.status === "finished");

                const finishedBooksYears = finishedBooks.map((book) =>
                  new Date(book.finishedReading).getFullYear()
                );           
                const booksCountByYear = selectedYears.reduce((acc, year) => {
                    acc[year] = finishedBooksYears.filter(y => y === year).length;
                    return acc;
                }, {});

                setData(Object.values(booksCountByYear));
                setFilteredData(Object.values(booksCountByYear));
                
            } catch (error) {
                console.log(error);
            }
        };

        fetchData();
    }, [selectedYears])

    const chartData = {
    labels,
    datasets: [
      {
        label: "Books read",
        data,
        backgroundColor: "#007BD0",
      }
    ],
  };
  
  return (
    <>
    {data.length > 0 ? (<div className='chart bar-chart'>
    <Bar options={options} data={chartData} />
    </div>) : (<div className="data-empty">No finished books</div>)}
  </>
  );
};

export default BooksStats;
