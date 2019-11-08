import React, { useState } from "react";
import "./App.css";
import { useAuth0 } from "./react-auth0-spa";
import request from "./utils/request";
import endpoints from "./endpoints";
import Loading from "./components/Loading";
import POI from "./components/POI";
import CustomNavbar from "./components/Navbar";
import { BrowserRouter as Router, Switch, Route} from "react-router-dom";
import About from "./layouts/About";
import HelpPage from "./layouts/Help";
import Home from "./layouts/Home";
import FooterSection from "./components/Footer";
import Details from "./layouts/Details";
import ManagePage from "./layouts/ManagePage";
import EditCategory from "./layouts/EditCategory";
import EditTag from "./layouts/EditTag";

//app component main
function App(props) {

    let [posClicked, setPosClicked] = useState(null);
    let [isEditMarker, setIsEditMarker] = useState(null);
    let { loading } = useAuth0();

    // if the user is loged in
    if (loading) {
        return <Loading />;
    }

    //Get data from home Jonas
    let handleNewPoiClicking = (lat, lng) => {
        setPosClicked({lng: lng, lat: lat});
    };

    let getEditMarkerState = (editMarkerState) => {
      setIsEditMarker(editMarkerState) ;
    };



  // DON'T ADD PAGE AFTER <Route path="/"> or it will never be accessed
  return (
      <Router>
        <div className="App">
          <CustomNavbar/>

            <Switch>
                <Route path="/about">
                    <About />
                </Route>
                <Route path="/help">
                    <HelpPage />
                </Route>
                <Route path={"/manage/category"}>
                    <EditCategory/>
                </Route>
                <Route path={"/manage/tag"}>
                    <EditTag/>
                </Route>
                <Route path="/manage">
                    <ManagePage/>
                </Route>
                <Route path="/details">
                    <Details posClicked={posClicked} isEditMarker={isEditMarker} setIsEditMarker={setIsEditMarker}/>
                </Route>
                <Route path="/">
                    <Home callbackHandleNewPoiClicking = {handleNewPoiClicking} callBackEditMarkerState={getEditMarkerState}/>
                </Route>
            </Switch>
            <FooterSection/>
        </div>
      </Router>

  );
}

export default App;

