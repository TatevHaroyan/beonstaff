import React, { Component } from 'react';
import '../assets/css/manager.css';
class UserTask extends Component {
    render() {
        return (
            <div className='user-task'>
               <span>{this.props.first_name} {this.props.last_name}</span>
               <span>{this.props.phone}</span>
               <span>{this.props.email}</span>
            </div>
        );
    }
}
export default UserTask;