import React, { Component } from 'react';
import "../../assets/css/button.css"
class RegisButton extends Component {
    render() {
        return (
            <div className="button-regis" style={{backgroundColor:this.props.backgroundColor}} onClick={() => this.props.onChangeValue()}>
                <div className="button-regis-text" style={{color:this.props.color}}>{this.props.title}</div>
                <div className="button-icon" style={{backgroundColor:this.props.buttonIconColor}} >
                    <div className="triangle1"></div>
                    <div className="triangle2"></div>
                    <i style={{color:this.props.colorIcon}} className={this.props.icon} aria-hidden="true"></i>
                </div>
            </div>
        );
    }
}
export default RegisButton;