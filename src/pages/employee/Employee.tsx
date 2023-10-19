import Nav from "../../components/Nav"
import Footer from "../../components/Footer"
import {useState, useContext, useEffect} from "react"
import {ButtonSubmit, Button} from "../../components/Button"
import {GenerateNewEmployee, handleLogin, DisplayUsers, Input, handleSignUp} from "../../hooks/LoginHooks"
import {RenderRequestHistory, RenderPTORequests, handlePTO, EmployeeButtons, RenderEmployeeAppointments, RenderEmployeeProfit, handleEmployeeCustomization} from "../../hooks/EmployeeHooks"
import PaginatedButtons from "../../components/Graphs/PaginatedButtons"
import ImageUpload from "../../components/Cloudinary/Cloudinary.js";
import {toggleDisplay} from "../../hooks/FinanceHooks"
import { cacheEmail } from "../../middleware/Cache"
import {APIContext} from "../../middleware/Context"
import {User} from "../../middleware/Interfaces"
import {GetUsers} from "../../hooks/ApiCalls"

export function EmployeeHub(){

    const {user, purchases, employee, PTORequests} = useContext(APIContext);

    const [listOfUsers, setListOfUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [email, setEmail] = useState<string>("");
    const [generatedPassword, setGeneratedPassword] = useState<string>("");
    const [employeeId, setEmployeeId] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [name, setName] = useState<string>("");
    const [showPurchases, setShowPurchases] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [currentPTOPage, setCurrentPTOPage] = useState<number>(1); 
    const [salary, setSalary] = useState<string>("");
    const [PTO, setPTO] = useState<string>("");
    const [startPTODate, setStartPTODate] = useState<string>("");
    const [endPTODate, setEndPTODate] = useState<string>("");
    const [position, setPosition] = useState<string>("");
    const [PTODisplay, setPTODisplay] = useState<boolean>(false);
    const [PTORequestDisplay, setPTORequestDisplay] = useState<boolean>(false);

    const rowsPerPage = 3;

    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;  

    const rows = 2;
    const start = (currentPage-1) * rows;
    const end = startIndex + rows

    
    const firstIndex =  (currentPTOPage - 1) * rows;
    const lastIndex = firstIndex + rows;

    useEffect(()=>{
      GetUsers((e:User[])=>setListOfUsers(e), (e:boolean)=>setLoading(e));
  },[listOfUsers])

   
    
    // useEffect(()=>{
    //     AutomaticPTO()
    // },[])

    //example employee id 649c8a408d41d5c02f5c

    const currentDate = new Date();
    const month = currentDate.getMonth() + 1
    const currentMonth = currentDate.getMonth() + 1 < 10 ? "0" + month.toString() : month;
    const currentDay = currentDate.getDate();
    const currentYear = currentDate.getFullYear();


    return(
      <main id = "auth">
          <Nav pageHeading = {user ? `Welcome ${user.name}` : "Login"}/>
    

          <section className = "flex flex-col alignCenter justifyBetween">

          {user ? 
            ""
          :
          <form className = "flex flex-col alignCenter">        
            {Input({type: "email",  name: "email", onChange: (e)=>setEmail(e), placeholder: "Your Email"})}
            {Input({type: "text", name: "employeeId",  onChange: (e)=>setEmployeeId(e), placeholder: "Your EmployeeId"})}
            {Input({type: "text", name: "name",  onChange: (e)=>setName(e), placeholder: "Your Full Name"})}
            {Input({type: "password", name: "password",  onChange: (e)=>setPassword(e), placeholder: "Your Password"})}
  
            {loading? 
            ButtonSubmit({handleButtonClick: ()=>handleLogin({email:email, name: name, password: password, employeeId: employeeId, listOfUsers: listOfUsers}), text: "Login"})
            : <h1>Loading...</h1>
            }
          </form>
          }
  
  
        {user ? 
        user?.$id === "649c8a408d41d5c02f5c" || user?.$id === "64e51b2e84f09ed015ec" ? 
          <section className = "admin flex justifyCenter alignCenter">

            <section className="flex flex-col alignCenter leftContainer">

              <h3 className = "textAlignCenter">Admin Hub</h3>
  
              <form className = "flex flex-col alignCenter">
              {Input({type: "email", name: "email", onChange: (e)=>setEmail(e), placeholder: "Employees Email"})}
              {Input({type: "text", name: "text", onChange: (e)=>setName(e), placeholder: "Employees Name"})}
              {Input({type: "text", name: "password" ,value: generatedPassword, disabled: true, onChange: (e)=>setPassword(e), placeholder: "Employees Password"})}
          
              {generatedPassword ? "" :
              Button({text: "Automate Password for New Employee Account", handleButtonClick: ()=>{GenerateNewEmployee((e:string)=>setPassword(e), (e:string)=>setGeneratedPassword(e))}})
              }
  
              {ButtonSubmit({handleButtonClick: ()=>handleSignUp({email: email, name: name, password: password}), text: "Create Employee Sign Up"})}
              </form>
            </section>


              {PTODisplay ?
              RenderPTORequests({currentPTOPage: currentPTOPage, setCurrentPTOPage: (e:number)=>setCurrentPTOPage(e), rows: rows, setPTODisplay: (e:boolean)=>setPTODisplay(e), PTODisplay: PTODisplay, PTORequests: PTORequests, lastIndex: lastIndex, firstIndex: firstIndex})
              :
              <section className = "flex flex-col">
              {Input({type: "email", name: "email", onChange: (e)=>setEmail(e), placeholder: "Employees Email"})}
              {Input({type: "text", name: "salary", onChange: (e)=>setSalary(e), placeholder: "Set Employees Salary"})}
              {Input({type: "text", name: "position", onChange: (e)=>setPosition(e), placeholder: "Set Employees Position"})}
              {Input({type: "text", name: "PTO", onChange: (e)=>setPTO(e), placeholder: "Set Employees PTO"})}

              {ButtonSubmit({handleButtonClick: ()=>handleEmployeeCustomization({listOfUsers: listOfUsers, email: email, salary: salary, position: position, PTO: PTO}), text: "Customize Employee Information"})}

              {Button({text: "Manage PTO Requests", classNames: "PTODisplay", handleButtonClick: () => toggleDisplay((e:boolean)=>setPTODisplay(e), PTODisplay)})}

              </section>
              }


              <section className="flex flex-col alignCenter rightContainer">
              <PaginatedButtons currentPage = {currentPage} cartLength = {listOfUsers.length} setCurrentPage = {(e:number)=>setCurrentPage(e)} rowsPerPage={rows}/>
              {loading ? DisplayUsers(listOfUsers, user, start, end) : <h1>Loading...</h1>}

              </section>
            
          </section>
  
        :
            <section className = "flex flex-col">
              <h2 className = "flex justifyCenter heading">Employee Hub</h2>

              {/* {PTONotification({requests: employee?.requests})} */}


              <section className="flex justifyBetween alignCenter employee">
                  <section className = "imgContainer">
                      <img src = {employee?.image} className ="profileImg" alt = {employee?.fileName}/>
                      <ImageUpload user = {user}/>
                      </section>
                      <section className="flex flex-col profile">
                      <h2 className = "email">Email: {user.email}</h2>
                      <h2>Start Date: {user.$createdAt.split("T")[0]}</h2>
                      <h2>Total Sales Made: ${RenderEmployeeProfit(purchases)}</h2>
                      <h2>Position: {employee?.position}</h2>
                      <h2>Salary: {employee?.salary}</h2>
                  </section>


                {PTODisplay || showPurchases || PTORequestDisplay ? "" :
                  <section className = "flex flex-col alignCenter justifyBetween buttons">
                    {Button({text: "Request PTO Hub", handleButtonClick: ()=>toggleDisplay((e:boolean)=>setPTODisplay(e),PTODisplay)})}
                    {Button({text: "Sales History Hub", handleButtonClick: ()=> toggleDisplay((e:boolean)=>setShowPurchases(e),showPurchases)})}
                    {Button({text: "PTO Request History Hub", handleButtonClick: ()=>toggleDisplay((e:boolean)=>setPTORequestDisplay(e),PTORequestDisplay)})}
                  </section>
                }


                {PTODisplay ?
                  <section className = "flex flex-col alignCenter PTO">
                    <h2>PTO Balance: {employee?.PTO ? employee?.PTO : 0} Hours</h2>
                    {Input({type: "text", value: PTO, name: "PTO", onChange: (e)=>setPTO(e), placeholder: "Request PTO hours"})}
                      <h2>Vacation Start Date:</h2>
                      {Input({value: startPTODate, type: "date", name: "datetime-local", onChange: (e)=>setStartPTODate(e), min: `${currentYear}-${currentMonth}-${currentDay}`, max: `${currentYear+20}-${currentMonth}-${currentDay}`})}
                      <h2>Vacation End Date:</h2>
                      {Input({value: endPTODate, type: "date", name: "datetime-local", onChange: (e)=>setEndPTODate(e), min: `${currentYear}-${currentMonth}-${currentDay}`, max: `${currentYear+20}-${currentMonth}-${currentDay}`})}
                 

                    <section className="flex alignCenter">
                    {Button({text: "Hide Request PTO Hub", classNames: "hide", handleButtonClick: ()=>toggleDisplay((e:boolean)=>setPTODisplay(e),PTODisplay)})}
                    {ButtonSubmit({handleButtonClick: ()=>handlePTO(listOfUsers, PTO, startPTODate, endPTODate), text: "Request PTO"})}                     

                    </section>

                  </section>
                :""}

                {PTORequestDisplay ?
                <section className = "flex flex-col alignCenter justifyCenter PTO">
                      {Button({text: "Hide PTO History Hub", classNames: "hide", handleButtonClick: ()=>toggleDisplay((e:boolean)=>setPTORequestDisplay(e),PTORequestDisplay)})}

                    {RenderRequestHistory({currentPage: currentPTOPage, setCurrentPage: (e:number)=> setCurrentPTOPage(e),rows: rows, startIndex: firstIndex, endIndex: lastIndex, requests: employee?.requests})}

                </section>
                :""
                }

                {showPurchases ?
                <section className = "flex flex-col alignCenter purchases">

                    <PaginatedButtons className = {"flex"} currentPage = {currentPage} cartLength = {purchases.length} setCurrentPage = {(e:number)=>setCurrentPage(e)} rowsPerPage={rowsPerPage}/>

                    {RenderEmployeeAppointments(purchases, startIndex, endIndex)}

                    {Button({text: "Hide Sales History Hub", handleButtonClick: ()=>toggleDisplay((e:boolean)=>setShowPurchases(e),showPurchases)})}
                                      
                </section>
                :
                ""
                }

              </section>
            </section>
        
        :
        ""
      }

      
     
          </section>

      <Footer/>
  
      </main>
    )
}

export default function Employee(){
   return (
    cacheEmail? <EmployeeHub/> : <EmployeeButtons/>
   )
}