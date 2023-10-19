import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2'
import PaginatedButtons from "./PaginatedButtons"
import Query_Offset from "./Query_Offset";
import {DisplayDate, GraphLabels} from "../../middleware/Interfaces";


ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );

  export const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      }
    },

  }
  


export default function LineGraph(props:GraphLabels){

    const date = props.dates.map((date:DisplayDate)=>date.date)

    const data = {
        labels: date.slice(props.startIndex, props.endIndex),
        datasets: [
          {
            label: 'Quantities Sold',
            data: props.quantities.slice(props.startIndex, props.endIndex),
            borderColor: 'rgb(75, 192, 192)',
          },
          {
            label: 'Total Profit',
            data: props.profits.slice(props.startIndex, props.endIndex),
            borderColor: 'rgb(255, 99, 132)',
          },
        ],
      };

        return (
          <section>
            <PaginatedButtons className = "flex" currentPage = {props.currentPage} cartLength = {props.cartLength} setCurrentPage = {(e:number)=>props.setCurrentPage(e)} rowsPerPage={props.rowsPerPage}/>
            {Query_Offset(props.length, props.limit, (e:number)=>props.setLimit(e))}
            <Line data={data} options ={options}/>
            <PaginatedButtons currentPage = {props.currentPage} cartLength = {props.cartLength} setCurrentPage = {(e:number)=>props.setCurrentPage(e)} rowsPerPage={props.rowsPerPage}/>
          </section>
              )
}