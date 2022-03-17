import React, { Component } from 'react';
import '../assets/css/manager.css';
import { Link } from "react-router-dom";
class TaskItem extends Component {
    render() {
        return (
            <div className="user-task-cont">
                <Link to={this.props.link} className='user-task'>
                    <span>{this.props.name}</span>
                    <span>{this.props.organizationName}</span>
                    <span>{this.props.performerFirstName} {this.props.performerLastName}</span>
                    <span>{this.props.endDate}</span>
                    <span>{this.props.endDateManager}</span>
                </Link>
                <div className="tool-tip-cont">
                    <div className="tool-tip">Ջնջել</div>
                    <i className="fas fa-times" onClick={() => this.props.delete_archive()}></i>
                </div>
            </div>

        );
    }
}
export default TaskItem;