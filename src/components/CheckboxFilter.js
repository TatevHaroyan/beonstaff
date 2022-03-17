import React, { Component } from 'react';
import '../assets/css/manager.css';
class CheckboxFilter extends Component {
    
    render() {
        return (
            <label className="cont">{this.props.title}
                <input checked={this.props.my_task} onChange={
                    ()=>this.props.onChange()
                } type="checkbox" />
                <span className="checkmark"></span>
            </label>
        );
    }
}
export default CheckboxFilter;