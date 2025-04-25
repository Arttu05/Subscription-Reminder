import { useState } from "react";
import "../styles/add-reminder.css"
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import axios from "axios";
import { BACKEND_URL } from "../const";
import { useAuth } from "../context";
import { useNavigate } from "react-router-dom";

export function AddReminderElem(){

    const {token} = useAuth()
    const navigate = useNavigate()

    const [title, setTitle] = useState()
    const [message, setMessage] = useState()
    const [selectedDate, setSelectedDate] = useState(new Date())
    const [delete_after, set_delete_after] = useState(false)
    const [again_after, set_again_after] = useState(false)

    const [addErr, setAddErr] = useState(false)

    
    function DateCahnge(e){
        console.log(e.getTime()) //unix time
        setSelectedDate(e)
    }

    function RadioButtonChange(e){

        console.log(e.target.value)

        if(e.target.value === "delete_after"){
            set_delete_after(true)
            set_again_after(false)
        }
        else if(e.target.value === "again_after"){
            set_delete_after(false)
            set_again_after(true)
        }
    }

    // TODO validate date, must be bigger than this date

    function SubmitEvent(e){
        e.preventDefault()
        
        setAddErr(false)
        
        axios({ method: "post", url: `${BACKEND_URL}/api/add`, headers:{"Authorization": `Bearer ${token}`} ,data: {
            title: title,
            message: message,
            selected_date: selectedDate.getTime(),
            delete_after: delete_after,
            again_after: again_after
        }})
        .then((response) => {
            console.log(response)
            navigate("/dashboard")
        })
        .catch((err) => {
            console.log(err)
            setAddErr(true)
        })

    }

    return(
        <>
            <div className="add-reminder-card">
                <h2>Add Reminder</h2>
                <form action="" onSubmit={SubmitEvent}>
                    <span>Title</span>
                    <input type="text" placeholder="the title for the notification" onChange={(e) => {setTitle(e.target.value)}} required/>
                    <span>Message</span>
                    <textarea type="text" className="message-area" placeholder="small caption/message about the notification" onChange={(e) => {setMessage(e.target.value)}} required/>
                    <span>Remind date</span>
                    <DatePicker 
                        selected={selectedDate} 
                        onChange={DateCahnge}
                        showTimeSelect 
                        dateFormat={"Pp"} 
                        timeFormat={"p"}
                    />
                    <span>After notification</span>
                    <div className="radio-button-container">
                        <input type="radio" name="after_notification" value={"again_after"} id="again_after" onChange={RadioButtonChange} required/>
                        <label className="radio_button_label" htmlFor="again_after">Remind again after 30 days</label>
                    </div>
                    <div className="radio-button-container last-radio-container">
                        <input type="radio" name="after_notification" value={"delete_after"} id="delete_after" onChange={RadioButtonChange} required/>
                        <label className="radio_button_label" htmlFor="delete_after">Delete after</label>
                    </div>

                    <button type="submit">Add</button>
                </form>

                {addErr &&
                    <div className="error-message">
                        <span className="error-message-text">Something went wrong</span>
                    </div>
                }

            </div>
        </>
    )
}