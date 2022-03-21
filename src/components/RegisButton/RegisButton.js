import React, { Component } from 'react';
import "../../assets/css/button.css"
class RegisButton extends Component {
    render() {
        const { backgroundColor, color, title, buttonIconColor, colorIcon, icon} = this.props;
        return (
            <div className="button-regis" style={{backgroundColor}} onClick={() => this.props.onChangeValue()}>
                <div className="button-regis-text" style={{color}}>{title}</div>
                <div className="button-icon" style={{backgroundColor:buttonIconColor}} >
                    <div className="triangle1"/>
                    <div className="triangle2"/>
                    <i style={{color: colorIcon}} className={icon} aria-hidden="true"></i>
                </div>
            </div>
        );
    }
}
export default RegisButton;