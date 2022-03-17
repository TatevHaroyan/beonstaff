import React, { Component } from 'react';
import "../../assets/css/button.css"
class BlueButton extends Component {
    render() {        
        return (
            <button className='little-button' 
            disabled={this.props.disabled?this.props.disabled:false}
            style={{backgroundColor:this.props.color}}
            type="button"
            onClick={()=>this.props.onChangeValue()}
            // style={{
            //     width: this.props.width,
            //     height: this.props.height,
            //     margin:this.props.margin
            // }} 
            >
               {this.props.title}
            </button>
        );
    }
}


export default BlueButton;