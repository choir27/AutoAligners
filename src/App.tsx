import {BrowserRouter} from "react-router-dom"
import {Route, Routes} from "react-router"
import {PrivateRoutes, PublicRoutes, PurchaseRoutes} from "./middleware/Routes.jsx"
import {lazy, Suspense, useEffect, useState} from "react"
import {ToastContainer} from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import {EmployeeHub} from "./pages/employee/Employee.tsx"
import {APIContext} from "./middleware/Context.tsx"
import {cacheEmail} from "./middleware/Cache.tsx"
import {ClientFinance, Profile, PTO, InventoryItem, CartItem, Appointment, PurchasedItem, Estimate, User} from "./middleware/Interfaces.tsx"
import {GetClientFinance, GetUsers, GetEmployee, GetPTORequests, GetInventory, GetCart, GetAppointmentData, GetPurchases, GetEstimates, GetAccount } from "./hooks/ApiCalls.tsx"

export default function App(){

    const defaultUser = {
    $createdAt: "",
    $updatedAt: "",
    email: "",
    $id: "",
    name: "",
    phone: "",
    phoneVerification: true,
    emailVerification: true,
    passwordUpdate: "",
    status: true,
    prefs: [],
    registration: ""
    }

    const defaultEmployee = {
        $id: "",
        fileName: "",
        image: "",
        position: "",
        PTO: "",
        salary: "",
        requestedPTO: "",
        requests: []
    }

    const Home = lazy(()=>import("./pages/Home.tsx"));
    const Reservation = lazy(()=>import("./pages/guest/Reservation.tsx"));
    const Demo = lazy(()=>import("./pages/guest/Demo"));
    const ServiceEstimate = lazy(()=>import("./pages/guest/ServiceEstimate.tsx"));
    const ManageAppointments = lazy(()=>import("./pages/employee/ManageAppointments.tsx"));
    const EditAppointment = lazy(()=>import("./pages/employee/EditAppointment.tsx"));
    const Employee = lazy(()=>import("./pages/employee/Employee.tsx"));
    const Finance = lazy(()=>import("./pages/guest/Finance.tsx"));
    const ClientFinance = lazy(()=> import("./pages/employee/ClientFinance.tsx"));
    const EmployeeSettings = lazy(()=>import("./pages/employee/EmployeeSettings.tsx"));
    const Inventory = lazy(()=>import("./pages/employee/Inventory.tsx"));
    const InventoryShop = lazy(()=>import("./pages/employee/InventoryShop.tsx"));
    const Cart = lazy(()=>import("./pages/employee/Cart"));
    const Purchases = lazy(()=>import("./pages/employee/Purchases"));
    const Estimates = lazy(()=>import("./pages/employee/Estimates"));
    const AdminDemo = lazy(()=>import("./pages/guest/AdminDemo"));

    const [inventory, setInventory] = useState<InventoryItem[]>([]);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [purchases, setPurchases] = useState<PurchasedItem[]>([]);
    const [estimates, setEstimates] = useState<Estimate[]>([]);
    const [user, setUser] = useState<User>(defaultUser);
    const [PTORequests, setPTORequests] = useState<PTO[]>([]);
    const [employee, setEmployee] = useState<Profile>(defaultEmployee);
    const [listOfUsers, setListOfUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [clientFinance, setClientFinance] = useState<ClientFinance[]>([]);

    useEffect(()=>{
        if(cacheEmail){
            GetInventory((e:InventoryItem[])=>setInventory(e));
            GetCart((e:CartItem[])=>setCart(e));
            GetAppointmentData((e:Appointment[])=>setAppointments(e));
            GetPurchases((e:PurchasedItem[])=>setPurchases(e));
            GetEstimates((e:Estimate[])=>setEstimates(e));
            GetAccount((e:User)=>setUser(e));
            GetPTORequests((e:PTO[])=>setPTORequests(e));
            GetEmployee((e:Profile)=>setEmployee(e));
            GetClientFinance((e:ClientFinance[])=>setClientFinance(e));
        }

        GetUsers((e:User[])=>setListOfUsers(e), (e:boolean)=>setLoading(e));
    },[])

    return(
        <APIContext.Provider 
        value = {{inventory, setInventory, cart, setCart, 
        appointments, setAppointments, purchases, setPurchases,
        estimates, setEstimates, user, setUser, PTORequests, setPTORequests,
        employee, setEmployee, listOfUsers, setListOfUsers, loading,
        clientFinance, setClientFinance
        }}>
            <Suspense fallback = {<h1>Loading...</h1>}>
                <BrowserRouter>
                    <Routes>
                      <Route path = "/" element = {<Home/>}/>
                        <Route element = {<PublicRoutes/>}>
                            <Route path = "/employee" element = {<Employee/>}/>
                            <Route path = "/finance" element = {<Finance/>}/>
                            <Route path = "/login" element = {<EmployeeHub/>}/>
                            <Route path = "/estimate" element = {<ServiceEstimate/>}/>
                            <Route path = "/demo" element = {<Demo/>}/>
                            <Route path = "/adminDemo" element = {<AdminDemo/>}/>
                            <Route path = "/reservation" element = {<Reservation/>}/>
                        </Route>
                        <Route element = {<PrivateRoutes/>}>
                            <Route path = "/clientFinance" element = {<ClientFinance/>}/>
                            <Route path = "/cart" element = {<Cart/>}/>
                            <Route path = "/inventory" element = {<Inventory/>}/>
                            <Route path = "/inventoryShop" element = {<InventoryShop/>}/>
                            <Route path = "/settings" element = {<EmployeeSettings/>}/>
                            <Route path = "/manageAppointments" element = {<ManageAppointments/>}/>
                            <Route path = "/editAppointment" element = {<EditAppointment/>}/>
                            <Route path = "/estimates" element = {<Estimates/>}/>
                            <Route element = {<PurchaseRoutes/>}>
                                <Route path = "/purchases" element = {<Purchases/>}/>
                            </Route>

                        </Route>
                    </Routes>
                </BrowserRouter>
                <ToastContainer/>
            </Suspense>
        </APIContext.Provider>
    )
}
