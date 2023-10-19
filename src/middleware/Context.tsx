import {createContext} from "react"
import {ClientFinance, Profile, PTO, User, InventoryItem, CartItem, Appointment, PurchasedItem, Estimate} from "./Interfaces";

type T = {
inventory: InventoryItem[],
setInventory: (e:InventoryItem[])=>void,
cart: CartItem[],
setCart: (e:CartItem[])=>void,
appointments: Appointment[],
setAppointments: (e:Appointment[])=>void,
purchases: PurchasedItem[],
setPurchases: (e:PurchasedItem[])=>void,
estimates: Estimate[],
setEstimates: (e:Estimate[])=>void,
user: User,
setUser: (e:User)=>void,
PTORequests: PTO[],
setPTORequests: (e:PTO[])=>void,
employee: Profile,
setEmployee: (e:Profile)=>void,
listOfUsers: User[],
setListOfUsers: (e:User[])=>void,
loading: boolean,
clientFinance: ClientFinance[],
setClientFinance: (e:ClientFinance[])=>void
}

export const APIContext = createContext<T>({
    inventory: [],
    setInventory: (e:InventoryItem[])=> e,
    cart: [],
    setCart: (e:CartItem[]) => e,
    appointments: [],
    setAppointments: (e:Appointment[]) => e,
    purchases: [],
    setPurchases: (e:PurchasedItem[])=>e,
    estimates: [],
    setEstimates: (e:Estimate[])=>e,
    user: {
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
    },
    setUser: (e:User)=>e,
    PTORequests: [],
    setPTORequests: (e:PTO[])=>e,
    employee: {
        $id: "",
        fileName: "",
        image: "",
        position: "",
        PTO: "",
        salary: "",
        requestedPTO: "",
        requests: []
    },
    setEmployee: (e:Profile)=>e,
    listOfUsers: [],
    setListOfUsers: (e:User[])=>e,
    loading: false,
    clientFinance: [], 
    setClientFinance: (e: ClientFinance[])=>e 
});