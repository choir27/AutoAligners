import React, {useState} from "react"
import {toast} from "react-toastify"
import api from "../api/api.jsx"
import { Permission, Role } from "appwrite"
import {ServiceEstimate, SelectOptions, TextBox, GeneralInput, ChooseInput, Appointment, RenderCalendar, TimeDateAppointments, ChangeTime} from "../middleware/Interfaces"


export function TextBoxInput(props: TextBox):React.JSX.Element{
    return(
        <textarea 
            rows = {props.height} 
            cols = {props.width} 
            spellCheck = {true} 
            wrap = "hard" 
            onChange={(e)=>props.onChange(e.target.value)} 
            placeholder={props.placeholder} 
        />
    )
}

export function SelectCarMakeInput(props: SelectOptions):React.JSX.Element{

    //sets value for previously selected car make 
    const [previousCarMake, setPreviousCarMake] = useState<string>(props.carMake);

    return(
        <select 
        defaultValue = {props.defaultValue}
        onChange = {(e)=>{
            props.onChange(e.target.value);

            //checks for empty string value for previousCarMake state
            if(!previousCarMake){
                setPreviousCarMake(e.target.value);
            };

            //checks if the previousCarMake value is not the same as the current value selected (checks if user changes carMake value)
            if(previousCarMake !== e.target.value){
                //resets model and year values to account for changed carMake value
                //we don't want to reset make, as that would defeat the purpose of selecting new values
                props.resetYear("");
                props.resetModel("");

                //set previous previousCarMake value to the new current value selected
                setPreviousCarMake(e.target.value);
            }

        }}>
            <option value = "default">Select {props.defaultValue}</option>
            {props.options}
        </select>
    )
}

export function SelectCarModelInput(props: SelectOptions):React.JSX.Element{

    //sets value for previously selected car model
    const [previousCarModel, setPreviousCarModel] = useState<string>(props.carModel);

    return(
        <select 
        defaultValue = {props.defaultValue}
        onChange = {(e)=>{
            props.onChange(e.target.value)
            
            //checks for empty string value for previousCarModel state
            if(!previousCarModel){
                setPreviousCarModel(e.target.value);
            }
  
            //checks if the previousCarModel value is not the same as the current value selected (checks if user changes carModel value)
            if(previousCarModel !== e.target.value){
                //resets year value to account for changed carModel value
                props.resetYear("");
                //we don't want to reset model/make, as that would defeat the purpose of selecting new values
                setPreviousCarModel(e.target.value)
            }
        }}>
            <option value = "default">Select {props.defaultValue}</option>
            {props.options}
        </select>
    )
}

export function SelectCarYearInput(props: SelectOptions):React.JSX.Element{
    return(
        //changing year value does not directly effect carMake and/or carModel, so there is no need to check if value has changed
        <select 
        defaultValue = {props.defaultValue}
        onChange = {(e)=>props.onChange(e.target.value)}>
            <option value = "default">Select {props.defaultValue}</option>
            {props.options}
        </select>
    )

}

export function Input(props: GeneralInput):React.JSX.Element{
    return(
        <input
            id = {props.id}
            value = {props.value}
            defaultValue = {props.defaultValue}
            type = {props.type}
            onChange = {(e)=>props.onChange(e.target.value)}
            placeholder = {props.placeholder}
            minLength = {props.minlength}
            maxLength = {props.maxlength}
        />
    )
}

export function ChooseTwoInput(props: ChooseInput){
    return(
        <section className = "flex justifyCenter">
            <input type = "radio" value = {props.text1} name = {props.name} onChange = {(e)=>props.onChange(e.target.value)}/>
            <label>{props.text1}</label> 

            <input type = "radio" value = {props.text2} name = {props.name} onChange = {(e)=>props.onChange(e.target.value)}/>
            <label>{props.text2}</label> 
        </section>
    )
};



export function ChooseCarService(onChange:(e:string)=>void, defaultValue?: string){
    try{
        //list of all available car services
        const services = ["Oil Change","Brakes","Tire Purchase/Installation","Tire Services","Vehicle Inspection","Check Engine Light","Air Conditioning","Batteries Starting & Charging","Belts & Hoses","Engine","Exhaust","Fuel Systems","Heating & Cooling","Routine Maintenance","Steering Suspension Alignment","Transmission","Other"];

        //returns a new array of react jsx elements with all available car services
        const serviceOptions = services.map((service:string,i:number)=>service !== defaultValue ? <option key = {i}>{service}</option> : "");

        return(
            <select onChange = {(e)=>onChange(e.target.value)}>
                <option defaultValue = {defaultValue || "default"}>{defaultValue || `Choose Service For Your Car`}</option>
                {serviceOptions}
            </select>
        )
    }catch(err){
        console.error(err);
        toast.error(`${err}`);
    }
}

function handleChangeTime(props: ChangeTime){
    props.e.preventDefault();
    props.setTime(props.time)
            
    document.querySelectorAll(".time").forEach(ele=>{
        ele.classList.remove("clicked")
    });

    document.querySelector(`.t-${props.i}`)?.classList.add("clicked");
}

export function handleRenderCalendar(props: RenderCalendar){
    const date = `${props.currentMonth}/${props.currentDay}/${props.currentYear}D${props.daysOfWeek[props.currentDayOfWeek]}`
    props.setDate(date);
        document.querySelectorAll(".calendar").forEach(ele=>{
            ele.classList.remove("clicked")
        });

        document.querySelector(`.c-${props.i}`)?.classList.add("clicked");
}

export function DisplayTimeDateAppointments(props: TimeDateAppointments):React.JSX.Element{

    const date = new Date();
    //+1 because Date.prototype.getMonth() starts at 0 to represent index
    let month:number = date.getMonth()+1;
    let day:number = date.getDate();
    let year:number = date.getFullYear();
    let dayOfWeek:number = date.getDay();

    const [selectedDate, setSelectedDate] = useState<string>(`${month}/${day}/${year}`);

    //list of days in a week
    const daysOfWeek = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

    const appt:React.JSX.Element[] = [];

    for(let i = 0; i < 8; i++){

        let currentMonth = month;
        let currentDay = day;
        let currentYear = year;
        let currentDayOfWeek = dayOfWeek;

        switch(month){
            case 1:
            case 3:
            case 5:
            case 7:
            case 8:
            case 10:
                if(currentDay > 31){
                    day = 1;
                    currentDay = 1;
                    currentMonth++;
                    month++;
                }
                break;
            case 4:
            case 6:
            case 9:
            case 11:
                if(currentDay > 30){
                    day = 1;
                    currentDay = 1;
                    currentMonth++;
                    month++;
                }
                break;
            case 2:
                if(currentDay > 28){
                    day = 1;
                    currentDay = 1;
                    currentMonth++;
                    month++;
                }
                break;
            case 12:
                if(currentDay > 31){
                    day = 1;
                    currentDay = 1;
                    currentMonth =1;
                    month++;
                    year++
                    currentYear++
                }
                break;
        }

        //have the current date as the default value
        //set a state called selectedDate and save the current date to its value
        //if a different date is selected, change the selected date as the current value of setSelectedDate
        //use the selectedDate value to show the different appointment times that are avaiable for the respective date

        if(currentDayOfWeek > 6){
            dayOfWeek = 0;
            currentDayOfWeek = 0
        }

        if(props.date?.split("D")[0] === `${currentMonth}/${currentDay}/${currentYear}`){
            appt.push(
                <div className = {`calendar clearButton c-${i} clicked`} key = {`c-${i}`} onClick = {()=>{
                    const date = `${currentMonth}/${currentDay}/${currentYear}`
                    setSelectedDate(date)
                    handleRenderCalendar({currentMonth: currentMonth, currentDay: currentDay, currentYear: currentYear, daysOfWeek: daysOfWeek, currentDayOfWeek, setDate: (e:string)=> props.setDate(e), i: i})
                }}>
                    <h3>{daysOfWeek[currentDayOfWeek]}</h3>
                    <h3>{`${currentMonth}/${currentDay}/${currentYear}`}</h3>
                </div>
            )
        }

       else{
            appt.push(
                <div className = {`calendar clearButton c-${i}`} key = {`c-${i}`} onClick = {()=>{
                    const date = `${currentMonth}/${currentDay}/${currentYear}`
                    setSelectedDate(date)
                    handleRenderCalendar({currentMonth: currentMonth, currentDay: currentDay, currentYear: currentYear, daysOfWeek: daysOfWeek, currentDayOfWeek, setDate: (e:string)=> props.setDate(e), i: i})
                }}>
                    <h3>{daysOfWeek[currentDayOfWeek]}</h3>
                    <h3>{`${currentMonth}/${currentDay}/${currentYear}`}</h3>
                </div>
            )
        }

        day++;
        dayOfWeek++;

    }


    const filterAppointmentTimes = props.appointments.filter((appointment:Appointment) => appointment.date.split("D")[0] === selectedDate)
 
    const appointmentTimes = filterAppointmentTimes.map((appointment:Appointment) => appointment.time)

        let jsx = [];

        //times at :00 mark
        for(let time = 7; time <= 17; time++){
                const timeDisplay = time.toString() + ":00"
                if(!appointmentTimes.includes(timeDisplay)){
                    jsx[time-7] = (timeDisplay);
                }
        }

        const miliaryTimeConversion = jsx.map((time:string)=>{
            const hours = (parseInt(time.split(":")[0]));

            if(parseInt(time)>12){
                //data structure of 1:00PM, 13:00
                return [(hours-12).toString() + ":00PM", time];
            }else if(parseInt(time) === 12){
                //data structure of 12:00PM, 12:00
                return [hours + ":00PM", time];
            }else{
                //data structure of 1:00AM, 1:00
                return [hours + ":00AM", time];
            }
        })

        //render clear buttons of appointment dates
        const finalJSX = miliaryTimeConversion.map((jsx,i)=>{
            if(jsx[1] === props.time){
                return(
                <button 
                className = {`clearButton t-${i} time clicked`} key = {i}
                onClick = {(e: React.MouseEvent<HTMLButtonElement, MouseEvent>)=>handleChangeTime({i: i, e: e, time: jsx[1], setTime: (e:string)=>props.setTime(e)})}>
                    {jsx[0]}
                </button>
                )
            }else{
            return(
            <button 
                  className = {`clearButton t-${i} time`} key = {i}
                  onClick = {(e: React.MouseEvent<HTMLButtonElement, MouseEvent>)=>handleChangeTime({i: i, e: e, time: jsx[1], setTime: (e:string)=>props.setTime(e)})}>
                      {jsx[0]}
            </button>
                 )
            }
    })


        return(
            <section className = "appointmentHub">
                <section className = "calendarHub flex">
                    {appt}
                </section>

                <section className = "appointmentTimes flex">
                    {finalJSX}
                </section>
            </section>
        )

}

export function checkAppointmentDate(date: string, time: string, setDate: (e:string)=>void):string | void{

    if(!date){
        toast.error("Pick a valid date");
        return;
    }

    if(!time){
        toast.error('Pick a valid time');
        return;
    }

    const arrayOfDateAppt = date.split("D")[0].split("/");
    let arrayOfTimeAppt = time.split(":");

    let militaryTime:string = arrayOfTimeAppt[0];

    if(arrayOfTimeAppt[1].includes("PM") && !arrayOfTimeAppt[0].includes("12")){
        militaryTime = (parseInt(arrayOfTimeAppt[0]) + 12).toString();
    }

    //military time

    const currentDate = new Date();

    //Checks if month/date/year of appointment is current/future date
    if(parseInt(arrayOfDateAppt[1]) < currentDate.getDate() || parseInt(arrayOfDateAppt[0]) < currentDate.getMonth()+1 || parseInt(arrayOfDateAppt[2]) < currentDate.getFullYear()){
        toast.error("Choose a current date or a date in the future.");
        return;
    }   

    //check if current month matches appointment month
    //check if current day matches appointment day
    //check if current year matches appointment year

    //check if appointment hours is less than the current hours value
    //check if current time has minutes, and if it does WHILE having the hours be less than the current hours value

    const checkForSameDay = ((currentDate.getMinutes() && parseInt(militaryTime) <= currentDate.getHours()) &&(parseInt(arrayOfDateAppt[1]) === currentDate.getDate()) && (parseInt(arrayOfDateAppt[0]) === currentDate.getMonth()+1) && (parseInt(arrayOfDateAppt[2]) === currentDate.getFullYear()))

    if(checkForSameDay){
        toast.error("Choose a current time or a time in the future.");
        return; 
    }


    const appointmentDayoFWeek = new Date(parseInt(date.split("/")[2]),parseInt(date.split("/")[0]),parseInt(date.split("/")[1]));
    const daysOfWeek = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    const getAppointmentDayoFWeek = appointmentDayoFWeek.getDay();

    if(!daysOfWeek.includes(date.split("D")[1])){
        setDate(`${date}D${daysOfWeek[getAppointmentDayoFWeek]}`)
    }

}

export async function handleSubmitData(props: Appointment):Promise<void>{         
    
            const formData = {
                "date":props.date,
                "time":props.time,
                "carMake":props.carMake,
                "carYear":props.carYear,
                "carModel":props.carModel,
                "stayLeave":props.stayLeave,
                "service":props.service,
                "firstName":props.firstName,
                "lastName":props.lastName,
                "email":props.email,
                "phone":props.phone,
                "zipCode":props.zipCode,
                "contact":props.contact,
                "comment":props.comment
            }

            await api.createDocument(process.env.REACT_APP_DATABASE_ID, process.env.REACT_APP_COLLECTION_ID, formData, [Permission.read(Role.any())])

            window.location.reload();   
}

export function Alert(text: string){
    alert(text)
}

export function handleCreateAppointment(date: string, time: string, setDate: (e:string)=>void, props: Appointment){
    checkAppointmentDate(date, time, (e:string)=>setDate(e))

    if(!checkInputValidation({service: props.service, firstName: props.firstName, lastName: props.lastName, date: props.date, time: props.time, carModel: props.carModel, carMake: props.carMake, carYear:props.carYear, email: props.email, phone: props.phone, zipCode: props.zipCode, contact: props.contact, comment: props.comment, stayLeave:props.stayLeave})){
        return;
    }
}

export function checkInputValidation(props: Appointment):false|undefined{
            if(!props.date){
                toast.error("Please select a proper date");
                return false;
            }else if(!props.time){            
                toast.error("Please select an available time");
                return false;
            }else if(!props.carMake || props.carMake === "Select Car Make"){
                toast.error("Please select a proper car make");
                return false;
            }else if(!props.carModel || props.carModel === "Select Car Model"){
                toast.error("Please select a proper car model");
                return false;
            }else if(!props.carYear || props.carYear === "Select Car Year"){
                toast.error("Please select a proper car year");
                return false;
            }else if(!props.stayLeave){
                toast.error("Please pick between dropping off your car and waiting for it");
                return false;
            }else if(!props.service || props.service === "Choose Service For Your Car"){
                toast.error("Please Pick a valid Car Service");
                return false;
            }else if(!props.firstName || !props.lastName){
                toast.error("Please input your name");
                return false;
            }else if(!props.email){
                toast.error("Please input your email");
                return false;
            }else if(!props.phone){
                toast.error("Please input your phone number");
                return false;
            }else if(!props.zipCode){
                toast.error("Please input your zip code!");
                return false;
            }else if(!props.contact){
                toast.error("Please choose preferred contact method");
                return false;
            }

            const name = /^[A-Za-z]+$/;
            const mail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

            if(!name.test(props.firstName) || !name.test(props.lastName)){
                toast.error("Please input a valid name");
                return false;
            }else if(!mail.test(props.email)){
                toast.error('Please input a valid email');
                return false;
            }

            Alert("Appointment Made!")

            handleSubmitData({service: props.service, firstName: props.firstName, lastName: props.lastName, date: props.date, time: props.time, carModel: props.carModel, carMake: props.carMake, carYear: props.carYear, email: props.email, phone: props.phone, zipCode: props.zipCode, contact: props.contact, comment: props.comment, stayLeave:props.stayLeave});
}



export function validateServiceEstimateInput(props: ServiceEstimate):false|undefined{
    if(!props.carMake || props.carMake === "Select Car Make"){
        toast.error("Please select a proper car make");
        return false;
    }else if(!props.carModel || props.carModel === "Select Car Model"){
        toast.error("Please select a proper car model");
        return false;
    }else if(!props.carYear || props.carYear === "Select Car Year"){
        toast.error("Please select a proper car year");
        return false;
    }else if(!props.stayLeave){
        toast.error("Please pick between dropping off your car and waiting for it");
        return false;
    }else if(!props.service || props.service === "Choose Service For Your Car"){
        toast.error("Please Pick a valid Car Service");
        return false;
    }else if(!props.firstName || !props.lastName){
        toast.error("Please input your name");
        return false;
    }else if(!props.email){
        toast.error("Please input your email");
        return false;
    }else if(!props.phone){
        toast.error("Please input your phone number");
        return false;
    }else if(!props.zipCode){
        toast.error("Please input your zip code!");
        return false;
    }else if(!props.contact){
        toast.error("Please choose preferred contact method");
        return false;
    }

    const name = /^[A-Za-z]+$/;
    const mail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if(!name.test(props.firstName) || !name.test(props.lastName)){
        toast.error("Please input a valid name");
        return false;
    }else if(!mail.test(props.email)){
        toast.error('Please input a valid email');
        return false;
    }

    Alert("Estimatation Submitted!")

    SubmitServiceEstimate({service: props.service, firstName: props.firstName, lastName: props.lastName, carModel: props.carModel, carMake: props.carMake, carYear: props.carYear, email: props.email, phone: props.phone, zipCode: props.zipCode, contact: props.contact, comment: props.comment, stayLeave:props.stayLeave});
}


export async function SubmitServiceEstimate(props: ServiceEstimate):Promise<void>{         
    
    const formData = {
        "carMake":props.carMake,
        "carYear":props.carYear,
        "carModel":props.carModel,
        "stayLeave":props.stayLeave,
        "service":props.service,
        "firstName":props.firstName,
        "lastName":props.lastName,
        "email":props.email,
        "phone":props.phone,
        "zipCode":props.zipCode,
        "contact":props.contact,
        "comment":props.comment
    }

    
    const data = await api.createDocument(process.env.REACT_APP_DATABASE_ID, process.env.REACT_APP_SERVICE_COLLECTION_ID, formData, [Permission.read(Role.any())])

    if(data){
        window.location.reload();   
    }

}