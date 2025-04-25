import { useEffect, useState } from 'react'
import { Outlet,Link, useNavigate } from 'react-router-dom'
import "./styles/Frame.css"
import { useAuth } from './context'

function HeaderElem(){

  const {token, setToken} = useAuth()
  const navigate = useNavigate()

  const [loggedIn, setLoggedIn] = useState(false)

  function LogoutClick(e){
    setToken()
    setLoggedIn(false)
    navigate("/")
  }

  useEffect(() =>{
    if(token){
      setLoggedIn(true)
    }
  },[token])


  return(
    <header>
      <div className="header-left-side">
        <img src="/icon.svg" alt="" className='header-icon'/>
        <span className='header-site-name'>
          Subscription Reminder
        </span>
      </div>

      {loggedIn == false && 
        <div className="auth-container">
          <Link to={{pathname: "/"}} className=' auth-button login-button'>Login</Link>
          <Link to={{pathname: "/Register"}} className=' auth-button register-button'>Register</Link>
        </div>  
      }


      {loggedIn &&
        <div className="auth-container">
          <button onClick={LogoutClick} className=' auth-button logout-button'>Logout</button>
        </div>
      }
    </header>
  )
}

function FrameElem() {

  return (
    <>
      <HeaderElem/>
      <main>
        <Outlet />
      </main>
    </>
  )
}



export default FrameElem
