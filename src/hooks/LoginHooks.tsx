import axios from "axios"
import React from "react"
import api from "../api/api"
import {toast} from "react-toastify"
import {Client, Account, ID} from "appwrite"
import {InputTypes, User, Login, SignUp} from "../middleware/Interfaces"
import {SetCacheEmail} from "../middleware/Cache"

export function Input(props: InputTypes):React.JSX.Element{
    return(<input 
      type = {props.type} 
      name = {props.name} 
      disabled = {props.disabled} 
      value = {props.value} 
      onChange = {(e)=>props.onChange(e.target.value)} 
      placeholder = {props.placeholder}
      min = {props.min}
      max = {props.max}/>
      )
  }
  

  
export async function handleDelete(userId: string){
    try{
      console.log(userId)
        await axios.delete(`https://car-app-backend-0ejb.onrender.com/deleteUser/${userId}`);
    }catch(err){
      console.error(err)
    }
        
  }
  
export function DisplayUsers(listOfUsers: User[], currentUser: User, startIndex: number, endIndex: number){
  try{
        if(currentUser.$id === "649c8a408d41d5c02f5c" || currentUser.$id === "64e51b2e84f09ed015ec"){

           const users = listOfUsers.map((user:User)=>{
            const createdAtDate = user.$createdAt.split("T")[0];
            let createdAtTimeHours:number = parseInt(user.$createdAt.split("T")[1].split(".")[0].split(":")[0]);
            let createdAtTimeMinutes:number = parseInt(user.$createdAt.split("T")[1].split(".")[0].split(":")[1]);

            const updatedAtDate = user.$updatedAt.split("T")[0];
            let updatedAtTimeHours:number = parseInt(user.$updatedAt.split("T")[1].split(".")[0].split(":")[0]);
            let updatedAtTimeMinutes:number = parseInt(user.$updatedAt.split("T")[1].split(".")[0].split(":")[1]);
              return(
                <ul key = {user.$id} className = "flex flex-col alignCenter userDisplays">
                  <li className = "name">{user.name}</li>
                  <li>Employee Id: {user.$id}</li>
                  <li>Employee Email: {user.email}</li>
                  <li>Created At: {createdAtDate}  {createdAtTimeHours > 12 ? createdAtTimeHours -= 12 : createdAtTimeHours}{":" + createdAtTimeMinutes}{createdAtTimeHours > 12 ? "PM" : "AM"}</li>
                  <li>Updated At: {updatedAtDate} {updatedAtTimeHours > 12 ? updatedAtTimeHours -=12 : updatedAtTimeHours}{":" + updatedAtTimeMinutes}{updatedAtTimeHours > 12 ? "PM" : "AM"}</li>
                  { user.$id === "64e51b2e84f09ed015ec" || user.$id === "64bb01ec8a97c4136079" ? "" :<li className = "fa-solid fa-trash button" onClick = {()=>handleDelete(user.$id)}></li>}
                </ul> 
              )
            })

            return users.slice(startIndex, endIndex);
          }

    }catch(err){
        console.error(err);
        toast.error(`${err}`);
    }    
}

export async function handleSignUp(props: SignUp):Promise<void>{
    try{
      if(!props.email){
        toast.error("Please input an email address");
        return;
      }else if(!props.name){
        toast.error("Please input your full name");
        return;
      }else if(!props.password){
        toast.error("Please input a password");
        return;
      }
    
      const fullName = /^[A-Za-z\s]+$/;
      const mail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
      if(!fullName.test(props.name)){
        toast.error("Please input a valid full name");
        return;
      }else if(!mail.test(props.email)){
        toast.error("Please input a valid password");
        return;
      }


      const client = new Client()
      .setEndpoint("https://cloud.appwrite.io/v1") // Your API Endpoint
      .setProject(process.env.REACT_APP_PROJECT) // Your project ID
    
  
      const account = new Account(client);
  
      // Register User
      const createAccount = await account.create(
          ID.unique(),
          props.email,
          props.password,
          props.name
      )

      if(createAccount){
        window.location.reload();
      }

    }catch(err){
      toast.error(`${err}`);
      console.error(err);
  }
}

export async function handleLogin(props: Login): Promise<void>{
    try{
      if(props.listOfUsers.length){

        if(!props.email){
          toast.error("Please input an email address");
          return;
        }else if(!props.name){
          toast.error("Please input your full name");
          return;
        }else if(!props.password){
          toast.error("Please input a password");
          return;
        }else if(!props.employeeId){
          toast.error("Please input an employee Id");
          return;
        }

      const checkEmployee = props?.listOfUsers?.filter((user: User)=>{
        return user.$id === props.employeeId
      })
    
      const fullName = /^[A-Za-z\s]+$/;
      const mail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
      if(!fullName.test(props.name)){
        toast.error("Please input a valid full name");
        return;
      }else if(!mail.test(props.email)){
        toast.error("Please input a valid password");
        return;
      }else if(!checkEmployee.length){
        toast.error("Please input a valid employee ID");
        return;
      }


      await api.createSession(props.email, props.password);
      const response = await api.getAccount();
      if(response){
        console.log(response)
        SetCacheEmail(props.email)
        window.location.reload()
      }
    }

    }catch(err){
      console.error(err);
      toast.error(`${err}`);
    }
}

export async function handleLogout(): Promise<void>{
  try{
    const user = await api.deleteCurrentSession();
    SetCacheEmail("")
    if(user){
      window.location.reload();
    }
  }catch(err){
    console.error(err);
  }
}

export function GenerateNewEmployee(setPassword: (e:string)=>void, setGeneratedPassword: (e: string) => void){
  const alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

  let password:string[] = [];

  for(let i = 0; i <= 5; i++){
    if(i !== 5){
      const random = Math.floor(Math.random() * 26);
      password.push(alphabet[random]);
    }else{
      const randomIndex = Math.floor(Math.random() * 4);
      password[randomIndex] = password[randomIndex].toUpperCase()
    }
  }

  const symbols = ["`", "~", "!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "-", "_", "=", "+", "[", "{", "]", "}", "\\", "|", ";", ":", "'", "\"", ",", "<", ".", ">", "/", "?"];

  const randomizeOrder = Math.floor(Math.random() * 3);

 if(!randomizeOrder){
  const randomNumber = Math.floor(Math.random()* 100);
  password.push(randomNumber.toString());
  const randomIndex = Math.floor(Math.random()*32);
  password.push(symbols[randomIndex]);
  const randomNumber2 = Math.floor(Math.random()* 10);
  password.push(randomNumber2.toString());
 }else if(randomizeOrder === 1){
  const randomIndex = Math.floor(Math.random()*32);
  password.push(symbols[randomIndex]);
  const randomNumber = Math.floor(Math.random()* 100);
  password.push(randomNumber.toString());
  const randomNumber2 = Math.floor(Math.random()* 10);
  password.push(randomNumber2.toString());
 }else{
  const randomNumber = Math.floor(Math.random()* 10);
  password.push(randomNumber.toString());
  const randomIndex = Math.floor(Math.random()*32);
  password.push(symbols[randomIndex]);
  const randomNumber2 = Math.floor(Math.random()* 10);
  password.push(randomNumber2.toString());
 }
   
      setGeneratedPassword(password.join(""));
      setPassword(password.join(""));

  //each password should have 4 characters randomly distributed, where one of them is capitalized
  //duplicates can occur
  //the password should also have a minimum of 2 numbers 
  //the password should also have a special symbol
  //the order should be characters, then symbols and numbers can be intertwined in their order
  //example: "Melt@24"
  //example: "bOb5&1"
  //example: "zERO11$"
}


export async function updateAccountName(name: string){
  try{
    const updatedName = await api.updateAccountName(name);
    if(updatedName){
      window.location.reload();
    }
  }catch(err){
    console.error(err);
    toast.error(`${err}`);
  }
}

export async function updateAccountPassword(password:string,oldPassword:string){
  try{
    const updatedPassword = await api.updateAccountPassword(password,oldPassword);
    if(updatedPassword){
      window.location.reload();
    }
  }catch(err){
    console.error(err);
    toast.error(`${err}`);
  }
}

export async function updateAccountEmail(email: string, password: string){
  try{
    const updatedEmail = await api.updateAccountEmail(email, password);
    if(updatedEmail){
      window.location.reload();
    }
  }catch(err){
    console.error(err)
    toast.error(`${err}`)
  }
}

export async function handleDeleteAccount(user: User | undefined){
  try{
    await axios.delete(`https://car-app-backend-0ejb.onrender.com/deleteUser/${user?.$id}`)
    SetCacheEmail("");
    window.location.reload();
  }catch(err){
    console.error(err);
  }
}