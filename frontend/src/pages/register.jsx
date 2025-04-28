import axios from "axios"
import "../styles/register.css"
import { useNavigate, useSearchParams } from 'react-router-dom'
import { BACKEND_URL } from "../const"
import { useEffect, useState } from "react"
import { useAuth } from "../context"
import LoadingAnimation from "../Loading-animation"

export default function RegisterCard(){

    const navigate = useNavigate()

    const [searchParams] = useSearchParams()
    const [username, setUsername]  = useState()
    const [password, setPassword]  = useState()
    const [confirmPassword, setConfirmPassword]  = useState()

    //error msg hooks
    const [matchErr, setMatchErr] = useState(false)
    const [existsErr, setExistsErr] = useState(false)

    const [waitingForResponse, setWaitingForResponse] = useState(false)

    const {token} = useAuth()
    console.log(token)

    useEffect(() => {
        
        if(token){
            navigate("/dashboard")
        }

        
    },[]) 


    function HandleSubmit(event){
        event.preventDefault()
        console.log(confirmPassword)
        console.log(password)

        
        if(confirmPassword !== password){
            setMatchErr(true);
            return
        }
        
        setWaitingForResponse(true)
        axios({method: 'post', url: `${BACKEND_URL}/auth/register`, data:{username: username, password: password }})
        .then((value) => {
            console.log(value)
            
            setWaitingForResponse(false)
            if(value.status == 200){
                // TODO redirect to login
                console.log("200")
                navigate("/?msg=created")
            }
            else if(value.status == 409){
                setExistsErr(true)
            }
        })
        .catch((err) => {
            console.log(err)
            setWaitingForResponse(false)
        })
    }

    return(
        <div className="register-card" >
            <form /* action="http://192.168.100.33:5001/auth/register" method="post" */ onSubmit={HandleSubmit}> 
                <span>Username</span>
                <input type="text" name="username" onChange={(e) => {setUsername(e.target.value)}} />
                <span>Password</span>
                <input type="password" name="password" onChange={(e) => {setPassword(e.target.value)}} />
                <span>Confirm Password</span>
                <input type="password" name="confirmpassword" onChange={(e) => {setConfirmPassword(e.target.value)}} />

                {waitingForResponse == true && 
                    <button disabled type="submit"><LoadingAnimation /></button>
                }

                {waitingForResponse == false && 
                    <button type="submit">Register</button>
                }

            </form>


            {existsErr === true && 
                <div className="error-message">
                    <span className="error-message-text">Username already in use</span>
                </div>
            }
            {matchErr === true && 
                <div className="error-message">
                    <span className="error-message-text">passwords don't match</span>
                </div>
            }

        </div>
    )
}