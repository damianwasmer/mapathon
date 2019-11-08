import React from "react";
import {Spinner} from "reactstrap";

export default function LoadingSpinner() {
    return (
        <div><Spinner color="primary"/>Please wait</div>
    );
}