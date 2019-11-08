import React from "react";
import endpoints from "../endpoints";
import {useAuth0} from "../react-auth0-spa";
import "../layouts/Details.css"
import request from "../utils/request";
import {Button} from 'reactstrap';

export default function LikesBox(props){

    let { loginWithRedirect, getTokenSilently } = useAuth0();
    const verifyID = 1;
    const inProgressID = 2;
    const unverifyID = 3;

    let verify = () => {
        updateStatus(verifyID);
        props.onChangeState(true);
    };

    let inprogress = () => {
        updateStatus(inProgressID);
        props.onChangeState(true);
    };

    let unverify = () => {
        updateStatus(unverifyID);
        props.onChangeState(true);
    };

    let updateStatus = async stateID => {
        let response = request(
            "PATCH",
            `${process.env.REACT_APP_SERVER_URL}${endpoints.pois}${props.thisPoi.id}${endpoints.status}`,
            getTokenSilently,
            loginWithRedirect,
            stateID
        ).then(token => (console.log(token)));
    };

    return(
        <div>
            <Button onClick={verify} style={{marginRight: '7px'}}>Not Verified</Button>
            <Button onClick={unverify} style={{marginRight: '7px'}}>Verify</Button>
            <Button onClick={inprogress} style={{marginRight: '7px'}}>In Progress</Button>
        </div>
    )

}

const styleImg = {
    weight : "50px",
    height : "50px",
    float : "right",
};