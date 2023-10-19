import React, {useState, useEffect} from "react"
import {Button} from "../../components/Button"
import Nav from "../../components/Nav"
import {validateServiceEstimateInput, SelectCarMakeInput, SelectCarModelInput, ChooseTwoInput, SelectCarYearInput, ChooseCarService, Input, TextBoxInput} from "../../hooks/ReservationHooks"
import Footer from "../../components/Footer"
import {GetCarData} from "../../hooks/ApiCalls"

export default function ServiceEstimate(){

    const [carModel, setCarModel] = useState<string>("");
    const [carMake, setCarMake] = useState<string>("");
    const [carYear, setCarYear] = useState<string>("");
    const [firstName, setFirstName] = useState<string>("");
    const [lastName, setLastName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [phone, setPhone] = useState<string>("");
    const [zipCode, setZipCode] = useState<string>("");
    const [contact, setContact] = useState<string>("");
    const [comment, setComment] = useState<string>("");

    const [carMakeOptions, setCarMakeOptions] = useState<React.JSX.Element[]>([]);
    const [carModelOptions, setCarModelOptions] = useState<React.JSX.Element[]>([]);
    const [carYearOptions, setCarYearOptions] = useState<React.JSX.Element[]>([]);    
    const [stayLeave, setStay_Leave] = useState<string>("");
    const [service, setService] = useState<string>("");


    useEffect(()=>{
        GetCarData({onMakeSelect: setCarMakeOptions, onModelSelect: setCarModelOptions, onYearSelect: setCarYearOptions, carMake: carMake, carModel:carModel});
    },[carMake, carModel]);
    

    function handleServiceEstimate():void{    

        if(!validateServiceEstimateInput({service: service, firstName: firstName, lastName: lastName, carModel: carModel, carMake: carMake, carYear:carYear, email: email, phone: phone, zipCode: zipCode, contact: contact, comment: comment, stayLeave:stayLeave})){
            return;
        }

    }

    return (
        <main id = "serviceEstimate">

        <Nav pageHeading = "Estimate Car Service"/>


        <form className = "flex flex-col alignStart">
            <div className = "flex justifyBetween">
                
            <section className = "section-1 flex flex-col alignCenter">
                <section className = "flex flex-col alignCenter">
                    {SelectCarMakeInput({defaultValue: "Car Make", options: carMakeOptions, onChange: (e:string)=>setCarMake(e), carMake: carMake, carYear: carYear, carModel: carModel, resetModel: (e:string)=>setCarModel(e), resetYear:(e:string)=>setCarYear(e), resetMake:(e:string)=>setCarMake(e)})}
                    {SelectCarModelInput({defaultValue: "Car Model", options: carModelOptions, onChange: (e:string)=>setCarModel(e), carMake: carMake, carModel: carModel, carYear: carYear, resetModel:(e:string)=>setCarModel(e), resetYear: (e:string)=>setCarYear(e), resetMake:(e:string)=>setCarMake(e)})}
                    {SelectCarYearInput({defaultValue: "Car Year", options: carYearOptions, onChange: (e:string)=>setCarYear(e), carMake: carMake, carModel: carModel, carYear: carYear, resetModel:(e:string)=>setCarModel(e),resetYear:(e:string)=>setCarYear(e),resetMake:(e:string)=>setCarMake(e)})}   
                </section>
                  
                    {ChooseTwoInput({text1: "Drop off car",text2: "Wait for car",name: "stayLeave",onChange: (e:string)=>setStay_Leave(e)})}

                    {ChooseCarService((e:string)=>setService(e))}

            </section>

            <section className = "section-1 flex flex-col">
                 <section className="flex justifyBetween contact">
                 {Input({type: "text", onChange: (e:string)=>setFirstName(e), placeholder: "First Name"})}
                 {Input({type: "text", onChange: (e:string)=>setLastName(e), placeholder: "Last Name"})}
                 </section>
                <section className = "flex justifyBetween contact">
                {Input({type: "text", onChange: (e:string)=>setEmail(e), placeholder: "Email Address"})}
            {Input({type: "tel", onChange: (e:string)=>setPhone(e), placeholder: "###-###-####", minlength: 10, maxlength: 10})}
                </section>

                <section className = "flex justifyBetween alignCenter contact">
                {Input({type: "text", onChange: (e:string)=>setZipCode(e), placeholder: "Postal/Zip Code", minlength: 5, maxlength: 5})}
            

                <div className = "flex flex-col alignCenter contact">
                    <h2 className = "textAlignCenter">Preferred Contact Method</h2>

                    {ChooseTwoInput({text1:"Email",text2: "Phone",name: "contact" ,onChange: (e:string)=>setContact(e)})}

                </div>

                </section>

                {TextBoxInput({width: 50, height: 10, onChange: (e:string)=>setComment(e), placeholder: "Additional Comments"})}

            </section>
            </div>



            <section className="flex justifyCenter submit">
            <Button
        text = "Submit Service Estimate"
        handleButtonClick={()=>handleServiceEstimate()}/>

            </section>
          

        </form>


        <Footer/>
    </main>
    )
}