import moment from "moment";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

export const GrowthDataCard = ({ data }) => {
  const currentMonth = moment().format("MMMM");
  const prevMonth = moment().subtract(1, "months").format("MMMM");

  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );

  const options = {
    responsive: true,
    scales: {
      x: {
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          display: false,
        },
      },
      y: {
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          display: false,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },

      title: {
        display: false,
        text: "Chart.j Line Chart",
      },
    },
  };

  const labels = [prevMonth, currentMonth];

  const chartData = {
    labels,
    datasets: [
      {
        label: "Count",
        data: [data.prevMonth, data.currentMonth],
        borderColor: data.growth > 0 ? "#9ee74b" : "#e14545",
        backgroundColor:
          data.growth > 0 ? "rgb(158, 231, 75, 0.5)" : "rgb(225, 69, 69,0.5)",
      },
    ],
  };

  return (
    <div className="growth-card-container">
      <div className="growth-chart__container">
        <Line options={options} data={chartData} />
      </div>
      <div className="growth-details__container">
        <div className="growth-details-item">
          <p className="growth-details-heading">{currentMonth}</p>
          <p className="growth-details-content">{data.currentMonth}</p>
        </div>
        <div className="growth-details-item">
          <p className="growth-details-heading">{prevMonth}</p>
          <p className="growth-details-content">{data.prevMonth}</p>
        </div>
        <div className="growth-details-item">
          <p className="growth-details-heading">Growth</p>
          <p
            className={`growth-details-content ${
              data.growth > 0 ? "positive-growth" : "negative-growth"
            }`}
          >
            {data.growth}
          </p>
        </div>
      </div>
    </div>
  );
};
