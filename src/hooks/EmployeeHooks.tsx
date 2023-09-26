import {PurchasedItem} from "./PurchasesHooks" 
import {Input} from "./ReservationHooks"
import api from "../api/api"
import Nav from "../components/Nav"
import Footer from "../components/Footer"
import {ButtonLink, Button} from "../components/Button"
import {User} from "./LoginHooks"
import {Permission, Role} from "appwrite"
import {toast} from "react-toastify"
import {toggleDisplay} from "./FinanceHooks"
import PaginatedButtons from "../components/Graphs/PaginatedButtons"

export interface Profile{
    $id: string,
    email?: string,
    fileName: string,
    image: string,
    position: string,
    PTO: string,
    salary: string,
    requestedPTO: string,
    requests: string[]
}

export interface PTO{
    PTO: string, 
    PTOStartDate: string, 
    PTOEndDate: string,
    userID: string,
    $id: string,
    email: string,
    name: string,
}

interface PTORequests{
    currentPTOPage:number, 
    setCurrentPTOPage: (e:number)=>void,
    rows: number, 
    setPTODisplay: (e:boolean)=>void,
    PTODisplay: boolean, 
    PTORequests: PTO[],
    firstIndex: number, 
    lastIndex: number
}


interface Approve{
    PTO: string,
    email: string, 
    name: string, 
    userID: string, 
    startDate: string, 
    endDate: string,
    $id: string
}

interface History{
    currentPage: number, 
    setCurrentPage: (e:number)=>void, 
    rows: number, 
    startIndex: number, 
    endIndex: number, 
    requests?:string[]
}

interface Customize{
    listOfUsers: User[], 
    email: string, 
    salary: string, 
    position: string, 
    PTO: string
}

export function RenderEmployeeAppointments(purchases: PurchasedItem[], startIndex: number, endIndex: number){

    return purchases.map((cart: PurchasedItem,i: number)=>{
        let cartTotal = 0;

        for(let i = 0; i < cart.cartItems.length; i++){
            const cartItem:PurchasedItem = JSON.parse(cart.cartItems[i]);
            if(cartItem.email === localStorage.getItem("email")){

            const itemTotal = Number(cartItem.price) * parseInt(cartItem.quantity)
            
            cartTotal += itemTotal
            }
        }

        return(
            <section key = {`${cart.$createdAt}-${i}`} className = "flex justifyEvenly cartItem">
                <h2>Items Sold: {cart.cartItems.length}</h2>
                <h2>Total: ${cartTotal.toFixed(2)}</h2>
            </section>
        )

    }).slice(startIndex,endIndex)  
}

export function RenderEmployeeProfit(purchases: PurchasedItem[]){
    let cartTotal = 0;

    purchases.forEach((cart: PurchasedItem)=>{
        for(let i = 0; i < cart.cartItems.length; i++){
            const cartItem:PurchasedItem = JSON.parse(cart.cartItems[i]);

            if(cartItem.email === localStorage.getItem("email")){
        
            const itemTotal = Number(cartItem.price) * parseInt(cartItem.quantity)
            
            cartTotal += itemTotal
            }
        }
    })

    return cartTotal.toFixed(2)
}

export async function handleAddProfileImage(id: string, file: FileList | null | undefined){
    try{
        api.createImage(id, file)
    }catch(err){
        console.error(err);
    }
}

export function FileInput(setFile: (e:FileList | null)=>void){
    return(
        <input
        type = "file"
        id = "file"
        name = "file"
        className = "displayNone"
        onChange = {(e: React.ChangeEvent<HTMLInputElement>)=>{
            const test:FileList | null = e.target.files
            setFile(test)
        }}
        />
    )
}

export function EmployeeForm(setSalary:(e:string)=>void,setPosition:(e:string)=>void){
    return(
        <section className = "flex flex-col alignCenter justifyCenter ">
            {Input({type: "text", onChange: (e)=>setSalary(e), placeholder: "Set Salary"})}
            {Input({type: "text", onChange: (e)=>setPosition(e), placeholder: "Set Position"})}
        </section>
    )
}

export async function GetEmployee(setEmployee: (e:Profile)=>void){
    try{
        const data = await api.listDocuments(process.env.REACT_APP_DATABASE_ID, process.env.REACT_APP_PROFILE_COLLECTION_ID)

        if(data.documents.length){
        const findUser = data.documents.filter((user:Profile)=>localStorage.getItem("email") === user.email)[0]
        
        setEmployee(findUser)
        }

    }catch(err){
        console.error(err);
    }
}


export function EmployeeButtons(){
    return(
        <main className = "flex flex-col justifyBetween">
                <Nav pageHeading = {localStorage.getItem("email") ? "Employee Hub" : "Login/Demo"}/>


            <section className = "flex flex-col alignCenter" id = "employee">
                <nav>
                    <ul className = "flex justifyBetween flex-col">
                        {localStorage.getItem("email") ? "" : <li className = "textAlignCenter">{ButtonLink({domain : "/adminDemo", text: "Admin Demo"})}</li>}
                        {localStorage.getItem("email") ? "" : <li className = "textAlignCenter">{ButtonLink({domain : "/demo", text: "Demo"})}</li>}
                        {localStorage.getItem("email") ? "" : <li className = "textAlignCenter">{ButtonLink({domain: "/login", text: "Login"})}</li>}
                    </ul>
                </nav>
            </section>

            <Footer/>
        </main>
    )
}

export async function handleEmployeeCustomization(props: Customize){
    try{
        if(props.email && (props.salary || props.position || props.PTO)){

            const findUser = props.listOfUsers.filter((employee:User)=>employee.email===props.email)[0]

            const employeeList = await api.listDocuments(process.env.REACT_APP_DATABASE_ID, process.env.REACT_APP_PROFILE_COLLECTION_ID)

            const findEmployee = employeeList.documents.filter((employee:Profile)=>employee.email === props.email)
            
            const data = {
                userID: findUser.$id,
                email: props.email,
                salary: props.salary ? props.salary : findEmployee[0].salary ,
                position: props.position ? props.position: findEmployee[0].position,
                PTO: props.PTO ? props.PTO : findEmployee[0].PTO
            }

            if(findEmployee.length){
              await api.updateDocument(process.env.REACT_APP_DATABASE_ID, process.env.REACT_APP_PROFILE_COLLECTION_ID, findEmployee[0].$id, data)
              window.location.reload();
            }else{
              await api.createDocument(process.env.REACT_APP_DATABASE_ID, process.env.REACT_APP_PROFILE_COLLECTION_ID, data, [Permission.read(Role.any())])
              window.location.reload();
            }
        }else{
                toast.error("Please Fill Out Your Email And At Least The Salary, Position, Or PTO Inputs And Try Again!")
        }
        
    }catch(err){
        console.error(err);
    }
}

export async function AutomaticPTO(){
    try{

        const date = new Date();
        const currentMonth = date.getMonth() + 1
        const currentDay = date.getDate();

        if(currentMonth===1 && currentDay === 1 && !localStorage.getItem("PTO")){
            const employeeList = await api.listDocuments(process.env.REACT_APP_DATABASE_ID, process.env.REACT_APP_PROFILE_COLLECTION_ID)

            employeeList.documents.forEach(async(user:User)=>{
                const data = {
                    userID: user.$id,
                    email: user.email,
                    PTO: "40"
                }

                  await api.updateDocument(process.env.REACT_APP_DATABASE_ID, process.env.REACT_APP_PROFILE_COLLECTION_ID, user.$id, data)
            })
            localStorage.setItem("PTO", "Refill done");
        }else{
            localStorage.setItem("PTO", "");
        }

    }catch(err){
        console.error(err);
    }
}

export async function handlePTO(listOfUsers: User[], PTO: string, PTOStartDate: string, PTOEndDate: string){
    try{

        const findUser = listOfUsers.filter((employee:User)=>employee.email===localStorage.getItem("email"))[0]

        const employeeList = await api.listDocuments(process.env.REACT_APP_DATABASE_ID, process.env.REACT_APP_PROFILE_COLLECTION_ID)

        const findEmployee = employeeList.documents.filter((employee:Profile)=>employee.email === localStorage.getItem("email"))


        const PTOStartMonth = parseInt(PTOStartDate.split("-")[1]);
        const PTOStartYear = parseInt(PTOStartDate.split("-")[0]);
        const PTOStartDay = parseInt(PTOStartDate.split("-")[2]);

        const PTOEndMonth = parseInt(PTOEndDate.split("-")[1]);
        const PTOEndYear = parseInt(PTOEndDate.split("-")[0]);
        const PTOEndDay = parseInt(PTOEndDate.split("-")[2]);

        const currentDate = new Date();

        const currentMonth = currentDate.getMonth() + 1;
        const currentDay = currentDate.getDate();
        const currentYear = currentDate.getFullYear();

        if(!PTOEndDay || !PTOStartDate || !Number(PTO)){
            toast.error("Please make sure all input fields are filled out or are valid.");
            return; 
        }

        //if start < 2023 or end < 2023 or start or end are greater than 2024 or end year is less than start year
        if(PTOStartYear > PTOEndYear || PTOStartYear < currentYear || PTOEndYear < currentYear || PTOStartYear > currentYear + 1 || PTOEndYear > currentYear + 1){
            toast.error("Year requested for PTO is invalid");
            return;
        }else if((PTOStartMonth > PTOEndMonth) || (PTOStartMonth < currentMonth && PTOStartYear === currentYear) || ((PTOEndMonth < currentMonth) && (PTOEndYear === currentYear)) || ((PTOStartMonth > currentMonth + 6) && (PTOStartYear === currentYear)) || ((PTOEndMonth > currentMonth + 6) && (PTOEndYear === currentYear))){
            //start end month < 9 or end month < 9 and end year is 2023 && start year is 2023 and end month is at least greater than start month
            //makes sure the end or start months are no more than 6 months after the current month assuming the current years are the same as the current year
            toast.error("Month requested for PTO is invalid");
            return;
        }else if(((PTOStartDay < currentDay) && (PTOStartMonth === currentMonth && PTOStartYear === currentYear)) || ((PTOEndDay < currentDay) && (PTOEndMonth === currentMonth && PTOEndYear === currentYear))){
            //start day < current day && start year is 2023 && start month is 9
            //end day < current day && end year is 2023 && end month is 9
            toast.error("Day requested for PTO is invalid");
            console.log("test1")
            return;
        }else if(((PTOStartDay <= currentDay + 14 && PTOStartMonth === currentMonth) || ((PTOEndDay - PTOStartDay) > 14)) && PTOEndMonth === PTOStartMonth){
            //start day is at least more than 15 days from current day and the month for both end and start are the same
            //end day - start day is no more than 14 days assuming the end and start months are the same as the current month
            toast.error("Day requested for PTO is invalid");
            console.log("test2")
            return;
        }else if(((PTOEndDay <= currentDay + 14) && (PTOEndMonth === currentMonth)) || ((PTOEndDay < PTOStartDay) && (PTOEndMonth === PTOStartMonth))){
            //end day is at least more than 15 days from current day and the month for both end and start are the same
            //end day is less than start day assuming start and end months are the same
            toast.error("Day requested for PTO is invalid");
            console.log("test3")
            return;
        }else if(PTOEndMonth > PTOStartMonth){
            if((PTOStartMonth === 1 || PTOStartMonth === 3 || PTOStartMonth === 5 || PTOStartMonth === 7 || PTOStartMonth === 8 || PTOStartMonth === 10) && ((31 - PTOStartDay) + PTOEndDay > 14)){
                toast.error("Day requested for PTO is invalid");
                console.log("test4")
                return;
            }else if((PTOStartMonth === 4 || PTOStartMonth === 6 || PTOStartMonth === 9 || PTOStartMonth === 11) && ((30 - PTOStartDay) + PTOEndDay > 14)){
                toast.error("Day requested for PTO is invalid");
                console.log("test5")
                return;
            }else if(PTOStartMonth === 2 && PTOStartYear % 4 !== 0 && ((28 - PTOStartDay) + PTOEndDay > 14)){
                toast.error("Day requested for PTO is invalid");
                console.log("test6")
                return;
            }else if(PTOStartMonth === 2 && PTOStartYear % 4 === 0 && ((29 - PTOStartDay) + PTOEndDay > 14)){
                toast.error("Day requested for PTO is invalid");
                console.log("test6")
                return;
            }
        } 

        
        if(((Number(findEmployee[0].PTO) - Number(PTO)) < 0) && (Number(PTO) >= Number(findEmployee[0].PTO))){
            toast.error("Not enough PTO balance for the requested PTO time");
            return;
        }else if(Number(PTO)<0){
            toast.error("Invalid PTO request");
            return;
        }

        const data = {
            name: findUser.name,
            userID: findUser.$id,
            email: localStorage.getItem("email"),
            PTO: PTO,
            PTOStartDate: PTOStartDate,
            PTOEndDate: PTOEndDate
        };

        await api.createDocument(process.env.REACT_APP_DATABASE_ID, process.env.REACT_APP_PTO_COLLECTION_ID, data, [Permission.read(Role.any())]);

        window.location.reload();

    }catch(err){
        console.error(err);
    }
}

async function ApprovePTO(props: Approve){
    try{

        const employeeList = await api.listDocuments(process.env.REACT_APP_DATABASE_ID, process.env.REACT_APP_PROFILE_COLLECTION_ID)

        const findEmployee = employeeList.documents.filter((employee:Profile)=>employee.email === props.email)

        if(((Number(findEmployee[0].PTO) - Number(props.PTO)) >= 0) && Number(props.PTO) && (Number(props.PTO) <= Number(findEmployee[0].PTO))){

            if(findEmployee.length){

                if(findEmployee[0].requests){
                    findEmployee[0].requests.push(JSON.stringify({startDate: props.startDate, endDate: props.endDate, status: "approved"}))
                    
                }

                const data = {
                    userID: props.userID,
                    email: props.email,
                    PTO: (Number(findEmployee[0].PTO) - Number(props.PTO)).toString(),
                    requests: findEmployee[0].requests ? findEmployee[0].requests : [JSON.stringify({startDate: props.startDate, endDate: props.endDate, status: "approved"})]
                };

              await api.updateDocument(process.env.REACT_APP_DATABASE_ID, process.env.REACT_APP_PROFILE_COLLECTION_ID, findEmployee[0].$id, data)
              await api.deleteDocument(process.env.REACT_APP_DATABASE_ID, process.env.REACT_APP_PTO_COLLECTION_ID, props.$id)
              window.location.reload();
            }else{

                const data = {
                    userID: props.userID,
                    email: props.email,
                    PTO: (Number(findEmployee[0].PTO) - Number(props.PTO)).toString(),
                    requests: [JSON.stringify({startDate: props.startDate, endDate: props.endDate, status: "approved"})]
                };


              await api.createDocument(process.env.REACT_APP_DATABASE_ID, process.env.REACT_APP_PROFILE_COLLECTION_ID, data, [Permission.read(Role.any())])
              await api.deleteDocument(process.env.REACT_APP_DATABASE_ID, process.env.REACT_APP_PTO_COLLECTION_ID, props.$id)

              window.location.reload();
            }
        }else{
            toast.error("Please fill out the PTO input with a valid value and try again!")
        }
    }catch(err){
        console.error(err);
    }
}

async function DenyPTO(props: Approve){
    try{
        const employeeList = await api.listDocuments(process.env.REACT_APP_DATABASE_ID, process.env.REACT_APP_PROFILE_COLLECTION_ID)

        const findEmployee = employeeList.documents.filter((employee:Profile)=>employee.email === props.email)

        if(findEmployee.length){
            if(findEmployee[0].requests){
                findEmployee[0].requests.push(JSON.stringify({startDate: props.startDate, endDate: props.endDate, status: "denied"}))
                
            }

            const data = {
                userID: props.userID,
                email: props.email,
                requests: findEmployee[0].requests ? findEmployee[0].requests : [JSON.stringify({startDate: props.startDate, endDate: props.endDate, status: "denied"})]
            };

          await api.updateDocument(process.env.REACT_APP_DATABASE_ID, process.env.REACT_APP_PROFILE_COLLECTION_ID, findEmployee[0].$id, data)
          await api.deleteDocument(process.env.REACT_APP_DATABASE_ID, process.env.REACT_APP_PTO_COLLECTION_ID, props.$id)
          window.location.reload();
        }else{
            const data = {
                userID: props.userID,
                email: props.email,
                requests: [JSON.stringify({startDate: props.startDate, endDate: props.endDate, status: "denied"})]
            };


          await api.createDocument(process.env.REACT_APP_DATABASE_ID, process.env.REACT_APP_PROFILE_COLLECTION_ID, data, [Permission.read(Role.any())])
          await api.deleteDocument(process.env.REACT_APP_DATABASE_ID, process.env.REACT_APP_PTO_COLLECTION_ID, props.$id)
          window.location.reload();
        }
        
    }catch(err){
        console.error(err);
    }
}

export function RenderPTORequests(props: PTORequests){


    const requests = props.PTORequests?.map((user:PTO)=>{
        return(
            <ul key = {user.$id} className = "flex flex-col alignCenter userDisplays">
                <li>Name: {user.name}</li>
                <li>Email: {user.email}</li>
                <li>{user.PTOStartDate} - {user.PTOEndDate}</li>
                <li className = "flex"><span>Hours: {user.PTO}</span>{Button({text: "", classNames: "fa-solid fa-check", handleButtonClick: ()=>ApprovePTO({PTO: user.PTO, name: user.name, email: user.email, userID: user.userID, startDate: user.PTOStartDate, endDate: user.PTOEndDate, $id: user.$id})})}{Button({text: "", classNames: "fa-solid fa-xmark", handleButtonClick: ()=>DenyPTO({PTO: user.PTO, name: user.name, email: user.email, userID: user.userID, startDate: user.PTOStartDate, endDate: user.PTOEndDate, $id: user.$id})})}</li>
            </ul>
        )
    }).slice(props.firstIndex, props.lastIndex);
        
    return(
        <section className = "flex flex-col alignCenter PTO">
            <h3>Current PTO Requests</h3>

            <PaginatedButtons currentPage = {props.currentPTOPage} cartLength = {props.PTORequests.length} setCurrentPage = {(e:number)=>props.setCurrentPTOPage(e)} rowsPerPage={props.rows}/>

            <section>
                {requests.length ? requests : <h2>No PTO Requests</h2>}
            </section>

            {Button({text: "Show Employee Customization", handleButtonClick: () => toggleDisplay((e:boolean)=>props.setPTODisplay(e), props.PTODisplay)})}

        </section>
    )
}

export async function GetPTORequests(setPTORequests: (e:PTO[])=>void){
    try{
        const data = await api.listDocuments(process.env.REACT_APP_DATABASE_ID, process.env.REACT_APP_PTO_COLLECTION_ID);
        setPTORequests(data.documents);
    }catch(err){
        console.error(err);
    }
}

export function RenderRequestHistory(props: History){
    if(props.requests){
        if(props.requests.length){

            let i = 0;
            const requestDisplay = props.requests.map((request:string)=>{
                const parse = JSON.parse(request)
                return(
                    <section key = {i++}>
                        <h2>{parse.startDate} - {parse.endDate}</h2>
                        <h2>{parse.status}</h2>
                    </section>
                )
            }).slice(props.startIndex, props.endIndex)


            return (
                <section>
                    <PaginatedButtons currentPage = {props.currentPage} cartLength = {props.requests.length} setCurrentPage = {(e:number)=>props.setCurrentPage(e)} rowsPerPage={props.rows}/>
                    
                    {requestDisplay}
                </section>

            )
        }
    }
}