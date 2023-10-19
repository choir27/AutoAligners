import api from "../api/api.jsx"
import {Car, CarSelectData, User, CartItem, Appointment, Profile, PTO, Estimate, ClientFinance, InventoryItem, PurchasedItem} from "../middleware/Interfaces"
import {toast} from "react-toastify"
import {cacheEmail, SetCacheEdit, cacheAppointmentID} from "../middleware/Cache"
import {Query} from "appwrite"
import axios from "axios"
import {carData} from "../api/data.jsx"

//Get Cart data
export async function GetCart(setCart: (e:CartItem[])=>void){
    try{
        const data = await api.listDocuments(process.env.REACT_APP_DATABASE_ID, process.env.REACT_APP_CART_COLLECTION_ID);

        if(data.documents.length){
            setCart(data.documents.filter((item: CartItem)=>item.email === cacheEmail));
        }
        
    }catch(err){
        console.error(err);
        toast.error(`${err}`);
    }
}

//Get data for apppointment we want to edit
export async function GetEditAppointmentData(){
    try{
        const data = await api.listDocuments(process.env.REACT_APP_DATABASE_ID,process.env.REACT_APP_COLLECTION_ID);

        if(data.documents.length){
            const findAppointment = data.documents.filter((appointment: Appointment)=>appointment.$id === cacheAppointmentID);

            SetCacheEdit(JSON.stringify(findAppointment[0]));
        }

    }catch(err){
        console.error(err);
        toast.error(`${err}`);
    }
}

//Get Employee profiles database data
export async function GetEmployee(setEmployee: (e:Profile)=>void){
    try{
        const data = await api.listDocuments(process.env.REACT_APP_DATABASE_ID, process.env.REACT_APP_PROFILE_COLLECTION_ID);

        if(data.documents.length){
            const findUser = data.documents.filter((user:Profile)=>cacheEmail === user.email)[0];
        
            setEmployee(findUser);
        }

    }catch(err){
        console.error(err);
        toast.error(`${err}`);
    }
}

//Get Employee PTO database data
export async function GetPTORequests(setPTORequests: (e:PTO[])=>void){
    try{
        const data = await api.listDocuments(process.env.REACT_APP_DATABASE_ID, process.env.REACT_APP_PTO_COLLECTION_ID);
        
        if(data.documents.length){
            setPTORequests(data.documents);
        }

    }catch(err){
        console.error(err);
        toast.error(`${err}`);
    }
}

//Get Submitted Estimates database data
export async function GetEstimates(setEstimates : (e:Estimate[])=>void){
    try{
        const data = await api.listDocuments(process.env.REACT_APP_DATABASE_ID, process.env.REACT_APP_ESTIMATES_COLLECTION_ID);

        if(data.documents.length){
            setEstimates(data.documents);
        }

    }catch(err){
        console.error(err);
        toast.error(`${err}`);
    }
}

//Get current clients with finance plans
export async function GetClientFinance(setClientFinance: (e:ClientFinance[])=>void){
    try{
        const data = await api.listDocuments(process.env.REACT_APP_CART_DATABASE_ID, process.env.REACT_APP_FINANCE_PAYMENTS_COLLECTION_ID);

        if(data.documents.length){
            setClientFinance(data.documents);
        }

    }catch(err){
        console.error(err);
        toast.error(`${err}`);
    }
}

//Get inventory data
export async function GetInventory(setInventory: (e:InventoryItem[])=>void){
    try{
        const data = await api.listDocuments(process.env.REACT_APP_DATABASE_ID, process.env.REACT_APP_INVENTORY_COLLECTION_ID);

        if(data.documents.length){
            setInventory(data.documents);
        }
    }catch(err){
        console.error(err);
        toast.error(`${err}`);
    }
}

//Get purchase data
export async function GetPurchases(setPurchases:(e:PurchasedItem[])=>void, limit?: number){
    try{
        const data = await api.listDocuments(process.env.REACT_APP_DATABASE_ID, process.env.REACT_APP_PURCHASES_COLLECTION_ID, [Query.limit(100)]);

        if(limit){

                const response = await api.listDocuments(process.env.REACT_APP_DATABASE_ID, process.env.REACT_APP_PURCHASES_COLLECTION_ID, [Query.limit(limit), Query.offset(limit-25)]);

                const array = response.documents;
                setPurchases(array);

        }else if(data.documents.length){
            setPurchases(data.documents);
        }

    }catch(err){
        console.error(err);
        toast.error(`${err}`);
    }
 }

//Get appointment data
export async function GetAppointmentData(setAppointments: (e:Appointment[])=>void){
    try{
        const data = await api.listDocuments(process.env.REACT_APP_DATABASE_ID, process.env.REACT_APP_COLLECTION_ID);

        if(data.documents.length){
            setAppointments(data.documents);
        }
    }catch(err){
        console.error(err);
        toast.error(`${err}`);
    }
}

//Get currently logged in account
export async function GetAccount(setUser: (e:User)=>void){
    try{
        const user = await api.getAccount();
        
        if(user){
            setUser(user);
        }
  
    }catch(err){
      console.error(err);
      toast.error(`${err}`);
    }
  }
    
//Get list of all user accounts
  export async function GetUsers(setListOfUsers: (e: User[]) => void, setLoading: (e:boolean)=>void) {
    try {
      // You can move the API endpoint URL to a separate constant for better maintainability
      const apiUrl = "https://car-app-backend-0ejb.onrender.com/getUsers";
  
      const response = await axios.get(apiUrl);
  
      // Assuming the response format is { data: { users: [] } }
      const { data } = response;
  
      if (data && data.users && data.users.length) {
        // Only update the list of users if data is available
        setListOfUsers(data.users);
        setLoading(true);
      }
  
    } catch (err) {
      console.error(err);
      // Handle errors gracefully and provide user-friendly feedback
      // toast.error("Failed to fetch users. Please try again later.");
    }
  }


  export async function GetCarData(props:CarSelectData){
    try{

        // sets form options to all car makes

        const uniqueCarOptions: string[] = [];

        carData.forEach((car:Car)=>uniqueCarOptions.indexOf(car.manufacturer) === -1 ? uniqueCarOptions.push(car.manufacturer) : "")

        const carOptions:React.JSX.Element[] = uniqueCarOptions.sort((a:string,b:string)=>a.localeCompare(b)).map((car:string,i:number)=><option key = {i}>{car}</option>);
        //onMakeSelect is a setState() here, so we make it a separate function here to prevent re-rendering

     
        const makeSelect = ()=>props.onMakeSelect(carOptions);
        makeSelect();

        if(props.carMake && props.carMake !== "Select Car Make"){

            //sets form options to all car models available for selected car make value
            //returning false is there to 1. prevent the warning to appear that filter method expects a returned value 2. to return a value that won't affect the current existing desired functionality

            const uniqueCarOptions:string[] = []

           carData.filter((car:Car)=>{
               if(car.manufacturer === props.carMake && uniqueCarOptions.indexOf(car.model)===-1){
                    uniqueCarOptions.push(car.model)
                    return car.model
               }
            })


            //returns a new array of react jsx element with new car model values that are respective to selected car make value
            const carOptions:React.JSX.Element[] = uniqueCarOptions.sort((a:string,b:string)=>a.localeCompare(b)).map((car:string,i:number)=>{return <option key = {i}>{car}</option>});
            const modelSelect = ()=>props.onModelSelect(carOptions)
            modelSelect();
        }

        if(props.carMake && props.carModel && (props.carMake !== "Select Car Make") && (props.carModel !== "Select Car Model")){
            //sets form options to all car years available for car make and car models
            const response = carData.filter((car:Car)=>{
                let year = 0
                if(car.manufacturer === props.carMake && car.model === props.carModel){
                    year = car.year
                }
                return year
            })

            //returns a new array of react jsx element with new car year values that are respective to selected car make & model value
            const carOptions:React.JSX.Element[] = response.map((car:Car,i:number)=><option key = {i}>{car.year}</option>);
            const yearSelect = ()=>props.onYearSelect(carOptions);
            yearSelect();
        }

    }catch(err){
        console.error(err);
        toast.error(`${err}`);
    }
}