import React from "react";
import {Marker, Popup} from "react-leaflet";
import Button from "reactstrap/es/Button";
import './Popup.css';
import { useHistory } from "react-router-dom";

export default function MarkerList(props){

    let pois = props.pois;

    return(
        <>
            {/*for each POI we create a marker*/}
            {pois && pois.length > 0 && (
                <>
                    {pois.map(poi => (
                        <MyMarker
                            usr={props.user}
                            key={poi.id}
                            lastPoiId={props.lastPoi} poi={poi}></MyMarker>
                    ))}
                </>

            )}
        </>

    );

}

class MyMarker extends React.Component{


    constructor(props){
        super(props);
        this.hRef = React.createRef();
    }

    componentDidUpdate(): void {
        if (this.props.poi.id === this.props.lastPoiId) {
            this.leafletPopup.leafletElement.openPopup();
        }
    }



    //Design the Popup, above the selected Marker
    render(){

        let isHisPoi = () => {
            if(this.props.usr.user.sub === this.props.poi.Creator.id){
                return true
            }else{
                return false
            }
        }

        return (
        <>
            <Marker ref={m => { this.leafletPopup = m; }} position={[this.props.poi.lat, this.props.poi.lng]}>
                <Popup className="popup">
                    <div className="informations-popup">
                        <h3>
                           {this.props.poi.name}
                        </h3>
                        {this.props.poi.description}
                    </div>
                    <div className='img-popup'>
                        <img style={{maxHeight: "100%", maxWidth: "100%"}} src={this.props.poi.image} alt="POI image"/><br/>
                    </div>
                    <Button className="button-popup" oncklick={this.poiDetails}>
                        <a className="link-popup" href={"details/"+this.props.poi.id}>
                            Details
                        </a>
                    </Button>
                    {isHisPoi() &&
                    <Button className="button-popup">Edit</Button>
                    }

                </Popup>
            </Marker>
        </>
    )
}
};