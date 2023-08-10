import React, {useState, useEffect} from "react"
import {GetCart, CartItem, EditCart, GetInventory, InventoryItem} from "../../hooks/InventoryHooks"
import Nav from "../../components/Nav"
import Footer from "../../components/Footer"

export default function Cart(){

    const [cart, setCart] = useState<CartItem[]>([])
    const [inventory, setInventory] = useState<InventoryItem[]>([])
    
    useEffect(()=>{
        GetCart((e:CartItem[])=>setCart(e))
    },[])

    useEffect(()=>{
        GetInventory((e:InventoryItem[])=>setInventory(e))
    },[])

    function renderCartQuantity(name:string, quantity: string){
        const cartQuantity = []

        const findItem = inventory.filter((item:InventoryItem)=>item.name === name)

        for(let i = 1;i < findItem[0].quantity; i++){
            if(i !== parseInt(quantity)){
                cartQuantity.push(<option key = {`k-${i}`}>{i}</option>)
            }else{
                cartQuantity.push(<option key = {`k-${i}`} selected>{i}</option>)
            }
        }
        
        return(
            <select name="" id="">
                {cartQuantity}
            </select>
        )
    }

    function RenderCart(){
        if(cart?.length){
            const findUsersCart = cart.filter((item: CartItem, i: number)=>item.email === localStorage.getItem("email"));

            let total = ""
            let cartTotal:number = 0
            let decimalTotal:number = 0
            return findUsersCart.map((item: CartItem,i: number)=>{

                const itemPriceTotal = Number(item.price) * parseInt(item.quantity)

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

                        
                if(cart.length === 1){

                    
                    return(
                        <section className = "flex flex-col" key = {i}>

                            <div className="flex justifyBetween">
                            <h2>{item.name}</h2>
                            <h2>${item.price}</h2>
                            <h2>Quantity: {renderCartQuantity(item.name, item.quantity)}</h2>
                            </div>
                            <div className = "flex cartTotal justifyBetween" key = {total}><h2>Total: </h2><h2>${total}</h2></div>

                        </section>
                    )

                }else if(cart.length > 1 && i !== cart.length-1){
                    return(
                        <section className = "flex flex-col" key = {i}>

                        <div className="flex justifyBetween">
                        <h2>{item.name}</h2>
                        <h2>${item.price}</h2>
                        <h2>Quantity: {renderCartQuantity(item.name, item.quantity)}</h2>
                        </div>

                    </section>
                    )

                }else if(i === cart.length-1){
                    return(
                        <section className = "flex flex-col" key = {i}>

                        <div className="flex justifyBetween">
                        <h2>{item.name}</h2>
                        <h2>${item.price}</h2>
                        <h2>Quantity: {renderCartQuantity(item.name, item.quantity)}</h2>

                        </div>

                        <div className = "flex cartTotal justifyBetween" key = {total}><h2>Total: </h2><h2>${total}</h2></div>

                    </section>
                    )
                }



            })
        }
    }

    return(
        <main id = "cart">
            <Nav pageHeading = {"Cart"}/>
            <section className = "flex justifyBetween cart">

                <section className = "flex flex-col cartContainer">
                    <div>
                    {RenderCart()}

                    </div>

                </section>

                <form>
                    <input></input>
                </form>
            </section>
            <Footer/>
        </main>
    )
}