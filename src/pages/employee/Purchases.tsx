import {useState, useEffect} from "react"
import Nav from "../../components/Nav"
import Footer from "../../components/Footer"
import BarGraph from "../../components/Graphs/BarGraph"
import LineGraph from "../../components/Graphs/LineGraph"
import HorizontalBarGraph from "../../components/Graphs/HorizontalBarGraph"
import List from "../../components/Graphs/List"
import {GetPurchasedProfit, GetPurchasedQuantities, GetPurchasedDates} from "../../hooks/PurchasesHooks"
import {Button} from "../../components/Button"
import {PurchasedItem} from "../../middleware/Interfaces"
import {GetPurchases} from "../../hooks/ApiCalls"

export default function Purchases(){

    const [purchases, setPurchases] = useState<PurchasedItem[]>([]);
    const [purchaseList, setPurchaseList] = useState<PurchasedItem[]>([]);
    const [display, setDisplay] = useState<string>("bar");
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [limit, setLimit] = useState(0);
    const rowsPerPage = 5;
  
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;

    useEffect(()=>{
        GetPurchases((e:PurchasedItem[])=>setPurchases(e), limit);
    },[limit])

    useEffect(()=>{
        GetPurchases((e:PurchasedItem[])=>setPurchaseList(e));
        if(purchaseList.length && purchases.length){
            setLoading(true);
        }

    },[purchaseList.length, purchases.length])

    return(
        <main id = "purchase">
            <Nav pageHeading = {"Purchase History"}/>
                {loading ?
                <section className = "flex flex-col alignCenter justifyBetween">

                    <section className = "flex justifyBetween buttons">
                        {Button({text:"", handleButtonClick: ()=>setDisplay("bar"), classNames: "fa-solid fa-chart-column"})}
                        {Button({text:"", handleButtonClick: ()=>setDisplay("line"), classNames: "fa-solid fa-chart-line"})}
                        {Button({text:"", handleButtonClick: ()=>setDisplay("horizontalBar"), classNames: "fa-solid fa-chart-bar"})}
                        {Button({text:"", handleButtonClick: ()=>setDisplay("list"), classNames: "fa-solid fa-list"})}
                    </section>

                    <section className = "graph">
                        {display === "bar" ? <BarGraph setLimit = {(e:number)=>setLimit(e)} limit = {limit} length = {purchaseList.length} cartLength = {purchases.length} dates = {GetPurchasedDates(purchases)} profits = {GetPurchasedProfit(purchases)} quantities ={GetPurchasedQuantities(purchases)} currentPage = {currentPage} setCurrentPage={(e:number)=>setCurrentPage(e)} rowsPerPage = {rowsPerPage} startIndex = {startIndex} endIndex = {endIndex}/> : ""}
                    </section>

                    <section className = "graph">
                        {display === "line" ? <LineGraph  setLimit = {(e:number)=>setLimit(e)} limit = {limit} cartLength = {purchases.length} length = {purchaseList.length} dates = {GetPurchasedDates(purchases)} profits = {GetPurchasedProfit(purchases)} quantities ={GetPurchasedQuantities(purchases)} currentPage = {currentPage} setCurrentPage={(e:number)=>setCurrentPage(e)} rowsPerPage = {rowsPerPage} startIndex = {startIndex} endIndex = {endIndex}/> : ""}
                    </section>

                    <section className ="graph">
                        {display === "horizontalBar" ? <HorizontalBarGraph setLimit = {(e:number)=>setLimit(e)} limit = {limit} length = {purchaseList.length} dates = {GetPurchasedDates(purchases)} quantities = {GetPurchasedQuantities(purchases)} cartLength = {purchases.length} profits = {GetPurchasedProfit(purchases)} currentPage = {currentPage} setCurrentPage = {(e:number)=>setCurrentPage(e)} rowsPerPage={rowsPerPage} startIndex = {startIndex} endIndex={endIndex}/> : ""}
                    </section>

                    <section className = "graph">
                        {display === "list" ? <List setCurrentPage={(e:number)=>setCurrentPage(e)} currentPage={currentPage} rowsPerPage = {rowsPerPage} startIndex={startIndex} endIndex={endIndex}/> : ""}
                    </section>

                </section>
                :
                <h1 className = "textAlignCenter">Loading...</h1>
                }
            <Footer/>
        </main>
    )
}