import {Button} from "../components/Button"
import { RenderPaymentForm} from "./CartHooks"
import api from "../api/api"
import {Permission, Role} from "appwrite"
import {CardInfo, FinanceDisplay, ClientFinance, EditFinance, TableContent} from "../middleware/Interfaces"

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


async function deleteClientFinance(id:string){
try{
    const data = await api.deleteDocument(process.env.REACT_APP_CART_DATABASE_ID, process.env.REACT_APP_FINANCE_PAYMENTS_COLLECTION_ID, id)
    console.log(data)
    window.location.reload();
}catch(err){
    console.error(err)
}
}

async function editClientFinance(id:string, financeTotal: string, email: string){
try{
    const data = {
        email,
        financeTotal        
    }

    await api.updateDocument(process.env.REACT_APP_CART_DATABASE_ID, process.env.REACT_APP_FINANCE_PAYMENTS_COLLECTION_ID, id, data)

    window.location.reload();
}catch(err){
    console.error(err)
}
}

export function checkDate(clientFinance: ClientFinance[]){
    try{
        const currentDate = new Date();
        const month = currentDate.getMonth() + 1
            
        const financeDates = clientFinance.filter((client:ClientFinance)=>{
            const financeArray = client.$updatedAt.split("T")[0].split("-");
            
            if(parseInt(financeArray[1]) < month){
               return client.financeTotal
            }

        })

        financeDates.forEach( async (client: ClientFinance)=>{

            client.cardAmount -= parseInt(client.financeTotal)

            const data = {
                cardAmount: client.cardAmount 
            }

            await api.updateDocument(process.env.REACT_APP_CART_DATABASE_ID, process.env.REACT_APP_FINANCE_PAYMENTS_COLLECTION_ID, client.$id, data)
        })
    
    }catch(err){
        console.error(err)
    }
}



export function renderEditFinanceDisplay(props: EditFinance){

    const findClient = props.clientFinance.filter((clientFinance: ClientFinance)=>clientFinance.$id === props.client)

    return(
    <section className = "flex flex-col alignCenter purchase">

        {Button({text: "Go Back", handleButtonClick: ()=>toggleDisplay((e:boolean)=>props.setDisplay(e), props.display)})}

        <h1>Edit Client Finance</h1>
        
        <input defaultValue = {findClient[0].email} type = "email" onChange = {(e)=>props.setEmail(e.target.value)}/>

        <h2>Manage Client Finance Plan</h2>

        <select defaultValue = {findClient[0].financeTotal} onChange = {(e)=>props.setFinanceTotal(e.target.value)}>
            <option>199</option>
            <option>120</option>
            <option>75</option>
        </select>

        <button className = "clearButton" onClick = {()=>editClientFinance(props.client, props.financeTotal, props.email)}>Edit Finance</button>
    </section>
    )
}


export function RenderClientFinance(props: TableContent){

    const tableContent = props.clientFinance.map((client: ClientFinance, i: number)=>{
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
            <td><button className = "fa-solid fa-trash clearButton" onClick = {(e:React.MouseEvent<HTMLButtonElement, MouseEvent>)=>{
                e.preventDefault();
                deleteClientFinance(client.$id);
            }}></button></td>
            <td><button className = "fa-solid fa-pen-to-square clearButton" onClick = {(e:React.MouseEvent<HTMLButtonElement, MouseEvent>)=>{
                e.preventDefault();
                props.setDisplayFinance(!props.displayFinance)
                props.setClient(client.$id);
                props.setFinanceTotal(client.financeTotal)
                props.setEmail(client.email)
            }}></button></td>
        </tr>
        )
    }).slice(props.startIndex,props.endIndex)


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
