import {useEffect, useState} from "react"
import Nav from "../../components/Nav"
import {Input, handleLogin} from "../../hooks/LoginHooks"
import {ButtonSubmit} from "../../components/Button"
import Footer from "../../components/Footer"
import {User} from "../../middleware/Interfaces"
import {GetUsers} from "../../hooks/ApiCalls"

export default function Demo(){

    const name = "Helena Blavatsky"
    const email = "helena24@gmail.com"
    const employeeID = "64bb01ec8a97c4136079"
    const password = "isKri8!3"

    const [listOfUsers, setListOfUsers] = useState<User[]>([])
    const [loading, setLoading] = useState<boolean>(false)

    useEffect(()=>{
        GetUsers((e:User[])=>setListOfUsers(e), (e:boolean)=>setLoading(e));
    },[listOfUsers])

    return(
        <main id = "auth">
            <Nav pageHeading = {"Demo Account Login"}/>


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