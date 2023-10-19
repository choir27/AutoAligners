import {useEffect, useState} from "react"
import Nav from "../../components/Nav"
import {Input, handleLogin} from "../../hooks/LoginHooks"
import {ButtonSubmit} from "../../components/Button"
import Footer from "../../components/Footer"
import {User} from "../../middleware/Interfaces"
import {GetUsers} from "../../hooks/ApiCalls"

export default function AdminDemo(){

    const name = "Bob The Builder"
    const email = "BobTheBuilder@gmail.com"
    const employeeID = "64e51b2e84f09ed015ec"
    const password = "Dsbmz58!"

    const [listOfUsers, setListOfUsers] = useState<User[]>([])
    const [loading, setLoading] = useState<boolean>(false)

    useEffect(()=>{
        GetUsers((e:User[])=>setListOfUsers(e), (e:boolean)=>setLoading(e));
    },[listOfUsers])

    return(
        <main id = "auth">
            <Nav pageHeading = {"Admin Demo Account Login"}/>


            <section className="flex flex-col alignCenter justifyCenter">
                <form className = "flex flex-col alignCenter">        
                  {Input({type: "email", onChange: (e:string)=> e,  name: "email", placeholder: email, disabled : true})}
                  {Input({type: "text", onChange: (e:string)=> e, name: "employeeId", placeholder: employeeID, disabled : true})}
                  {Input({type: "text", onChange: (e:string)=> e, name: "name", placeholder: name, disabled : true})}
                  {Input({type: "password",onChange: (e:string)=> e,  name: "password", placeholder: password, disabled : true})}



                  {loading ? 
                ButtonSubmit({handleButtonClick: ()=>handleLogin({email:email, name: name, password: password, employeeId: employeeID, listOfUsers: listOfUsers}), text: "Login"})
                : <h1>...Loading</h1>}
                </form>
            </section>
          
            <Footer/>

        </main>
    )

}