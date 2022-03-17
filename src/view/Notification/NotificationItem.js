import React, { Component } from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import 'moment/locale/hy-am';
import user from "../../assets/img/userbig.png";
class NotificationItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false
        }
    }
    render() {
        let date_task = new Date(this.props.date)
        let date_now = new Date()
        return (
            <div className='recommendations-item card'>
                {this.state.show ? <div className='options'>
                    <p className='options-item' onClick={() => {
                        this.props.modalShow()
                        this.setState({ show: false })
                    }} >Ջնջել</p>
                </div> : null}
                <div className='recommendations-item-cont' onClick={() => this.props.history.push(this.props.toLink)} >
                    <div className='card-overflow'>
                        <div className='recommendations-item-top'>
                            <div className='recommendations-item-heading-icon'>
                                <span style={{ color: date_task.getDate() === date_now.getDate() ? "#fccb00" : this.props.color }} className='icon-Component-21--1'></span>
                                <div className='recommendations-item-heading'>{this.props.team}</div>
                            </div>
                        </div>
                        <div className='company-name'>{this.props.comapanyName}</div>
                        <div className='recommendations-item-text'>
                            <span className='recommendations-item-text-hidden'>{this.props.teamText}</span>
                            <div className='recommendations-item-text-icon'>{(this.props.imgList && this.props.imgList.length > 0) ? <span className='icon-Attachment'></span> : null}</div>
                        </div>
                    </div>
                    <div className='recommendations-item-bottom'>
                        <hr />
                        <div className='image-calendar'>
                            <div className="accountant_image_list">
                                {this.props.image_list.map((item, index) => {
                                    return <img key={index} className='accountant_image' src={item.image?item.image:user}></img>
                                })}
                            </div>
                            <div className='calendar'>
                                <span className='icon-Calendar'></span>
                                <div className="task-date-cont">
                                    <span className='moment'>{moment(this.props.date).format('LL')}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {localStorage.getItem("profession") === "manager" && this.props.manager === this.props.employee.url ? <span className="icon-Options" onClick={() => this.setState({ show: !this.state.show })}></span> : null}
            </div>
        );
    }
}


export default connect(
    (state) => ({ word: state.word, show: state.showReducer, employee: state.loginReducer }),
)(NotificationItem);