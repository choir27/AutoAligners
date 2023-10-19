import React from "react"
import {Button} from "../components/Button"
import api from "../api/api"
import {Permission, Role} from "appwrite"
import {toast} from "react-toastify"
import Assets from "../components/Assets"
import {CardInfo, CartItem, AddToCart, renderCartQuantity, CartPurchase, Cart, InventoryItem} from "../middleware/Interfaces"
import {cacheEmail} from "../middleware/Cache"

export function RenderPaymentForm(cardInfo: CardInfo | undefined, setCardInfo: (e:CardInfo)=>void){
    return(
        <section className = "flex payment alignCenter flex-col">
            <form className = "flex flex-col alignCenter">
                <input type = "text" defaultValue = {cardInfo?.cardNumber} disabled/>
                <input type = "text" defaultValue = {cardInfo?.expirationDate} disabled/>
                <input type = "text" defaultValue = {cardInfo?.securityNumber} maxLength={4} disabled/>
            </form>
    
            <section className = "flex justifyBetween">
                <div className="imageContainer" 
                onClick = {()=>
                    setCardInfo({
                        "type": "Visa",
                        "cardNumber": 4716108999716531,
                        "securityNumber": "257",
                        "expirationDate": "01/32"})}>
                    <img src = {Assets.visa} alt = "The logo for VISA, with a purple border on top, gold border on the bottom, the text visa in all capitals in purple text in the center, and a white background."/>
                </div>
                <div className="imageContainer" 
                    onClick = {()=>
                        setCardInfo({
                        "type": "Master Card",
                        "cardNumber": 5281037048916168,
                        "securityNumber": "043",
                        "expirationDate": "12/84"})}>
                    <img src = {Assets.mastercard} alt = "The logo for MasterCard, with a purple background, and a ven diagram where the left circle is red, the right circle is gold, and the text mastercard has the m and c capitalized and in the center of the venn diagram."/>
                </div>
                <div className="imageContainer" 
                    onClick = {()=>
                        setCardInfo({
                        "type": "American Express",
                        "cardNumber": 342498818630298,
                        "securityNumber": "3156",
                        "expirationDate": "05/99"
                        })
                    }>
                    <img src = {Assets.amex} alt = "The logo for American Expresss, with a sky blue background, white border encasing the text amex, which is all upper cased and in the center."/>
                </div>
            </section> 
    </section>
    )
}

//When user add an item to the cart
export async function handleAddToCart(props: AddToCart){
    try{
        //find item in inventory database
        const findItem = props.inventory.filter((item:InventoryItem)=>item.$id === props.$id)

        //find item in cart using item object in the findItem array && current logged in user
        const findCartItem = props.cart.filter((cartItem:CartItem)=>cartItem.name === findItem[0].name && cartItem.email === cacheEmail);

        //if there are no duplicates items currently in the cart using findCartItem 
        if(!findCartItem.length){

            const item = findItem[0]

            const cartItem = {  
                "itemID": item.$id,
                "category": item.category,
                "description": item.description,
                "manufacturer": item.manufacturer,
                "name": item.name,
                "price": item.price,
                "email": cacheEmail,
                "quantity": props.quantity ? props.quantity: 1
            }

            //create item and add it to the cart database
            await api.createDocument(process.env.REACT_APP_DATABASE_ID, process.env.REACT_APP_CART_COLLECTION_ID, cartItem, [Permission.read(Role.any())])
    
            window.location.reload();
        }else{
            const item = findCartItem[0]

            //if there are duplicates items currently in the cart using findCartItem, add to the current existing quantity of respective item in the cart
            const cartItem = {  
                "itemID": item.$id,
                "category": item.category,
                "description": item.description,
                "manufacturer": item.manufacturer,
                "name": item.name,
                "price": item.price,
                "email": cacheEmail,
                "quantity": props.quantity ? props.quantity + findCartItem[0].quantity : 1 + findCartItem[0].quantity
            }
           
            //and update the current data for the respective item
            await api.updateDocument(process.env.REACT_APP_DATABASE_ID, process.env.REACT_APP_CART_COLLECTION_ID, item.$id, cartItem)
    
            window.location.reload();
                }
 

    }catch(err){
        console.error(err);
        toast.error(`${err}`);
    }
}

//When user changes quantity of item in the cart
export async function EditCart(item: CartItem){
    try{
        const cartItem = {  
            "itemID": item.$id,
            "category": item.category,
            "description": item.description,
            "manufacturer": item.manufacturer,
            "name": item.name,
            "price": item.price,
            "email": cacheEmail,
            "quantity": item.quantity
        }
       
        await api.updateDocument(process.env.REACT_APP_DATABASE_ID, process.env.REACT_APP_CART_COLLECTION_ID, item.$id, cartItem);

        window.location.reload();
    }catch(err){
        console.error(err);
        toast.error(`${err}`);
    }
}

//render select element with option elements from 1 to quantity value
export function RenderCartQuantity(props: renderCartQuantity){

    const cartQuantity = [];

    //find item in inventory database
    const findItem = props?.inventory.filter((item:InventoryItem)=>item.name === props.name);

    for(let i = 1; i <= findItem[0]?.quantity; i++){
            cartQuantity.push(<option key = {`k-${i}`}>{i}</option>);
    };
    
    return(
        <select defaultValue = {props.cartItemQuantity ? props.cartItemQuantity : props?.quantity}onChange = {(e)=>props.setCartItemQuantity(e.target.value)}>
            {cartQuantity}
        </select>
    )
}

//when the user removes an item from the cart
async function handleDeleteCartItem(cartID: string){
    try{
        const data = await api.deleteDocument(process.env.REACT_APP_DATABASE_ID, process.env.REACT_APP_CART_COLLECTION_ID, cartID);

        if(data){
            window.location.reload();
        }

    }catch(err){
        console.error(err);
        toast.error(`${err}`);
    }
}

//When the user sells the items in the cart
async function handleMakeCartPurchase(props: CartPurchase){
    try{
        if(props.cart && props.cardInfo?.cardNumber){

            //returns an array that converts all objects within the cart as a string
            const cartAsString = props.cart.map((item:CartItem)=>JSON.stringify(item));

            const cartItems = {
                "cartItems": cartAsString
            }

            //go through each item in cart and each item in the inventory, and if they match names (because there are no duplicate items in the inventory), update that inventory items' quantity based on the purchase made from the cart
            props.inventory.forEach(
                async(inventoryItem:InventoryItem)=>{
                    for(let i = 0; i < props.cart.length; i++){
                        if(props.cart[i].name === inventoryItem.name){

                            const quantity = Number(inventoryItem.quantity) - Number(props.cart[i].quantity);
                            const inventoryID = inventoryItem.$id;

                            const cartItem = {
                                quantity: quantity
                            } 

                        const data = await api.updateDocument(process.env.REACT_APP_DATABASE_ID, process.env.REACT_APP_INVENTORY_COLLECTION_ID, inventoryID, cartItem);

                        console.log(data)

                        //Upon purchase, if an items' quantity reaches the reOrderLV, or is below the reOrderLV value, update the appropriate cart items' quantity 
                        // if(inventoryItem.reOrderLV >= quantity){

                        //     const updateCartItem = {
                        //         name: inventoryItem.name,
                        //         price: inventoryItem.price,
                        //         manufacturer: inventoryItem.manufacturer,
                        //         description: inventoryItem.description,
                        //         category: inventoryItem.category,
                        //         quantity: quantity + inventoryItem.reOrderLV
                        //     } 

                        //     await api.updateDocument(process.env.REACT_APP_DATABASE_ID, process.env.REACT_APP_INVENTORY_COLLECTION_ID, inventoryID, updateCartItem)
                        // }
                    }
                }
            })

            const data = await api.createDocument(process.env.REACT_APP_DATABASE_ID, process.env.REACT_APP_PURCHASES_COLLECTION_ID, cartItems, [Permission.read(Role.any())])

            console.log(data)

            //remove all currently purchased items from the cart database
            for(let i = 0; i<props.cart.length;i++){
                await api.deleteDocument(process.env.REACT_APP_DATABASE_ID, process.env.REACT_APP_CART_COLLECTION_ID, props.cart[i].$id);
            }

            const payment ={
                "cardNumber": props.cardInfo?.cardNumber,
                "cardExpiration": props.cardInfo?.expirationDate,
                "cardSecurity": props.cardInfo?.securityNumber,
                "cardType": props.cardInfo?.type,
                "total": props.total
            }


            //add payment info to payment database
            const response = await api.createDocument(process.env.REACT_APP_CART_DATABASE_ID, process.env.REACT_APP_PAYMENTS_COLLECTION_ID, payment, [Permission.read(Role.any())])

            console.log(response)

            // if(data && response){
            //     window.location.reload();
            // }

        }else{
            toast.error("An error has occured, please ensure that all fields are filled out before continuing.")
        }


    }catch(err){
        console.error(err);
        toast.error(`${err}`);        
    }
} 

//render cart, cart total, item totals, and item quantities
export function RenderCart(props: Cart){

        const totalOfCart:React.JSX.Element[] = [];

        let total = ""
        let cartTotal:number = 0
        let decimalTotal:number = 0
        const userCart = props.cart.map((item: CartItem,i: number)=>{

            let itemPriceTotal = 0
            itemPriceTotal = Number(item.price) * parseInt(item.quantity)

            cartTotal += parseInt(itemPriceTotal.toString().split(".")[0])

            if(itemPriceTotal.toString().includes(".")){
                decimalTotal += parseInt(itemPriceTotal.toFixed(2).toString().split(".")[1]) 
            }

            if(i === props.cart.length-1){

                let decimalNumbers = decimalTotal.toString().split("")

                if(decimalNumbers.length > 2){
                    const remainder:string = decimalNumbers.shift() as string
                    cartTotal += parseInt(remainder)
                }

                const decimals = decimalNumbers.join("")

                total = cartTotal.toString()
                total += "." + decimals
            }

            const checkCartQuantity = props.cartItemQuantity ? props.cartItemQuantity : item.quantity
            total = Number(total).toFixed(2)

            if(props.cart.length === 1){

            totalOfCart.push(           
                <div className = "flex flex-col alignCenter" key = "cartTotal">
                    <div className = "flex justifyCenter cartTotal" key = {total}><h2>Total: </h2> <h2>${total}</h2></div>
        
                    {Button({text: "Purchase Items", handleButtonClick: ()=>handleMakeCartPurchase({inventory: props.inventory, cart: props.cart,cardInfo: props.cardInfo, total: total})})}
                </div>)

            return(
                    <section className = "flex flex-col alignCenter" key = {i}>

                        <div className="flex justifyBetween alignCenter">
                            <div className="flex alignCenter">
                                <h2>{item.name}</h2><i className = "fa-solid fa-xmark button" onClick = {()=>handleDeleteCartItem(item.$id)}></i>
                            </div>
                                
                                <h2>Quantity: {RenderCartQuantity({name: item.name, quantity: item.quantity, inventory: props.inventory, cartItemQuantity: props.cartItemQuantity, setCartItemQuantity: (e:string)=>props.setCartItemQuantity(e)})} 
                                {Button({text: "Update", handleButtonClick: ()=>EditCart({name: item.name, price: item.price, email: item.email, quantity: checkCartQuantity, manufacturer: item.manufacturer, description: item.description, category: item.category, $id: item.$id, itemID: item.itemID})})}</h2>
                      
                                <h2>${parseInt(item?.quantity) > 1 ? itemPriceTotal.toFixed(2)  : item.price}</h2>
                        </div>

                    </section>
                )

            }else if(props.cart.length > 1 && i !== props.cart.length-1){
                return(
                    <section className = "flex flex-col" key = {i}>

                    <div className="flex justifyBetween">
                    <h2>{item.name} <i className = "fa-solid fa-xmark button" onClick = {()=>handleDeleteCartItem(item.$id)}></i></h2>
                    <h2>Quantity: {RenderCartQuantity({name: item.name, quantity: item.quantity, inventory: props.inventory, cartItemQuantity: props.cartItemQuantity, setCartItemQuantity: (e:string)=>props.setCartItemQuantity(e)})} {Button({text: "Update", handleButtonClick: ()=>EditCart({name: item.name, price: item.price, email: item.email, quantity: checkCartQuantity, manufacturer: item.manufacturer, description: item.description, category: item.category, $id: item.$id, itemID: item.itemID})})}</h2>
                    <h2>${parseInt(item?.quantity) > 1 ? itemPriceTotal.toFixed(2)   : item.price}</h2>
                    </div>

                </section>
                )

            }else if(i === props.cart.length-1){


                totalOfCart.push(           
                    <div className = "flex flex-col alignCenter" key = "cartTotal">
                        <div className = "flex justifyCenter cartTotal" key = {total}><h2>Total: </h2> <h2>${total}</h2></div>
            
                        {Button({text: "Purchase Items", handleButtonClick: ()=>handleMakeCartPurchase({inventory: props.inventory, cart: props.cart,cardInfo: props.cardInfo, total: total})})}
                    </div>)

                return(
                    <section className = "flex flex-col alignCenter" key = {i}>

                    <div className="flex justifyBetween alignCenter">
                        <div className="flex justifyBetween alignCenter">
                            <h2>{item.name} <i className = "fa-solid fa-xmark button" onClick = {()=>handleDeleteCartItem(item.$id)}></i></h2>
                        </div>

                        <h2>Quantity: {RenderCartQuantity({name: item.name, quantity: item.quantity, inventory: props.inventory, cartItemQuantity: props.cartItemQuantity, setCartItemQuantity: (e:string)=>props.setCartItemQuantity(e)})} 
                        {Button({text: "Update", handleButtonClick: ()=>EditCart({name: item.name, price: item.price, email: item.email, quantity: checkCartQuantity, manufacturer: item.manufacturer, description: item.description, category: item.category, $id: item.$id, itemID: item.itemID})})}</h2>

                        <h2>${parseInt(item?.quantity) > 1 ? itemPriceTotal.toFixed(2)   : item.price}</h2>

                    </div>
                    </section>
                )
            }

        }).slice(props.startIndex, props.endIndex)

        if(userCart.length){
            return [userCart, totalOfCart]
        }else{
            return(
                <section className = "flex flex-col">
                    <h2>No items in the cart currently</h2>
                </section>
            )
        }


}

