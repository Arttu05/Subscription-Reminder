import { NavLink } from "react-router-dom"
import "./styles/arrow-to.css"

export default function ArrowTo({urlValue}){

    return(
        <NavLink to={{pathname: urlValue}} className={"arrow-to"}>
            <div className="arrow"></div> Dashboard
        </NavLink>
    )

}