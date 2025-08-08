import { useEffect, useState } from "react"
import { NavLink, useNavigate, useParams } from "react-router-dom"
import "../styles/edit-page.css"
import LoadingAnimation from "../Loading-animation"
import axios from "axios"
import { useAuth } from "../context"
import { BACKEND_URL } from "../const"
import DatePicker from "react-datepicker"
import ArrowTo from "../arrowTo"

export function EditElem(){

    const {id} =  useParams()

    const {token} = useAuth()
    const navigate = useNavigate()

    const [loadingData, setLoadingData] = useState(true)
    const [subscription, setSubscription] = useState({})

    useEffect(() => {
        console.log(id)

        if(token == null){
            navigate("/")
        }

        axios({method: "get", url: `${BACKEND_URL}/api/${id}`, headers:{"Authorization": `Bearer ${token}`}})
        .then((res) => {
            console.log(res.data)
            setLoadingData(false)
            setSubscription(res.data.subscription)
            
        })
        .catch((err) => {
            console.log(err)
            setLoadingData(false)
        })

    },[])

    return(
        
        <div className="edit-form-container">
            <h2 className="edit-title">Edit subscription</h2>
            <ArrowTo urlValue={"/dashboard"} />
            
            
            {loadingData && 
                <LoadingAnimation />
            }
            {(loadingData == false && subscription.title === undefined) &&
                <span className="no-data-msg">subscription with this id doesn't exist</span>
            }
            {(loadingData == false && subscription.title !== undefined) &&
                <EditForm subscription={subscription}/>
            }
        
        </div>
    )
}

function EditForm({subscription}){

    const navigate = useNavigate()
    const {token} = useAuth()

    const [loadingData, setLoadingData] = useState(false)

    const [selectedDate, setSelectedDate] = useState(new Date(subscription.remind_date))
    const [delete_after, set_delete_after] = useState(subscription.delete_after)
    const [again_after, set_again_after] = useState(subscription.remind_again)
    const [title, setTitle] = useState(subscription.title)
    const [message, setMessage] = useState(subscription.message)

    function DateCahnge(e){
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
    
    function EditFormSubmit(e){
        e.preventDefault()
        
        setLoadingData(true)

        const payload = {
            title: title,
            message: message,
            remind_again: again_after,
            delete_after: delete_after,
            remind_date: selectedDate.getTime()
        }


        axios({method: "post", data: payload, url: `${BACKEND_URL}/api/edit/${subscription._id}`, headers:{"Authorization": `Bearer ${token}`} })
        .then((res) => {
            setLoadingData(false)
            navigate("/dashboard")
        })
        .catch((err) => {
            setLoadingData(false)
            console.log(err)
        })

    }

    return(
        <form className="edit-form" onSubmit={EditFormSubmit}>
                <span>Title</span>
                <input type="text" id="title" name="title" defaultValue={subscription.title} onChange={(e) => {setTitle(e.target.value)}} required/>
                
                <span>Message</span>
                <textarea className="message-area" name="message" id="message" defaultValue={subscription.message} onChange={(e) => {setMessage(e.target.value)}} required></textarea>
                
                <span>Remind Date</span>
                <DatePicker 
                    selected={selectedDate} 
                    onChange={DateCahnge}
                    showTimeSelect 
                    dateFormat={"Pp"} 
                    timeFormat={"p"}
                />

                <div className="radio-button-container">
                    <input defaultChecked={subscription.remind_again} type="radio" name="after_notification" value={"again_after"} id="again_after" onChange={RadioButtonChange} required/>
                    <label className="radio_button_label" htmlFor="again_after">Remind again after 30 days</label>
                </div>
                <div className="radio-button-container last-radio-container">
                    <input defaultChecked={subscription.delete_after} type="radio" name="after_notification" value={"delete_after"} id="delete_after" onChange={RadioButtonChange} required/>
                    <label className="radio_button_label" htmlFor="delete_after">Delete after</label>
                </div>

                {loadingData == true &&
                
                    <button disabled type="submit"><LoadingAnimation /></button> 
                }

                {loadingData == false &&
                
                    <button type="submit">Save</button> 
                }

            </form>
    )
}