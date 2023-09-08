import {Button} from "../components/Button"
import { RenderPaymentForm, CardInfo } from "./CartHooks"
import api from "../api/api"
import {Permission, Role} from "appwrite"

export interface FinanceDisplay{
    text:string, 
    display: boolean, 
    setDisplay: (e:boolean) => void, 
    cardInfo: CardInfo | undefined, 
    setCardInfo: (e:CardInfo)=>void,
    email: string,
    setEmail: (e:string) => void,
}

export interface ClientFinance{
$id: string,
$updatedAt: string,
$createdAt: string,
cardAmount: number,
cardNumber: number,
email: string,
expirationDate: string,
financeTotal: string,
securityNumber: string,
type: string
}

export function toggleDisplay(setDisplay: (e:boolean)=>void, display: boolean){
    setDisplay(!display)
}

async function handlePayment(financeTotal: string, email: string, cardInfo: CardInfo | undefined){
    try{
    const cardAmount = 1000 + Math.ceil(Math.random() * 100000)

    const purchase = {  
        cardAmount,
        email,
        financeTotal,
        type: cardInfo?.type,
        cardNumber: cardInfo?.cardNumber,
        securityNumber: cardInfo?.securityNumber,
        expirationDate: cardInfo?.expirationDate
    }

       await api.createDocument(process.env.REACT_APP_CART_DATABASE_ID, process.env.REACT_APP_FINANCE_PAYMENTS_COLLECTION_ID, purchase, [Permission.read(Role.any())])

       window.location.reload();
    }catch(err){
        console.error(err);
    }
}

export function renderFinanceDisplay(props: FinanceDisplay){

    let financePlanText = ""
    let financeTotal = ""

    if(props.text === "gold"){
        financePlanText = "$199/month includes 12 services/year (Gold + Air Conditioning Service, Wheel Alignment)"
        financeTotal = "199"
    }else if(props.text === "silver"){
        financePlanText = "$120/month includes 6 services per year (Silver Subscription + Brake Check, Engine Diagnostic)."
        financeTotal = "120"
    }else if(props.text === "bronze"){
        financePlanText=  "$75/month includes 3 services per year (Oil Change, Tire Rotation, and 20-point Inspection)."
        financeTotal = "75"
    }

    return( 
        <section className = "flex flex-col alignCenter purchase">

            {Button({text: "Go Back", handleButtonClick: ()=>toggleDisplay((e:boolean)=>props.setDisplay(e), props.display)})}

            <h1>{props.text} Finance Payment Form</h1>
            
            <p>{financePlanText}</p>

            {RenderPaymentForm(props.cardInfo, (e:CardInfo)=>props.setCardInfo(e))}

            <input type="text" disabled defaultValue = {`$${financeTotal}`}/>
            <input type="email" placeholder="Enter Your Email Here!" onChange = {(e)=>props.setEmail(e.target.value)}/>

            <div className="flex justifyBetween">
                {Button({text: "Make Payment", handleButtonClick: ()=>handlePayment(financeTotal, props.email, props.cardInfo)})}
                {Button({text: "Go Back", handleButtonClick: ()=>toggleDisplay((e:boolean)=>props.setDisplay(e), props.display)})}

            </div>

         
        </section>
    )
}

export async function GetClientFinance(setClientFinance: (e:ClientFinance[])=>void){
    try{
        const data = await api.listDocuments(process.env.REACT_APP_CART_DATABASE_ID, process.env.REACT_APP_FINANCE_PAYMENTS_COLLECTION_ID);

        setClientFinance(data.documents);
    }catch(err){
        console.error(err);
    }
}

export function RenderClientFinance(clientFinance: ClientFinance[], startIndex: number, endIndex: number){

    const tableContent = clientFinance.map((client: ClientFinance, i: number)=>{
        const createdAt = client.$createdAt.split("T")
        const updatedAt = client.$updatedAt.split("T")

        let currentPlan = ""

        if(client.financeTotal === "199"){
            currentPlan = "Gold"
        }else if(client.financeTotal === "120"){
            currentPlan = "Silver"
        }else if(client.financeTotal === "75"){
            currentPlan = "Bronze"
        }

        return(
        <tr className = {`${i % 2 === 0 ? "even": "odd"}`} key = {client.$id}>
            <td>{client.email}</td>
            <td>${client.financeTotal}/month</td>
            <td>{currentPlan}</td>
            <td>{createdAt[0]}</td>
            <td>{updatedAt[0]}</td>
            <td><button className = "fa-solid fa-trash clearButton"></button></td>
            <td><button className = "fa-solid fa-pen-to-square clearButton"></button></td>
        </tr>
        )
    }).slice(startIndex,endIndex)


    return(
        <table>
            <thead>
                <tr>
                    <th>Email</th>
                    <th>Plan Cost</th>
                    <th>Plan</th>
                    <th>Created At</th>
                    <th>Updated At</th>
                    <th>Delete</th>
                    <th>Edit</th>
                </tr>
            </thead>
            <tbody>
                {tableContent}
            </tbody>
        </table>
    )
}