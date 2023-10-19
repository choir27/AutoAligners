import Footer from "../../components/Footer"
import Nav from "../../components/Nav"
import React, {useState, useContext} from "react"
import {Button} from "../../components/Button"
import {updateAccountEmail, handleDeleteAccount, updateAccountName, updateAccountPassword, Input} from "../../hooks/LoginHooks"
import {APIContext} from "../../middleware/Context"

export default function EmployeeSettings():React.JSX.Element{


  const [email, setEmail] = useState<string>("");
  const [displayDelete, setDisplayDelete] = useState<boolean>(false);
  const [oldPassword, setOldPassword] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [name, setName] = useState<string>("");
  
  const {user} = useContext(APIContext);


    return(
        <main id = "employeeSettings">
          <Nav pageHeading = {"Settings"}/>

        <section className="flex justifyEvenly alignCenter">

            <section className = "flex flex-col alignCenter settings">
            
            <section className = "flex flex-col alignCenter justifyCenter">
              {Input({type: "text", name: "text", onChange: (e)=>setName(e), placeholder: user?.name})}
              {Button({text: "Update User's Name", handleButtonClick: ()=>updateAccountName(name)})}
            </section>
  
            <section className = "flex flex-col alignCenter justifyCenter">
              {Input({type: "password", name: "password", onChange: (e)=>setOldPassword(e), placeholder: "Old Password Here"})}
              {Input({type: "password", name: "password", onChange: (e)=>setPassword(e), placeholder: "New Password Here"})}
              {Button({text: "Update User's Password", handleButtonClick: ()=>updateAccountPassword(password, oldPassword)})}
            </section>
  
            <section className = "flex flex-col alignCenter justifyCenter">
              {Input({type: "email", name: "email", onChange: (e)=>setEmail(e), placeholder: user?.email})}
              {Input({type: "password", name: "password", onChange: (e)=>setPassword(e), placeholder: "Type your password here"})}
              {Button({text: "Update User's Email", handleButtonClick: ()=>updateAccountEmail(email, password)})}
            </section>
  


        {user?.email !== "helena24@gmail.com" && user?.email !== "bobTheBuilder@gmail.com" ?
        <section className = "flex flex-col alignCenter justifyCenter">
          {Button({text: "Delete User's Account", handleButtonClick: ()=>setDisplayDelete(!displayDelete)})}
  
  
          <div className = {`${displayDelete ? "show" : "hidden"} clearButton deleteAccount flex flex-col`}>
            <div className = "flex justifyCenter">
            <h3>Are you sure you want to delete your account?</h3>
            <i className="fa-solid fa-xmark button" onClick = {()=>setDisplayDelete(!displayDelete)}></i>
            </div>
            
            <div className="flex justifyAround">
            {Button({classNames: "deleteButton", text: "Delete Account", handleButtonClick: ()=>handleDeleteAccount(user)})}
            {Button({text: "Go Back", handleButtonClick: ()=>setDisplayDelete(!displayDelete)})}
            </div>


          </div>
  
        </section>
        :
        ""
        }

      </section>

      </section>


      <Footer/>
      </main>
    )
}