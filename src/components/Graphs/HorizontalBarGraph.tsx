import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import PaginatedButtons from "./PaginatedButtons"
import Query_Offset from "./Query_Offset";
import {DisplayDate, GraphLabels} from "../../middleware/Interfaces";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  indexAxis: 'y' as const,
  elements: {
    bar: {
      borderWidth: 2,
    },
  },
  responsive: true,
  plugins: {
    legend: {
      position: 'right' as const,
    }
  },
};


export default function HorizontalBarGraph(props:GraphLabels){

    const date = props.dates.map((date:DisplayDate)=>date.date)

    const data = {
        labels: date.slice(props.startIndex, props.endIndex),
        datasets: [
          {
            label: "Quantities",
            data: props.quantities.slice(props.startIndex, props.endIndex),
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
          },
          {
            label: "Profits",
            data: props.profits.slice(props.startIndex, props.endIndex),
            borderColor: 'rgb(53, 162, 235)',
            backgroundColor: 'rgba(53, 162, 235, 0.5)',
          },
        ],
      };

    return(
      <section>
        <PaginatedButtons className = "flex" currentPage = {props.currentPage} cartLength = {props.cartLength} setCurrentPage = {(e:number)=>props.setCurrentPage(e)} rowsPerPage={props.rowsPerPage}/>
        {Query_Offset(props.length, props.limit, (e:number)=>props.setLimit(e))}
        <Bar options = {options} data={data}/>
        <PaginatedButtons currentPage = {props.currentPage} cartLength = {props.cartLength} setCurrentPage = {(e:number)=>props.setCurrentPage(e)} rowsPerPage={props.rowsPerPage}/>
        </section>
    )
}