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

    function LogoutToRoot(){
        setToken()
        navigate("/")
    }

    //TODO: this makes 2 requests for some reason.
     
    useEffect(() => {
        console.log(token)
        axios({ method: "get", url: `${BACKEND_URL}/api/subscriptions`, headers:{"Authorization": `Bearer ${token}` }})
        .then((response) => {
            console.log(response.data)
            setSubscriptions(response.data)
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
                <NavLink className='dashboard-button'  to={{pathname: "/add"}}>Add Reminder</NavLink>
                <h2>My Subscriptions</h2>
                <div className="subscription-list-container">
                    {subscriptions.length > 0 && 
                        subscriptions.map((subscription) => {
                            return <SubscriptionCard subscription={subscription}/>
                        })
                    }
                    {subscriptions.length === 0 &&
                        <div class="loader-container">
                            <div class="loading-dot"></div>
                            <div class="loading-dot"></div>
                            <div class="loading-dot"></div>
                        </div>
                    }
                </div>
            </div>
        </>
    )
}


function SubscriptionCard({subscription}){

    const {token} = useAuth()

    // https://www.npmjs.com/package/web-push
    function urlBase64ToUint8Array(base64String) {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
        const rawData = window.atob(base64);
        return new Uint8Array([...rawData].map(char => char.charCodeAt(0)));
    }

    async function GetNotificationPush(){ // push contains the enpoint and other stuff that is needed to send notification

        const existingSW = await navigator.serviceWorker.getRegistration("/sw.js")

        if(existingSW){
            console.log("service worker already exists")
            return await existingSW.pushManager.getSubscription()
        }
        else{
            console.log("service worker doesn't exists")
            const register = await navigator.serviceWorker.register("/sw.js")
            const push = await register.pushManager.subscribe({ 
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(PUBLIC_KEY)
            })
            return push
        }

    }

    async function RemindClick(){
        //TODO subscripe to notification
        const push = await GetNotificationPush()
        console.log(push)
        axios({method: "post", url: `${BACKEND_URL}/api/notification`, data: {push: push, sub_id: subscription._id, remind_date: subscription.remind_date },  headers:{"Authorization": `Bearer ${token}` }})
        .then(res => {
            console.log("done")
        })
        .catch(err => {
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
                <button className="dashboard-button">Edit</button>
                <button className="dashboard-button" onClick={RemindClick}>Remind</button>
            </div>
        </div>

    )
}

