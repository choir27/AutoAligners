import Nav from "../components/Nav"
import Footer from "../components/Footer"
import {ButtonLink} from "../components/Button"
import Assets from "../components/Assets.jsx"
import Employee from "./employee/Employee"
import {cacheEmail} from "../middleware/Cache"

export default function Home(){

    return(
        <>
        {cacheEmail ?
        <Employee/>
        :
        <main id = "home">
            <Nav pageHeading = ""/>
                <section className = "flex hero">

                    <section className = "flex flex-col justifyCenter alignStart">
            
                        <h2>Say Goodbye to Car Repair Hassles</h2>
    
                        <p>For over a century, dating back to 1892, we have been steadfast in providing exceptional service. Our commitment to delivering the finest quality service has been instrumental in establishing a strong reputation. We are determined to continue building on this legacy with your support.</p>

                        {cacheEmail ? ButtonLink({domain: "/employee", text: "Employee Hub"}) : ButtonLink({domain: "/reservation", text: "Make Reservation"})}
                    </section>

                    <div className = "imageContainer">
                        <img src = {Assets.whiteCar} alt = "white car"/>
                    </div>

             
                </section>
            <Footer/>
        </main>
        }
        </>
    )   
}