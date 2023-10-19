import {useState, useContext} from "react"
import Nav from "../../components/Nav"
import Footer from "../../components/Footer"
import {RenderCart, RenderPaymentForm} from "../../hooks/CartHooks"
import PaginatedButtons from "../../components/Graphs/PaginatedButtons"
import {CardInfo} from "../../middleware/Interfaces"
import {APIContext} from "../../middleware/Context"

export default function Cart(){

    const {cart, inventory} = useContext(APIContext);
    const [cartItemQuantity, setCartItemQuantity] = useState<string>()
    const [cardInfo, setCardInfo] = useState<CardInfo>()
    const [currentPage, setCurrentPage] = useState(1);

    const rowsPerPage = 2;

    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;  


    return(
        <main id = "cart">
            <Nav pageHeading = {"Cart"}/>
            
                <section className = "cartContainer flex justifyBetween">

                    <PaginatedButtons className = {`flex flex-col alignCenter`} currentPage = {currentPage} cartLength = {cart.length} setCurrentPage = {(e:number)=>setCurrentPage(e)} rowsPerPage={rowsPerPage}/>

                    <section className = {`flex flex-col justifyCenter`}>
                        {RenderCart({cart: cart, inventory: inventory, cartItemQuantity: cartItemQuantity, setCartItemQuantity: (e:string)=>setCartItemQuantity(e), cardInfo: cardInfo, setCardInfo: (e:CardInfo)=>setCardInfo(e), startIndex: startIndex, endIndex: endIndex})}
                    </section>

                    {RenderPaymentForm(cardInfo, (e:CardInfo)=>setCardInfo(e))}
                </section>


            <Footer/>
        </main>
    )
}