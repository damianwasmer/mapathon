import React from 'react';
import {Button} from "reactstrap";

export default function Tag(props){

    let tag = props.tagToDisplay;
    let colorTag = tag.color;

    //a tag button to add on boxTag
    return(
      <Button
          style={{display: "inline-block", backgroundColor:colorTag, padding: '1px', marginRight: '5px'}}
      >
          {tag.name} <img
          src={tag.image}
          alt={"Tag"}
          style={{maxWidth: '12pt'}}
      />
      </Button>
    );
}