import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";

const GenreStats = ({ chartData }) => {
  const options = {
    responsive: true,
    plugins: {
      legend: {
      },
    },
  };

  return (
    <div className="chart doughnut-chart">
      <Doughnut data={chartData} options={options} />
    </div>
  );
};

export default GenreStats;
