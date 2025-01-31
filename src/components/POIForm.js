import React from 'react';
import { Formik } from 'formik';
import './POIForm.css';
import endpoints from "../endpoints";
import {useAuth0} from "../react-auth0-spa";
import {Button} from "reactstrap";
import {useHistory} from "react-router-dom";
import request from "../utils/request";
import LoadingSpinner from "./LoadingSpinner";

function POIForm(props){

    let { loginWithRedirect, getTokenSilently } = useAuth0();
    let url = window.location.href;
    let history = useHistory();

    let currentId = url.substring(url.lastIndexOf("/")+1);

    //Checks if poi is new or editable
    let newOrEditable = () => {
        if(props.isNew){
            return false;
        }else{
            return !(props.isEdit);
        }
    };

    let img;

    if(props.thisPoi.image){
        img = <img style={{maxHeight: "100%", maxWidth: "100%", float: "right"}} src={props.thisPoi.image} alt=""/>
    }else{
        img = <img style={{maxHeight: "100%", maxWidth: "100%", float: "right"}}
                   src={"https://www.groupeiam.com/wp-content/plugins/post-grid/assets/frontend/css/images/placeholder.png"} alt=""/>
    }

    return(
      <div className='detail-div'>
          <div className='img-div'>
              {img}
              <br/>
          </div>

          <div className='detail-content'>
              {props.newPoi ? (
              <Formik
                  enableReinitialize
                initialValues={{    name: props.newPoi.name,
                                    description: props.newPoi.description,
                                    lat: props.newPoi.lat,
                                    lng: props.newPoi.lng,
                                    image: props.newPoi.image,
                                    url: props.newPoi.url,
                                    group: props.newPoi.group}}
                validate={values => {
                    let errors = {};
                    {/*Check required name*/}
                    if (!values.name) {
                        errors.name = 'Required';
                    }
                    return errors;
                }}
                onSubmit={(values, { setSubmitting }) => {
                    setTimeout(async() => {
                        setSubmitting(false);

                        if(props.isNew){
                            let response = await request(
                                "POST",
                                `${process.env.REACT_APP_SERVER_URL}${endpoints.pois}`,
                                getTokenSilently,
                                loginWithRedirect,
                                values
                            );
                            console.log(response);
                            console.log(response.id);
                            currentId = response.id ;
                            props.setCurrentId(currentId);
                            props.setIsClicked(false);
                            history.push("/details/" + currentId);
                        }else{
                            props.editPoi(values);
                            props.setValueButtonEdit("Edit");
                        }
                    }, 400);
                }}
                render={({
                             values,
                             errors,
                             touched,
                             handleChange,
                             handleBlur,
                             handleSubmit,
                             isSubmitting,
                             /* and other goodies */
                         }) => (
                  <form onSubmit={handleSubmit}>
                      <span><h4>Name : </h4></span>
                      <input
                        disabled={newOrEditable()}
                        type="text"
                        name="name"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.name}
                      />
                      <span><h4>Latitude : </h4></span>
                      <input
                        disabled={newOrEditable() || props.isClicked}
                        type="text"
                        name="lat"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.lat}
                      />
                      <span><h4>Longitude : </h4></span>
                      <input
                        disabled={newOrEditable() || props.isClicked}
                        type="text"
                        name="lng"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.lng}
                      />
                      {errors.name && touched.name && errors.name}
                      <span><h4>Description: </h4></span>
                      <textarea
                        disabled={newOrEditable()}
                        name="description"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.description}
                      />
                      {errors.description && touched.description && errors.description}
                      <span><h4>Website: </h4></span>
                      <input
                        disabled={newOrEditable()}
                        type="url"
                        name="url"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.url}
                      />
                      {errors.url && touched.url && errors.url}
                      <span><h4>Image: </h4></span>
                      <input
                        disabled={newOrEditable()}
                        type="url"
                        name="image"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.image}
                      />
                      {errors.image && touched.image && errors.image}
                      {!props.isNew &&
                      <div>
                          Created at <b>{props.thisPoi.createdAt}</b> by {props.thisPoi.Creator &&
                      <b>{props.thisPoi.Creator.name}</b>} (Group {props.thisPoi.group})
                          <div>Updated at <b>{props.thisPoi.updatedAt}</b></div>
                      </div>
                      }

                      {errors.url && touched.url && errors.url}
                      {props.thisPoi && props.thisPoi.Status && (
                          <span>
                                        <h4>Current Status: {props.thisPoi.Status.name}</h4>
                                    </span>
                      )}

                      {props.thisPoi && !props.thisPoi.Status && (
                          <span>
                                        <h4>Current Status: Not defined</h4>
                                    </span>
                      )}

                      {(props.isEdit || props.isNew) &&
                      <Button style={{backgroundColor: 'darkgreen', display: "inline-block", marginTop: '10px'}}
                              type="submit" disabled={isSubmitting}
                      >
                          Submit
                      </Button>
                      }

                  </form>
                )}
              >
              </Formik>) : (<LoadingSpinner/>)}
          </div>
      </div>
    )
}



export default POIForm