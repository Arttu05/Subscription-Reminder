import "../styles/login.css"
import "../styles/loading-animation.css"
import { NavLink, useNavigate, useParams, useSearchParams } from "react-router-dom"
import { useAuth } from "../context"
import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../const";

export default function LoginCard(){
    
    const [searchParams] = useSearchParams()
    const { setToken, token } = useAuth();  
    const navigate = useNavigate()

    const [username, setUsername] = useState()
    const [password, setPassword] = useState()

    const [showCreatedMsg, setShowCreatedMsg] = useState(searchParams.has("msg","created"))
    const [loginErr, setLoginErr] = useState(false)

    const [waitingForResponse, setWaitingForResponse] = useState(false)


    useEffect(() => {
    
        if(token){
            navigate("/dashboard")
        }

        
    },[]) 
    
    function HandleSubmit(event){
        event.preventDefault()

        setWaitingForResponse(true)
        setShowCreatedMsg(false)
        setLoginErr(false)

        axios({method: 'post', url: `${BACKEND_URL}/auth/login`, data: {username: username, password: password}})
        .then((response) => {
            setWaitingForResponse(false)
            console.log(response.status)
            if(response.status == 401){
                setLoginErr(true)
                return
            }

            console.log(response.data.accessToken)

            setToken(response.data.accessToken)

            navigate("/dashboard")

        })
        .catch((err) => {
            setLoginErr(true)
            setWaitingForResponse(false)
        })
    }

    return(
        <div className="login-card">
            
            { showCreatedMsg && 
                <div className="created-msg">
                    <span className="created-msg-text">
                        User was created
                    </span>
                </div> 
            }

            <form action="192.168.100.33:5001/auth/login" method="post" onSubmit={HandleSubmit}>
                <span>Username</span>
                <input type="text" onChange={(e) => { setUsername(e.target.value) }}/>
                <span>Password</span>
                <input type="password" onChange={(e) => { setPassword(e.target.value) }}/>
                { waitingForResponse && 
                    <button type="submit" disabled > 
                    {/* Loading animation */}
                    <div class="loader-container">
                        <div class="loading-dot"></div>
                        <div class="loading-dot"></div>
                        <div class="loading-dot"></div>
                    </div>

                    </button>
                }
                { waitingForResponse == false && 
                    <button type="submit" >Login</button>
                }    
            </form>


            {loginErr && 
                <div className="error-message">
                    <span className="error-message-text">username or password incorrect</span>
                </div>
            }
            
            <NavLink to={{pathname: "/register"}} >Don't have account, create one here!</NavLink>

        </div>
    )
}