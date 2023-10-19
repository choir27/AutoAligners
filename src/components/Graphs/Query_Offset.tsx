import React from "react"
import { GetPurchases } from "../../hooks/ApiCalls";

export default function Query_Offset(itemLength: number, limit: number, setLimit: (e:number)=>void){
    const buttons = [];
    

    for(let i = 0; i< itemLength; i+=25){
        if(i+25 !== limit){
            buttons.push(<button 
                key = {i}
                className = "clearButton" onClick = {(e: React.MouseEvent<HTMLButtonElement, MouseEvent>)=>{
                e.preventDefault();
                setLimit(i+25)
                GetPurchases((e:any)=>e, i+25)
            }}>{i+25}</button>)
        }else{
            buttons.push(<button 
                key = {i}
                className = "clearButton clicked" onClick = {(e: React.MouseEvent<HTMLButtonElement, MouseEvent>)=>{
                e.preventDefault();
                setLimit(i+25)
                GetPurchases((e:any)=>e, i+25)
            }}>{i+25}</button>)
        }
    }

    return(
        <section>
            <section className="flex alignCenter">
                <h2>Configure Range of Items Displayed</h2> 
                <section className="flex alignCenter">
                    {buttons}
                </section>
            </section>
        </section>
    )
}