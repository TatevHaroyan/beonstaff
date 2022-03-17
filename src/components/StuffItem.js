import React, { Component } from 'react';
import '../assets/css/manager.css';
import userbig from "../assets/img/userbig.png";
class StuffItem extends Component {
    render() {
        return (
            <div className='card list-item'>
               <div className='list-item-img' style={{backgroundImage:this.props.image?"url("+this.props.image+")":"url("+userbig+")"}}>
               </div>
               <div className='list-item-data'>
                  <span className='list-item-name-surname' >{this.props.name}</span>
                  <span className='list-item-name-surname'>{this.props.surname}</span>
                  <p className='profession'>{this.props.profession}</p>
               </div>
            </div>
        );
    }
}
export default StuffItem;