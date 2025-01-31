import React from "react";
import endpoints from "../endpoints";
import {useAuth0} from "../react-auth0-spa";
import "../layouts/Details.css"
import request from "../utils/request";

export default function LikesBox(props){

    let { loginWithRedirect, getTokenSilently } = useAuth0();
    let poi = props.thisPoi;
    let button;

    let onClickButton = () => {

        if(props.thisPoi.liked){
            saveUnlike();
        }else{
            saveLike();
        }
        props.onChangeLike(true);
    };

    let saveLike = async () => {
        let response = request(
            "PATCH",
            `${process.env.REACT_APP_SERVER_URL}${endpoints.pois}${props.thisPoi.id}${endpoints.like}`,
            getTokenSilently,
            loginWithRedirect
        ).then(token => (console.log(token)));
    };

    let saveUnlike = async () => {
        let response = request(
            "PATCH",
            `${process.env.REACT_APP_SERVER_URL}${endpoints.pois}${props.thisPoi.id}${endpoints.unlike}`,
            getTokenSilently,
            loginWithRedirect
        ).then((token) => (console.log(token)));
    };

    if(poi.liked){
        button = <img style={styleImg} onClick={onClickButton} id={"btnLike"} src={"https://image.flaticon.com/icons/svg/148/148836.svg"} alt={"liked"}/>
    }else{
        button = <img style={styleImg} onClick={onClickButton} id={"btnLike"} src={"https://image.flaticon.com/icons/svg/149/149217.svg"} alt={"unliked"}/>
    }

    return(
        <div id={'headerDetail'}>
            <label style={{fontSize : "35px"}}>{poi.likes}</label>{button}
        </div>
    )

}

const styleImg = {
    weight : "50px",
    height : "50px",
    float : "right",
};