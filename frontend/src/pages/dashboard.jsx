import { useEffect, useState } from "react";
import { useAuth } from "../context";
import "../styles/dashboard.css"
import axios from "axios";
import { BACKEND_URL, PUBLIC_KEY } from "../const";
import { NavLink, useNavigate } from "react-router-dom";


export function DashboardElem(){

    const navigate = useNavigate()
    const {token, setToken} = useAuth()

    const [subscriptions, setSubscriptions] = useState([])
    const [dataFetched, setDataFetched] = useState(false)
    function LogoutToRoot(){
        setToken()
        navigate("/")
    }

    const [supportsPush, setSupportsPush] = useState(false)

    //TODO: this makes 2 requests for some reason.
     
    useEffect(() => {

        if ('PushManager' in window) {

            setSupportsPush(true)
            
            Notification.requestPermission()
            .then(function(permission) {
                console.log(permission)
            });
        } 
        else {
            setSupportsPush(false)
        }

        console.log(token)
        axios({ method: "get", url: `${BACKEND_URL}/api/subscriptions`, headers:{"Authorization": `Bearer ${token}` }})
        .then((response) => {
            console.log(response.data)
            setSubscriptions(response.data)
            setDataFetched(true)
            if(response.status == 401){
                LogoutToRoot()
            }
        })
        .catch((err) => {
            if(err.status == 401){
                LogoutToRoot()
            }
        })

    },[])

    return(
        <>
            <div className="dashboard-container">
                <h1>Dashboard</h1>
                <NavLink className='btn'  to={{pathname: "/add"}}>Add Reminder</NavLink>
                <h2>My Subscriptions</h2>
                <div className="subscription-list-container">
                    
                    {subscriptions.length > 0 && 
                        //data fetched 
                        subscriptions.map((subscription) => {
                            return <SubscriptionCard key={subscription._id} subscription={subscription}/>
                        })
                    }

                    {dataFetched == false &&
                        //still fetching data 
                        <div class="loader-container">
                        <div class="loading-dot"></div>
                        <div class="loading-dot"></div>
                        <div class="loading-dot"></div>
                        </div>
                    }

                    {(dataFetched && subscriptions.length < 1) && 
                        //No subscriptions
                        <span>No Subscriptions</span>
                    }
                    
                    {supportsPush == false &&
                        <span>This browser doesn't support push notifications</span>
                    }

                </div>
            </div>
        </>
    )
}


function SubscriptionCard({subscription}){

    const {token} = useAuth()

    const [remindButtonText, setRemindButtonText] = useState("Remind")
    const [disableButton, setDisableButton] = useState(false)
    const [removeEvent, setRemoveEvent] = useState(false)


    useEffect(() => {
        if(subscription.notification){
            setRemindButtonText("Remove Reminder")
            setRemoveEvent(true)
        }
    },[])

    // https://www.npmjs.com/package/web-push
    function urlBase64ToUint8Array(base64String) {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
        const rawData = window.atob(base64);
        return new Uint8Array([...rawData].map(char => char.charCodeAt(0)));
    }

    async function GetNotificationPush(){ // push contains the enpoint and other stuff that is needed to send notification

        try{
            const existingSW = await navigator.serviceWorker.getRegistration("/sw.js")
    
            if(existingSW){
                console.log("service worker already exists")
                await existingSW.unregister()
            }
            const register = await navigator.serviceWorker.register("/sw.js")
            const push = await register.pushManager.subscribe({ 
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(PUBLIC_KEY)
            })
            return push
        }
        catch(err){
            console.log(err)
            setDisableButton(true)
            setRemindButtonText("SSL Err")
            return null
        }
    }

    async function RemindClick(event){
        //TODO subscripe to notification
        setDisableButton(true)
        const push = await GetNotificationPush()

        if(push == null){
            return;
        }

        console.log(push)
        axios({method: "post", url: `${BACKEND_URL}/api/notification`, data: {push: push, sub_id: subscription._id, remind_date: subscription.remind_date },  headers:{"Authorization": `Bearer ${token}` }})
        .then(res => {
            setDisableButton(false)
            setRemoveEvent(true)
            setRemindButtonText("Remove Reminder")
        })
        .catch(err => {
            setDisableButton(false)
            console.log(err)
        })
        
    }
    
    async function RemoveReminder(event){
        setDisableButton(true)
        
        axios({method: "delete", url: `${BACKEND_URL}/api/notification/${subscription._id}`, headers:{"Authorization": `Bearer ${token}` }})
        .then((res) => {
            console.log(res)
            setRemoveEvent(false)
            setRemindButtonText("Remind")
            setDisableButton(false)
        })
        .catch((err) => {
            setDisableButton(false)
            console.log(err)
        })
    }

    return(

        <div className="subscription-card">
            <span className="subscription-card-title">{subscription.title}</span>
            <span className="subscription-card-message">{subscription.message}</span>
            <span className="subscription-card-date">{new Date(subscription.remind_date).toLocaleDateString("en-FI") }</span>

                {subscription.remind_again &&
                    <span className="subscription-card-after">
                        Remind again after 30 days
                    </span>
                }
                {subscription.delete_after &&
                    <span className="subscription-card-after">
                        Deleted after remind
                    </span>
                }

            <div className="subscription-card-button-container">
                <DeleteSubButton sub_id={subscription._id} />
                <NavLink to={{pathname: `/edit/${subscription._id}`}} className="btn btn-remind">Edit</NavLink>
                {removeEvent == false &&
                    <button disabled={disableButton} className="btn" onClick={RemindClick}>{remindButtonText}</button>
                }
                {removeEvent == true &&
                    <button disabled={disableButton} className="btn" onClick={RemoveReminder}>{remindButtonText}</button>
                }
            </div>
        </div>

    )
}

function DeleteSubButton({sub_id}){

    const navigate = useNavigate()
    const {token} = useAuth()

    function DeleteClick(e){
        e.target.disabled = true

        const answer = confirm("Do you want to delete this Subscription.")
        console.log(answer)
        if(answer == false){
            e.target.disabled = false
            return
        }

        axios({method: "delete", url: `${BACKEND_URL}/api/${sub_id}`,  headers:{"Authorization": `Bearer ${token}` }})
        .then((res) => {
            navigate("/dashboard")
            window.location.reload()
        })
        .catch((err) => {

        })

    }


    return(

        <button onClick={DeleteClick} className="btn btn-delete">Delete</button>

    )

}