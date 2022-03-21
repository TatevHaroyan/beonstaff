import React, { Component } from 'react';
import LinesEllipsis from 'react-lines-ellipsis';
import Options from "./Options";
import user from "../assets/img/userbig.png";
import { SERVER } from "../config";
import 'moment-timezone';
import moment from 'moment';
import 'moment/locale/hy-am';

class RecommendationsItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false
        }
    }
    render() {
        const { item } = this.props;
        let date_task = new Date(item.end_date)
        let date_now = new Date()
        let date_end_task = new Date(item.end_task_date)
        return (
            <div style={{ backgroundColor: this.props.child_tasks ? "#ceefe9" : "" }}
                className={item.end_date && (item.status === "end" && (date_task.getTime() < date_end_task.getTime()) || (item.status === "process" && (date_task.getTime() < date_now.getTime()))) ? 'recommendations-item expired card' : 'recommendations-item card'}>
                {this.state.show ? <Options id={item.id}
                    status={item.status}
                    creator={item.creator}
                    modalShow={() => {
                        this.props.modalShow()
                        this.setState({ show: false })
                    }}
                    close={() => {
                        this.setState({ show: false })
                        this.props.getTaskData()
                    }
                    } delete={() => console.log("delete")} /> : null}
                <div className='recommendations-item-cont' onClick={() => this.props.history.push(this.props.toLink)} >
                    <div className='card-overflow'>
                        <div className='recommendations-item-top'>
                            <div className='recommendations-item-heading-icon'>
                                {/* color: date_task.getDate() === date_now.getDate() ? "#fccb00" : */}
                                <span style={{ color: this.props.color }} className='icon-Component-21--1'></span>
                                <div className='recommendations-item-heading'>{item.name}</div>
                            </div>
                        </div>
                        <div className="tool-tip-cont">
                            <div className="tool-tip">{item.company_name}</div>
                            <div className='company-name'>{item.company_name}</div>
                        </div>
                        <div className='recommendations-item-text'>
                            <LinesEllipsis text={item.text} maxLine="2" basedOn="words" />
                            {/* <span className='recommendations-item-text-hidden'>{item.text}</span> */}
                            <div className="process-file-message">
                                {item.status === "process" ? <div>{item.task_timer && item.task_timer[item.task_timer.length - 1] && item.task_timer[item.task_timer.length - 1].end === null ?
                                    <span className="active">Ակտիվ</span> : <span className="passive">Պասիվ</span>}</div> : null}
                                <div className="recommendations-item-text-icon-cont">
                                    {item.is_voice ? <div className="add-file">
                                        <div className="volume"></div>
                                    </div> : null}
                                    {(item.task_file && item.task_file.length > 0) ? <div className='recommendations-item-text-icon'>
                                        <div className="add-file">
                                            <span className='icon-Attachment'></span>
                                            <div className="tasks-around-cont">
                                                {item.new_file_count ? <div className="tasks-around">{item.new_file_count}</div> : null}
                                                {item.new_sub_file_count ? <div className="sub-tasks-around tasks-around">{item.new_sub_file_count}</div> : null}
                                            </div>
                                        </div>
                                    </div> : null}
                                    {(item.sms_task && item.sms_task.length > 0) ? <div className='recommendations-item-text-icon'> <div className="add-file">
                                        {item.new_sms_count !== 0 ? <div className="tasks-around">{item.new_sms_count}</div> : null}
                                        {item.sms_task && item.sms_task.length > 0 ? <i className="far fa-envelope"></i> : null}
                                    </div>
                                    </div> : null}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='recommendations-item-bottom'>
                        <hr />
                        <div className='image-calendar'>
                            <div className="image-name-emplayee">
                                <img alt="img"
                                    className='task-image' src={item.accountant_image ? item.accountant_image : user}></img>
                                {item.accountant_first_name ? <span className="name-emplayee">{item.accountant_first_name} {item.accountant_last_name}</span> :
                                    <span className="name-emplayee">{item.manager_name}</span>}

                            </div>
                            <span className='calendar'>
                                <span className='icon-Calendar'></span>
                                <div className="task-date-cont">
                                    <span className='moment'>Ստղ. {item.created_date ? moment(item.created_date).tz('Asia/Yerevan').format('LLL') : null}</span>
                                    {/* <span className='moment'>Ստղ. {this.props.created_date?moment(this.props.created_date).format('LLL'):null}</span> */}
                                    {item.status !== "new" ? <span className='moment'>Սկզ. {item.start_task_date ? moment(item.start_task_date).tz('Asia/Yerevan').format('LLL') : null}</span> : null}
                                    {item.status === "end" ? <span className='moment'>Ավտ. {item.end_task_date ? moment(item.end_task_date).tz('Asia/Yerevan').format('LLL') : null}</span> : null}
                                </div>
                            </span>
                        </div>
                    </div>
                </div>
                {((localStorage.getItem("profession") === "manager" && item.status === "end") ||
                    item.creator === `${SERVER}user/${localStorage.getItem("user_id")}/`
                ) ?
                    <span className="icon-Options" onClick={() => {
                        this.setState({ show: !this.state.show })
                    }}></span> : null}
            </div>
        );
    }
}
export default RecommendationsItem;