import React from "react"
import {Button} from "../components/Button"
import api from "../api/api"
import {InventoryItem} from "./InventoryHooks"
import {Permission, Role} from "appwrite"

export interface CartItem{
    $id: string,
    itemID: string,
    category: string,
    description: string,
    manufacturer: string,
    name: string,
    price: string,
    email: string,
    quantity: string,
}


interface renderCartQuantity{
    name:string, 
    quantity: string, 
    inventory: InventoryItem[],
    cartItemQuantity: string | undefined,
    setCartItemQuantity: (e:string) => void
}

export async function GetCart(setCart: (e:CartItem[])=>void){
    try{    
        const data = await api.listDocuments(process.env.REACT_APP_DATABASE_ID, process.env.REACT_APP_CART_COLLECTION_ID);
        setCart(data.documents)
    }catch(err){
        console.error(err)
    }
}

export async function handleAddToCart(cart: CartItem[], $id: string | undefined, inventory: InventoryItem[], quantity: number | undefined){
    try{
        const findItem = inventory.filter((item:InventoryItem)=>item.$id === $id)

        const findCartItem = cart.filter((cartItem:CartItem)=>cartItem.name === findItem[0].name && localStorage.getItem("email") === cartItem.email);

        if(!findCartItem.length){
            const item = {  
                "itemID": findItem[0].$id,
                "category": findItem[0].category,
                "description": findItem[0].description,
                "manufacturer": findItem[0].manufacturer,
                "name": findItem[0].name,
                "price": findItem[0].price,
                "email": localStorage.getItem("email"),
                "quantity": quantity ? quantity: 1
            }
           
            await api.createDocument(process.env.REACT_APP_DATABASE_ID, process.env.REACT_APP_CART_COLLECTION_ID, item, [Permission.read(Role.any())])
    
            window.location.reload();
        }else{
            const item = {  
                "itemID": findItem[0].$id,
                "category": findItem[0].category,
                "description": findItem[0].description,
                "manufacturer": findItem[0].manufacturer,
                "name": findItem[0].name,
                "price": findItem[0].price,
                "email": localStorage.getItem("email"),
                "quantity": quantity ? quantity + findCartItem[0].quantity : 1 + findCartItem[0].quantity
            }
           
            await api.updateDocument(process.env.REACT_APP_DATABASE_ID, process.env.REACT_APP_CART_COLLECTION_ID, findCartItem[0].$id, item)
    
            window.location.reload();
        }
 

    }catch(err){
        console.error(err);
    }
}

export async function EditCart(item: CartItem){
    try{
        const cartItem = {  
            "itemID": item.$id,
            "category": item.category,
            "description": item.description,
            "manufacturer": item.manufacturer,
            "name": item.name,
            "price": item.price,
            "email": localStorage.getItem("email"),
            "quantity": item.quantity
        }
       
        await api.updateDocument(process.env.REACT_APP_DATABASE_ID, process.env.REACT_APP_CART_COLLECTION_ID, item.$id, cartItem)

        window.location.reload();
    }catch(err){
        console.error(err)
    }
}

export function RenderCartQuantity(props: renderCartQuantity){

    const cartQuantity = []

    const findItem = props?.inventory.filter((item:InventoryItem)=>item.name === props.name)

    for(let i = 1;i <= findItem[0]?.quantity; i++){
            cartQuantity.push(<option key = {`k-${i}`}>{i}</option>)
    }
    
    return(
        <select name="" id="" defaultValue = {props.cartItemQuantity ? props.cartItemQuantity : props?.quantity}onChange = {(e)=>props.setCartItemQuantity(e.target.value)}>
            {cartQuantity}
        </select>
    )
}

async function handleDeleteCartItem(cartID: string){
    try{
        const data = await api.deleteDocument(process.env.REACT_APP_DATABASE_ID, process.env.REACT_APP_CART_COLLECTION_ID, cartID);

        console.log(data);

        if(data){
            window.location.reload();
        }

    }catch(err){
        console.error(err);
    }
}

async function handleMakeCartPurchase(item: CartItem[]){
    try{
        const itemsAsString = item.map((item:CartItem)=>JSON.stringify(item))

        const cartItems = {
            "cartItems": itemsAsString
        }

        const data = await api.createDocument(process.env.REACT_APP_DATABASE_ID, process.env.REACT_APP_PURCHASES_COLLECTION_ID, cartItems, [Permission.read(Role.any())])

        for(let i = 0; i<item.length;i++){
            await api.deleteDocument(process.env.REACT_APP_DATABASE_ID, process.env.REACT_APP_CART_COLLECTION_ID, item[i].$id);
        }


        if(data){
            window.location.reload();
        }

    }catch(err){
        console.error(err)
    }
} 

export function RenderCart(cart: CartItem[], inventory: InventoryItem[], cartItemQuantity: string | undefined, setCartItemQuantity: (e:string)=>void){

    if(cart?.length){
        const findUsersCart = cart.filter((item: CartItem, i: number)=>item.email === localStorage.getItem("email"));

        let total = ""
        let cartTotal:number = 0
        let decimalTotal:number = 0
        return findUsersCart.map((item: CartItem,i: number)=>{

            let itemPriceTotal = 0
            itemPriceTotal = Number(item.price) * parseInt(item.quantity)

            cartTotal += parseInt(itemPriceTotal.toString().split(".")[0])

            if(itemPriceTotal.toString().includes(".")){
                decimalTotal += parseInt(itemPriceTotal.toString().split(".")[1]) 

            }

            if(i === cart.length-1){

                let decimalNumbers = decimalTotal.toString().split("")

                if(decimalNumbers.length > 2){
                    const remainder:string = decimalNumbers.shift() as string
                    cartTotal += parseInt(remainder)
                }

                const decimals = decimalNumbers.join("")

                total = cartTotal.toString()
                total += "." + decimals
            }

            const checkCartQuantity = cartItemQuantity ? cartItemQuantity : item.quantity
                                
            if(cart.length === 1){

                
                return(
                    <section className = "flex flex-col" key = {i}>

                        <div className="flex justifyBetween">
                        <h2>{item.name} <i className = "fa-solid fa-xmark button" onClick = {()=>handleDeleteCartItem(item.$id)}></i></h2>
                        <h2>Quantity: {RenderCartQuantity({name: item.name, quantity: item.quantity, inventory: inventory, cartItemQuantity: cartItemQuantity, setCartItemQuantity: (e:string)=>setCartItemQuantity(e)})} {Button({text: "Update", handleButtonClick: ()=>EditCart({name: item.name, price: item.price, email: item.email, quantity: checkCartQuantity, manufacturer: item.manufacturer, description: item.description, category: item.category, $id: item.$id, itemID: item.itemID})})}</h2>
                        <h2>${parseInt(item?.quantity) > 1 ? itemPriceTotal  : item.price}</h2>
                        </div>
                        <div className = "flex cartTotal justifyBetween" key = {total}><h2>Total: </h2> <h2>${total}</h2></div>

                        {Button({text: "Purchase Items", handleButtonClick: ()=>handleMakeCartPurchase(cart)})}
                    </section>
                )

            }else if(cart.length > 1 && i !== cart.length-1){
                return(
                    <section className = "flex flex-col" key = {i}>

                    <div className="flex justifyBetween">
                    <h2>{item.name} <i className = "fa-solid fa-xmark button" onClick = {()=>handleDeleteCartItem(item.$id)}></i></h2>
                    <h2>${item.price}</h2>
                    <h2>Quantity: {RenderCartQuantity({name: item.name, quantity: item.quantity, inventory: inventory, cartItemQuantity: cartItemQuantity, setCartItemQuantity: (e:string)=>setCartItemQuantity(e)})} {Button({text: "Update", handleButtonClick: ()=>EditCart({name: item.name, price: item.price, email: item.email, quantity: checkCartQuantity, manufacturer: item.manufacturer, description: item.description, category: item.category, $id: item.$id, itemID: item.itemID})})}</h2>
                    <h2>${parseInt(item?.quantity) > 1 ? itemPriceTotal  : item.price}</h2>
                    </div>

                </section>
                )

            }else if(i === cart.length-1){
                return(
                    <section className = "flex flex-col" key = {i}>

                    <div className="flex justifyBetween">
                    <h2>{item.name} <i className = "fa-solid fa-xmark button" onClick = {()=>handleDeleteCartItem(item.$id)}></i></h2>
                    <h2>${item.price}</h2>
                    <h2>Quantity: {RenderCartQuantity({name: item.name, quantity: item.quantity, inventory: inventory, cartItemQuantity: cartItemQuantity, setCartItemQuantity: (e:string)=>setCartItemQuantity(e)})} {Button({text: "Update", handleButtonClick: ()=>EditCart({name: item.name, price: item.price, email: item.email, quantity: checkCartQuantity, manufacturer: item.manufacturer, description: item.description, category: item.category, $id: item.$id, itemID: item.itemID})})}</h2>
                    <h2>${parseInt(item?.quantity) > 1 ? itemPriceTotal  : item.price}</h2>

                    </div>

                    <div className = "flex cartTotal justifyBetween" key = {total}><h2>Total: </h2><h2>${total}</h2></div>
                    {Button({text: "Purchase Items", handleButtonClick: ()=>handleMakeCartPurchase(cart)})}

                </section>
                )
            }



        })
    }else{
            return(
                <section className = "flex flex-col">
                    <h2>No items in the cart currently</h2>
                </section>
            )

    }
}

