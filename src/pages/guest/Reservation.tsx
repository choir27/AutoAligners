    import React, {useState, useEffect, useContext} from "react"
    import {Button} from "../../components/Button"
    import Nav from "../../components/Nav"
    import {DisplayTimeDateAppointments, SelectCarMakeInput, SelectCarModelInput, ChooseTwoInput, SelectCarYearInput, ChooseCarService, Input, TextBoxInput, handleCreateAppointment} from "../../hooks/ReservationHooks"
    import Footer from "../../components/Footer"
    import { GetCarData} from "../../hooks/ApiCalls"
    import {APIContext} from "../../middleware/Context"

    export default function Reservation(){

        const [date, setDate] = useState<string>("");
        const [time, setTime] = useState<string>("");
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
        const {appointments} = useContext(APIContext);

        const [carMakeOptions, setCarMakeOptions] = useState<React.JSX.Element[]>([]);
        const [carModelOptions, setCarModelOptions] = useState<React.JSX.Element[]>([]);
        const [carYearOptions, setCarYearOptions] = useState<React.JSX.Element[]>([]);    
        const [stayLeave, setStay_Leave] = useState<string>("");
        const [service, setService] = useState<string>("");

        useEffect(()=>{
            GetCarData({onMakeSelect: setCarMakeOptions, onModelSelect: setCarModelOptions, onYearSelect: setCarYearOptions, carMake: carMake, carModel:carModel});

        },[carMake, carModel]);
        

        return(
            <main id = "reservation">

                <Nav pageHeading = {"Make Reservation"}/>

                {DisplayTimeDateAppointments({setTime: (e:string)=>setTime(e), appointments: appointments, setDate: (e:string)=>setDate(e)})}

                    <section className = "flex flex-col">

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

                            <section className = "section-1 flex flex-col alignCenter">
                                <section className = "flex justifyBetween contact">
                                    {Input({type: "text", onChange: (e:string)=>setFirstName(e), placeholder: "First Name"})}
                                    {Input({type: "text", onChange: (e:string)=>setLastName(e), placeholder: "Last Name"})}
                                </section>
                
                                <section className = "flex justifyBetween contact"> 
                                    {Input({type: "text", onChange: (e:string)=>setEmail(e), placeholder: "Email Address"})}
                                    {Input({type: "tel", onChange: (e:string)=>setPhone(e), placeholder: "###-###-####", minlength: 10, maxlength: 10})}
                                </section>

                                {Input({type: "text", onChange: (e:string)=>setZipCode(e), placeholder: "Postal/Zip Code", minlength: 5, maxlength: 5})}

                                <section className="flex flex-col alignCenter contact">
                                    <h2>Preferred Contact Method</h2>

                                    {ChooseTwoInput({text1:"Email",text2: "Phone",name: "contact" ,onChange: (e:string)=>setContact(e)})}
                                    {TextBoxInput({width: 50, height: 10, onChange: (e:string)=>setComment(e), placeholder: "Additional Comments"})}

                                </section>  

                            </section>
                 
                        </div>                 

                    </section>

                    <div className="flex justifyCenter">
                        <Button
                        text = "Reserve Appointment"
                        handleButtonClick={()=> handleCreateAppointment(date, time, (e:string)=>setDate(e),{service: service, firstName: firstName, lastName: lastName, date: date, time: time, carModel: carModel, carMake: carMake, carYear:carYear, email: email, phone: phone, zipCode: zipCode, contact: contact, comment: comment, stayLeave:stayLeave})}/>
                    </div>

                <Footer/>

            </main>
        )
    }