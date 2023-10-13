import "./OverallActivity.css";
import { getYearlyUsersWorkspaceActivity } from "../../../../app/features/Engineering/AsyncThunks";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import moment from "moment/moment";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { Loader } from "../../../../components/Loader";


export const OverallActivity = () => {

  const { yearlyActivityData, yearlyActivityFetchStatus } = useSelector(
    (state) => state.engineering
  );

  const dispatch = useDispatch();
  let dataYears = []
  const [year, setYear] = useState(moment().format("YYYY"));
  const [yearsList, setYearList] = useState([])

    useEffect(()=>{
      const minYear = 2022
    const maxYear = moment().format("YYYY")

    for(let i = minYear; i <= maxYear; i++){
      console.log(i)
      dataYears = [...dataYears, i]
    }
    setYearList(dataYears)
    },[])

  useEffect(() => {
    
    dispatch(getYearlyUsersWorkspaceActivity({ year }));
  }, [year]);

  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );

  const options = {
    plugins: {
      title: {
        display: true,
        text: `Growth of Users & Workspaces for the year ${year}`,
      },
    },
    responsive: true,
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
      },
    },
  };

  const labels = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const chartData = {
    labels,
    datasets: [
      {
        label: "Workspaces",
        data: yearlyActivityData?.map((data) => data.workspaces),
        backgroundColor: "rgb(135,187,236)",
      },
      {
        label: "Users",
        data: yearlyActivityData?.map((data) => data.users),
        backgroundColor: "rgb(180,201,211)"
      },
    ],
  };

  return (
    <div className="overall-activity__container">
     {yearsList.length > 0 &&
     <div>
      <label htmlFor="years">Choose a year:</label>
        <select value={year} onChange={(e)=>{setYear(e.target.value)}} name="years" id="years">
          {yearsList.map((year, i) =>
          <option key={i} value={year}>{year}</option>  )}
        </select>
      </div>
     } 
      <div className="overall-activity-chart__container">
        { yearlyActivityFetchStatus === "loading" && <Loader />}
        {yearlyActivityFetchStatus === "fulfilled" && yearlyActivityData && (
          <div>
           
            <Bar options={options} data={chartData} />
          </div>
          
        )}
      </div>
    </div>
  );
};
