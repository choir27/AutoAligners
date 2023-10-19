import {Input} from "./ReservationHooks"
import api from "../api/api"
import Nav from "../components/Nav"
import Footer from "../components/Footer"
import {ButtonLink, Button} from "../components/Button"
import {Permission, Role} from "appwrite"
import {toast} from "react-toastify"
import {toggleDisplay} from "./FinanceHooks"
import PaginatedButtons from "../components/Graphs/PaginatedButtons"
import {PurchasedItem, Profile, PTO, PTORequests, Approve, History, Customize, Notification, User} from "../middleware/Interfaces"
import {cacheEmail, cachePTO, SetCachePTO} from "../middleware/Cache"

export function RenderEmployeeAppointments(purchases: PurchasedItem[], startIndex: number, endIndex: number){

    return purchases.map((cart: PurchasedItem,i: number)=>{
        let cartTotal = 0;

        for(let i = 0; i < cart.cartItems.length; i++){
            const cartItem:PurchasedItem = JSON.parse(cart.cartItems[i]);
            if(cartItem.email === cacheEmail){

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

            if(cartItem.email === cacheEmail){
        
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

export function EmployeeButtons(){
    return(
        <main className = "flex flex-col justifyBetween">
                <Nav pageHeading = {cacheEmail ? "Employee Hub" : "Login/Demo"}/>


            <section className = "flex flex-col alignCenter" id = "employee">
                <nav>
                    <ul className = "flex justifyBetween flex-col">
                        {cacheEmail ? "" : <li className = "textAlignCenter">{ButtonLink({domain : "/adminDemo", text: "Admin Demo"})}</li>}
                        {cacheEmail ? "" : <li className = "textAlignCenter">{ButtonLink({domain : "/demo", text: "Demo"})}</li>}
                        {cacheEmail ? "" : <li className = "textAlignCenter">{ButtonLink({domain: "/login", text: "Login"})}</li>}
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

        if(currentMonth===1 && currentDay === 1 && !cachePTO){
            const employeeList = await api.listDocuments(process.env.REACT_APP_DATABASE_ID, process.env.REACT_APP_PROFILE_COLLECTION_ID)

            employeeList.documents.forEach(async(user:User)=>{
                const data = {
                    userID: user.$id,
                    email: user.email,
                    PTO: "40"
                }

                  await api.updateDocument(process.env.REACT_APP_DATABASE_ID, process.env.REACT_APP_PROFILE_COLLECTION_ID, user.$id, data)
            })
            SetCachePTO("Refill done");
        }else{
            SetCachePTO("")
        }

    }catch(err){
        console.error(err);
    }
}

export async function handlePTO(listOfUsers: User[], PTO: string, PTOStartDate: string, PTOEndDate: string){
    try{

        const findUser = listOfUsers.filter((employee:User)=>employee.email===cacheEmail)[0]

        const employeeList = await api.listDocuments(process.env.REACT_APP_DATABASE_ID, process.env.REACT_APP_PROFILE_COLLECTION_ID)

        const findEmployee = employeeList.documents.filter((employee:Profile)=>employee.email === cacheEmail)

        const start = new Date(PTOStartDate.split("-").join(", "));
        const end = new Date(PTOEndDate.split("-").join(", "));

        const PTOStartMonth = start.getMonth() +1;
        const PTOStartYear = start.getFullYear();
        const PTOStartDay = start.getDate();

        const PTOEndMonth =  end.getMonth() +1;
        const PTOEndYear = end.getFullYear();
        const PTOEndDay = end.getDate();

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
        }else if((PTOStartMonth > PTOEndMonth && PTOStartYear === PTOEndYear) || (PTOStartMonth < currentMonth && PTOStartYear === currentYear) || ((PTOEndMonth < currentMonth) && (PTOEndYear === currentYear)) || ((PTOStartMonth > currentMonth + 6) && (PTOStartYear === currentYear)) || ((PTOEndMonth > currentMonth + 6) && (PTOEndYear === currentYear))){
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

        const daysOfWeek = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
        
        const startPTODay = daysOfWeek[start.getDay()];
        const endPTODay = daysOfWeek[end.getDay()];

        if(startPTODay === "saturday" || startPTODay === "sunday" || endPTODay === "saturday" || endPTODay === "sunday"){
            console.log("weekend")
        }

        const holidayDates:string[] = ["1/1", "7/4", "11/11", "12/25", "12/31"];
        
        holidayDates.forEach((holiday: string)=>{
            const month = Number(holiday.split("/")[0]);
            const date = Number(holiday.split("/")[1]);
            if((month === PTOStartMonth && date === PTOStartDay) || (month === PTOEndMonth && date === PTOEndDay)){
                console.log("holiday detected");
            }
        });

        function nthWeekdayOfMonth(weekday:number, n:number, month:Date) {
            const date = new Date(month.getFullYear(), month.getMonth(), 1),
                add = (weekday - month.getDay() + 7) % 7 + (n - 1) * 7;
            month.setDate(1 + add);
            return date;
          }

        // Memorial Day last Monday in May
     
          const martin = nthWeekdayOfMonth(1, 3, new Date(currentYear, 0));
          const labor = nthWeekdayOfMonth(1, 1, new Date(currentYear, 8));
          const thanksgiving = nthWeekdayOfMonth(1, 4, new Date(currentYear, 10));


          if((martin.getMonth() === PTOStartMonth && martin.getDate() === PTOStartDay) || (martin.getMonth() === PTOEndMonth && martin.getDate() === PTOEndDay)){
            console.log("Martin Luther King Jr. Day")
          }else if((labor.getMonth() === PTOStartMonth && labor.getDate() === PTOStartDay) || (labor.getMonth() === PTOEndMonth && labor.getDate() === PTOEndDay)){
            console.log("Labor Day")
          }else if((thanksgiving.getMonth() === PTOStartMonth && thanksgiving.getDate() === PTOStartDay) || (thanksgiving.getMonth() === PTOEndMonth && thanksgiving.getDate() === PTOEndDay)){
            console.log("Thanksgiving")
          }

          console.log(findUser)
        
        const data = {
            name: findUser.name,
            userID: findUser.$id,
            email: cacheEmail,
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

export async function CheckPTOExpiration(){
    try{
        const employeeList = await api.listDocuments(process.env.REACT_APP_DATABASE_ID, process.env.REACT_APP_PROFILE_COLLECTION_ID)

        const findExpiredPTO = employeeList.documents.filter((user:Profile)=>{
            const filtered = [];
            for(let i = 0; i < user.requests.length; i++){
                const parse = JSON.parse(user.requests[i]);

                const year = parse.endDate.split("-")[0];
                const month = parse.endDate.split("-")[1];
                const day = parse.endDate.split("-")[2];

                const date = new Date();
                const currentMonth = date.getMonth()+1;
                const currentYear = date.getFullYear();
                const currentDay = date.getDate();

                if(month <= currentMonth && day <= currentDay+1 && year <= currentYear){
                    const account = user;
                    account.requests.splice(user.requests.indexOf(user.requests[i]),1);
                    filtered.push(account)
                }
            }
            if(filtered.length){
                return filtered
            }
        })

        if(findExpiredPTO.length){

            const data = {
                email: findExpiredPTO[0].email,
                requests: findExpiredPTO[0].requests,
                userID: findExpiredPTO[0].userID
            }

            await api.updateDocument(process.env.REACT_APP_DATABASE_ID, process.env.REACT_APP_PROFILE_COLLECTION_ID, findExpiredPTO[0].$id, data)

        }
        
    }catch(err){
        console.error(err);
    }
}

export function PTONotification(props: Notification){
    if(props.requests){
        if(props.requests.length){

            let upcomingMonth = 0;
            let upcomingYear = 0;
            let upcomingDay = 0;

            // const length =  props.requests.length

            const test = props.requests.map((request:string, i:number)=>{
                const parse = JSON.parse(request)
                if(parse.status === "approved"){
                    const year = parse.startDate.split("-")[0];
                    const month = parse.startDate.split("-")[1];
                    const day = parse.startDate.split("-")[2];

                    if(!i){
                        upcomingMonth = month
                        upcomingYear = year
                        upcomingDay = day
                    }else if(year < upcomingYear){
                        upcomingMonth = month
                        upcomingYear = year
                        upcomingDay = day
                    }else if(year <= upcomingYear && month <= upcomingMonth){
                        upcomingMonth = month
                        upcomingYear = year
                        upcomingDay = day
                    }else if(year <= upcomingYear && month <= upcomingMonth && day <= upcomingDay){
                        upcomingMonth = month
                        upcomingYear = year
                        upcomingDay = day
                    }
                    
                        return (<div key = {`${month}/${day}/${year}`}>
                        <h2>Upcoming Approved PTO: {upcomingYear}/{upcomingMonth}/{upcomingDay}</h2>
                        </div>)

                }
            })

            console.log(test)

            return test

        }
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