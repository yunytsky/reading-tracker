import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS } from "chart.js/auto";
import { useEffect, useState } from 'react';
import { getBooks } from '../../api';
import { useOutletContext } from 'react-router-dom';

const BooksStats = () => {
    const [years, selectedYears] = useOutletContext();
    const [labels, setLabels] = useState([]);
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
 
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

    useEffect(() => {console.log()}, [labels])
    // Fetch data
    useEffect(() => {
        const fetchData = async () => {
            try {
                //Set labels
                // const sortedYears = years.toSorted();
                // setLabels(sortedYears);

                //Set data             
                const config = {withCredentials: true};
                const res = await getBooks(config);
                const finishedBooks = res.data.books.filter(book => book.status === "finished");

                //combine these two here
                const finishedBooksYears = finishedBooks.map((book) =>
                  new Date(book.finishedReading).getFullYear()
                );           
                const booksCountByYear = years.reduce((acc, year) => {
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
    }, [years])
    
    useEffect(() => {
        const sortedSelectedYears = selectedYears.toSorted();
        const sortedYears = years.toSorted();

        setLabels(sortedSelectedYears);

        // const notIncluded = sortedYears.map((year, index) => {
        //     if(!sortedSelectedYears.includes(year)){
        //         return index;
        //     }
        // }).filter(index => index!==undefined);

   
        // notIncluded.forEach(index => {
        //     setData(prevData => {
        //         // Splice modifies the original array, so we need to create a copy before splicing
        //         const updatedData = [...prevData];
        //         updatedData.splice(index, 1);
        //         console.log(updatedData);
        //         return updatedData;
        //     });
        // });

         // Find selected years that were not previously included
        const addedYears = sortedSelectedYears.filter(year => !sortedYears.includes(year));

        // Find previously selected years that were removed
        const removedYears = sortedYears.filter(year => !sortedSelectedYears.includes(year));

        // Update filteredData based on added and removed years
        setFilteredData((prevFilteredData) => {
        let updatedData = [...prevFilteredData];

        // Remove data corresponding to removed years
        removedYears.forEach((year) => {
            updatedData = updatedData.filter((item) => item.year !== year);
        });

        // Add back data corresponding to added years
        addedYears.forEach((year) => {
            // Assuming you have a function getDataForYear(year) to get data for a specific year
            const newDataForYear = getDataForYear(year);
            updatedData = [...updatedData, ...newDataForYear];
        });

        return updatedData;
        });

    }, [selectedYears])

    useEffect(() => {console.log(data)}, [data])
  
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
    <div className="chart bar-chart">
     <Bar options={options} data={chartData} />
    </div>
  );
};

export default BooksStats;
