import React, {useState, useEffect} from 'react';


export function CheckBoxElement(props) {

    let resultCheck = props.isChecked;
    let [isChecked, setIsChecked] = useState(resultCheck);

    let manageChange = () => {
        if(isChecked){
            setIsChecked(false);
        }else{
            setIsChecked(true);
        }
    }

    let isImageExists = () => {

        if(props.picture.length > 0){
            return props.picture
        }else{
            return "https://static.thenounproject.com/png/340719-200.png"
        }

    }

    return(
        <tr id={props.id+"div"} style={styleTab}>
            <td><input type="checkbox" id={props.id} name={props.nameElement} onChange={manageChange} checked={isChecked}/></td>
            <td style={styleLigne}><label htmlFor={props.id} id={"label"}>{props.nameElement}</label></td>
            <td><img src={isImageExists()} style={styleImg}/></td>
        </tr>
    )
}

const styleImg = {
    width : "35px",
    height : "35px",
}

const styleTab = {
    borderBottom : "1px solid",
}

const styleLigne = {
    paddingRight : "200px"
}