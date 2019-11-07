import React, {useState, useEffect, Dialog} from "react";
import POIForm from "./POIForm";
import BoxCategories from "./BoxCategories";
import BoxTags from "./BoxTags";
import {Button} from 'reactstrap';
import {useAuth0} from "../react-auth0-spa";
import request from "../utils/request";
import endpoints from "../endpoints";
import DeleteModal from "./DeleteModal";
import {Link, useHistory} from "react-router-dom";
import PreviewMap from "./PreviewMap";
import "./Details.css";
import LikesBox from "./LikesBox";

export default function Details(props){

    let url = window.location.href;
    let positionLastSlash = url.lastIndexOf('/');
    let param = url.substring(positionLastSlash+1);
    let history = useHistory();
    let [poi, setPoi] = useState(0)
    let { loginWithRedirect, getTokenSilently } = useAuth0();
    let [isLoaded, setIsLoaded] = useState(false);
    let currentUser = useAuth0().user;
    let poiCreator = poi.Creator;
    let [isEdit, setIsEdit] = useState(false);
    let [valueButtonEdit, setValueButtonEdit] = useState("Edit");
    let [newPOI, setNewPOI] = useState(null);
    let [isNew, setIsNew] = useState(true);
    let currentId = url.substring(url.lastIndexOf("/")+1);
    let [isClicked, setIsClicked] = useState(false);
    let [categories, setCategories] = useState([]);
    let [tags, setTags] = useState([]);
    let [isPosEdited, setIsPosEdited] = useState(false);
    let [isPopupOpen, setIsPopupOpen] = useState(false);
    let [isChangeCategoriesTags, setIsChangeCategoriesTags] = useState(false);
    let [isChangeLike, setIsChangeLike] = useState(false)
    let [isLiked, setIsLiked] = useState(false);

    //Status
    let [status, setStatus] = useState([]);
    let [test, setTest] = useState(1);

    useEffect(() => {
        let myPoi = request(
            "GET",
            `${process.env.REACT_APP_SERVER_URL}${endpoints.pois}${'/'+param}`,
            getTokenSilently,
            loginWithRedirect,
            setIsLoaded(true)
        ).then(token => {setPoi(token)} );
        setIsChangeCategoriesTags(false);
        setIsChangeLike(false);
    }, [isChangeCategoriesTags, isChangeLike, isPosEdited, currentId]);

    useEffect( () => {

        if(props.posClicked != null && !isNaN(currentId)){
            setIsClicked(true);
            defaultPOI.lat = props.posClicked.lat;
            defaultPOI.lng = props.posClicked.lng;
        }else{
            setIsClicked(false);
        }

        if(props.isEditMarker !== null){
            setIsEdit(props.isEditMarker);
            props.setIsEditMarker(null);
            setValueButtonEdit("Close edit mode");
        }

        console.log(currentId);
        if(currentId === ""){
            //No id means new Poi
            console.log("New POI");
            setIsNew(true);
            setNewPOI(defaultPOI);
        }else if(isNaN(currentId)){
            //if not a number, it means new poi
            console.log("NaN is returned");
            setIsNew(true);
            setNewPOI(defaultPOI);
        }else{
            //The poi should exist and will be fetched (if error, then we catch it below)
            setIsNew(false);
            setNewPOI(props.poi);
            if(poi.error){
                //The server responds with an error, thus set isNew and default poi
                setIsNew(true);
                setNewPOI(defaultPOI)
            }else{
                setNewPOI(poi);
            }
        }
    }, [currentId, poi]);

    //default values for new poi
    let defaultPOI = {
        name: '',
        description:'',
        lat:'',
        lng:'',
        image: '',
        url:'',
        group: 3,
        Creator: null
    }

    let onClickEditButton = () => {
        if(isEdit){
            setIsEdit(false);
            setValueButtonEdit("Edit")
        }else{
            setIsEdit(true);
            setValueButtonEdit("Close edit mode")
        }
    };

    let setCurrentId = (newId) => {
        currentId = newId;
    };

    //Delete the current poi (only avaliable if the user is the creator)
    let deletePoi = async () => {
        let response = await request(
            "DELETE",
            `${process.env.REACT_APP_SERVER_URL}${endpoints.pois}${currentId}`,
            getTokenSilently,
            loginWithRedirect,
            null
        );
        console.log(response);
        currentId = 0;
        history.push("/home");
    };

    let editPoi = async (values) => {
        let response = await request(
            "PATCH",
            `${process.env.REACT_APP_SERVER_URL}${endpoints.pois}${currentId}`,
            getTokenSilently,
            loginWithRedirect,
            values
        );
        if(response){
            setIsPosEdited(!isPosEdited);
        }
        setIsEdit(false);
    };

    useEffect(() => {
        fetchCategoriesAndTags();
    }, [currentId]);

    let onChangeCategoriesTag = (value) => setIsChangeCategoriesTags(value);
    let onChangeLike = (value) => setIsChangeLike(value);

    // get all the POI informations
    let fetchCategoriesAndTags = async () => {

        //category part
        let responseCat = await request(
            "GET",
            `${process.env.REACT_APP_SERVER_URL}${endpoints.categories}`,
            getTokenSilently,
            loginWithRedirect,
            null
        );

        if (responseCat && responseCat.length > 0) {
            setCategories(responseCat);
        }

        //tags part
        let responseTag = await request(
            "GET",
            `${process.env.REACT_APP_SERVER_URL}${endpoints.tags}`,
            getTokenSilently,
            loginWithRedirect,
            null
        );

        if (responseTag && responseTag.length > 0) {
            setTags(responseTag);
        }

        let responseStat = await request(
            "GET",
            `${process.env.REACT_APP_SERVER_URL}${endpoints.status}`,
            getTokenSilently,
            loginWithRedirect,
            null
        );

        if (responseStat && responseStat.length > 0) {
            setStatus(responseStat);
        }

        return;
    };

        return(
            <div>
                <table>
                    <tr>
                        <td className={'TabLine'}>
                            {!isNew &&
                            <h1>{poi.name}</h1>
                            }
                        </td>
                        <td className={'TabLine'}>
                            {!isEdit && !isNew &&
                            <LikesBox id={'likeBox'} thisPoi={poi} onChangeLike={onChangeLike} classNmae={'headerDetail'}/>
                            }
                        </td>
                    </tr>
                </table>


                {(poiCreator && currentUser.sub === poiCreator.id) &&
                <div className='div-button'>
                    <Link to='/' className='back-button' style={{verticalAlign: 'bottom'}}>Back</Link><span> </span>
                    <Button onClick={onClickEditButton} style={{marginTop: '10px'}}>{valueButtonEdit}</Button>
                    <span> </span>
                    {!isNew && poi.Creator &&
                    (currentUser.sub === poi.Creator.id) &&
                    <DeleteModal
                        buttonLabel={"POI"}
                        currentName={poi.name}
                        className='delete-modal'
                        deleteClicked={deletePoi}/>
                    }
                </div>}

                <div>
                    {status && (
                        <span className="status">
                            <small>{status.name}</small>
                        </span>
                    )}
                </div>

                <POIForm thisPoi={poi} isEdit={isEdit} setIsEdit={setIsEdit} newPoi={newPOI}
                         currentId={currentId} setCurrentId={setCurrentId} isNew={isNew} isClicked={isClicked}
                         setIsClicked={setIsClicked}
                         setValueButtonEdit={setValueButtonEdit} editPoi={editPoi}/>

                {!isEdit && !isNew &&
                <div className="div-box-and-map">
                    <div style={{textAlign: 'left'}}>
                        <Link to='/' className='back-button' style={{verticalAlign: 'bottom', paddingLeft: '20px'}}>Back</Link>
                    </div>
                    <div className="div-box">
                        <BoxCategories thisPoi={poi} currentId={currentId} currentUser={currentUser} allCategories={categories} onChangeC={onChangeCategoriesTag}/>
                        <BoxTags thisPoi={poi} currentUser={currentUser} currentUser={currentUser} allTags={tags} onChangeT={onChangeCategoriesTag}/>
                    </div>
                    {/*Preview map*/}
                    {poi.lat && poi.lng &&
                    <div className="div-preview-map">
                        <PreviewMap lat={poi.lat} lng={poi.lng} editPoi={editPoi}/>
                    </div>

                    }

                </div>}

            </div>
        );

}