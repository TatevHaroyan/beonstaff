import React, { Component } from 'react';
import ic_add_24px from "../assets/img/ic_add_24px.svg";

class Plus extends Component {
    
    render() {
        return (
            <div className='plus-employee' >
                <img src={ic_add_24px} alt="plus"></img>
            </div>
        );
    }
}


export default Plus;