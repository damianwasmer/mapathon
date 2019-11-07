import React from "react";
import {useAuth0} from "../react-auth0-spa";
import NavLink from "reactstrap/lib/NavLink";
import "./LoginButton.css";

export default function LoginButton(){

    //returns the login button according to the user's state
    let usr = useAuth0();
    if(usr.isAuthenticated){
        return (
            <NavLink>Welcome {usr.user.name}</NavLink>
        );
    }
    else{
        return <NavLink onClick={usr.loginWithRedirect} href="#">login</NavLink>;
    }



}