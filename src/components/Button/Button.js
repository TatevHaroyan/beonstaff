import React, { Component } from 'react';
import "../../assets/css/button.css"
class Button extends Component {
    render() {
        return (
            <button className={this.props.buttonStyle}
                disabled={this.props.disabled ? this.props.disabled : false}
                onClick={() => this.props.onChangeValue()}
            >
                {this.props.title}
            </button>
        );
    }
}


export default Button;