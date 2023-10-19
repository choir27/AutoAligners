import {buttons} from "../../middleware/Interfaces"

export default function PaginatedButtons(props: buttons){

const handlePageChange = (newPage:number) => {
        props.setCurrentPage(newPage);
      }

return(
  <div className = {props.className} key = "buttons">
        {Math.ceil(props.cartLength/props.rowsPerPage) < props.currentPage + 1  ? Array.from({ length: Math.ceil(props.cartLength / props.rowsPerPage) }, (_, i) => (
        <button key = {`button-${i}`} className = {`clearButton ${props.currentPage === i+1 ? "selectedPage" : ""}`}  onClick = {()=>handlePageChange(i+1)}>{i+1}</button> 
      )):
      Array.from({ length: Math.ceil(props.cartLength / props.rowsPerPage) }, (_, i) => 
      {
        if(i < props.currentPage - 2 && i !== 0){
          return(
          <h1 key = {`${i}-dots`}>...</h1>
          )
        }else if((!(i > props.currentPage + 1) && i < props.currentPage + 1) || i+1 === Math.ceil(props.cartLength/props.rowsPerPage)){
            return (
              <button key = {`button-${i}`}className = {`clearButton ${props.currentPage === i+1 ? "selectedPage" : ""}`}  onClick = {()=>handlePageChange(i+1)}>{i+1}</button> 
            )
        }else{
          return(
            <h1 key = {`${i}-dots`}>...</h1>
          )
        }
      }
)}
  </div>
)
}
