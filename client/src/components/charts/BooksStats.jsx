import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS } from "chart.js/auto";
import { useEffect, useState } from 'react';

const BookStats = () => {

    const [labels, setLabels] = useState([2021,2022,2023,2024]);

    const options = {
        responsive: true,
    };

    // Fetch data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const config = {withCredentials: true};
                
            } catch (error) {
                console.log(error);
            }
        };

        fetchData();
    }, [])
  
  
    const data = {
    labels,
    datasets: [
      {
        label: "Books read",
        data: [1, 3, 12, 5],
        backgroundColor: "#007BD0",
      }
    ],
  };
  
  return (
    <div className="chart bar-chart">
     <Bar options={options} data={data} />
    </div>
  );
};

export default BookStats;
