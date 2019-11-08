import React from "react";
import {useAuth0} from "../react-auth0-spa";
import NavLink from "reactstrap/lib/NavLink";

//returns a logout button, or an empty button if user is logged in
export default function LogoutButton(){
    let usr = useAuth0();
    if(usr.isAuthenticated){
        return <NavLink onClick={() => {usr.logout({returnTo: window.location.origin})}} href="#">Logout</NavLink>
    }
    return <NavLink/>
}