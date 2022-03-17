import React, { Component } from 'react';
import { Row, Col } from 'react-bootstrap';
import { connect } from 'react-redux';
import { getNotificationById, putNotificationById, getNotification, notificationComment } from "../../api";
import send from "../../assets/img/send-mail.svg";
// import Button from "../Button/Button";
// import DateTimePicker from 'react-datetime-picker';
import "react-datepicker/dist/react-datepicker.css";
import moment from 'moment';
import 'moment/locale/hy-am';
import { tasksAction, employeeAction, getNotificationAction } from "../../action/index";
import Loader from 'react-loader-spinner';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import "../../assets/css/managerrecommendation.css";
import user from "../../assets/img/usermiddle.png";
var notificationGet = {}
class NotificationPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            comment: "",
            show: false,
            showPicker: false,
            accountant: {},
            file: "",
            filePreviewUrl: "",
            text: "",
            data: {},
            visibleMessage: false
        }
    }
    handleChangeEndDate = (date) => {
        let date_get_time = date.getTime()
        let date_now = new Date()
        let date_now_get_time = date_now.getTime()
        let end_date = new Date()
        if (date_get_time > date_now_get_time) {
            end_date = date
        } else {
            end_date = date_now
        }
        this.setState({
            data: {
                ...this.state.data,
                end_date: end_date
            }
        })
    }
    componentDidMount() {
        this.getNotificationById()
        this.notificationGetTime()
    }
    getNotificationById() {
        let id = this.props.match.params.id;
        let token = localStorage.getItem("token")
        getNotificationById(token, id)
            .then((res) => {
                let data = res
                let id = localStorage.getItem("id")
                if (localStorage.getItem("profession") !== "manager") {
                    data.accountants.push(`https://192.168.1.115:18000/api/accountant/${id}/`)
                } else {
                    data.managers.push(`https://192.168.1.115:18000/api/manager/${id}/`)
                }

                // if (localStorage.getItem("profession") !== "manager") {
                putNotificationById(token, res.id, data)
                    .then(() => {
                        const params = localStorage.getItem("profession") !== "manager" ? { accountants_client_eq: localStorage.getItem("id"), accountant_neq: localStorage.getItem("id") } :
                            { managers_client_eq: localStorage.getItem("id"), manager_neq: localStorage.getItem("id") }
                        getNotification(params)
                            .then((response) => {
                                this.props.getNotification(response)
                            })
                    })
                // }
                this.setState({ data: res })
            })
    }

    raiseInvoiceClicked(url) {
        localStorage.setItem("pageData", "Data Retrieved from axios request")
        window.open(url, "_blank")
    }
    sendCopmment() {
        let formData = new FormData();
        formData.append("file_url", this.state.file)
        formData.append("file_name", this.state.file.name)
        formData.append("comment", this.state.comment)
        formData.append("notification", this.state.data.url)
        if (localStorage.getItem("profession") === "accountant") {
            formData.append("accountant", this.props.employee.url)
        } else {
            formData.append("manager", this.props.employee.url)
        }
        // let file = this.state.file;
        // let data = {
        //     "comment": this.state.comment,
        //     "notification": this.state.data.url,
        //     "accountant": localStorage.getItem("profession") === "accountant" ? this.props.employee.url : null,
        //     "manager": localStorage.getItem("profession") === "manager" ? this.props.employee.url : null
        // }
        if (this.state.comment.trim().length > 0 || this.state.file) {
            this.setState({ send_message: true })
            notificationComment(formData)
                .then(() => {
                    this.getNotificationById()
                    this.setState({
                        file: "",
                        filePreviewUrl: "",
                        send_message: false
                    })
                })
        }
    }
    keyPress(e) {
        if (e.key === "Enter") {
            this.sendCopmment()
            this.setState({ comment: "" })
        }
    }
    notificationGetTime() {
        notificationGet = setInterval(() => {
            this.getNotificationById()
        }, 10000)
    }
    componentWillUnmount() {
        clearTimeout(notificationGet);
    }
    render() {
        let { filePreviewUrl, file } = this.state;
        let $filePreview = null;
        if (filePreviewUrl !== "") {
            try {
                $filePreview = (<div className='my-sms'>
                    <i className="far fa-times-circle" onClick={() => { this.setState({ file: "", filePreviewUrl: "" }) }}></i>
                    {file.type.includes('image/') ? <div className='my-sms-img' style={{ backgroundImage: "url(" + filePreviewUrl + ")" }}></div> : null}
                    <span className='my-sms-img-name'>{file.name}</span>
                </div>);
            } catch (error) {
                console.log('-----');
            }
        }
        // this.notificationGetTime()
        // const { word } = this.props
        let data = this.state.data
        // setTimeout(() => {
        //     this.getNotificationById()
        // }, 10000)
        if (data.url) {
            return (
                <div className='recommendation-page'>
                    {this.state.show && data.status !== "end" ? <div className='popup' onClick={() => this.setState({ show: false })}></div> : null}
                    {this.state.showPicker && data.status !== "end" ? <div className='transparent' onClick={() => this.setState({ showPicker: false })}></div> : null}
                    <Row >
                        <Col xs={12} sm={12}>
                            <a onClick={() => this.props.history.goBack()} className="link-Backward-arrow"><span className="icon-Backward-arrow" ></span></a>
                            <div className='company-name' onClick={() => this.props.history.push(`/main_employee/organization/${data.company_id}`)}>{data.company_name}</div>
                            <h1>{data.title}</h1>
                            <p>{data.description}</p>
                            <div>
                                {/* <div className="accountant-name-list">
                                    <span className="accountant-name-list-title">Ուղարկել է</span>
                                    <div key={index} className="notification-accountant-name">{item.fullname}ին,</div>
                                </div> */}
                                <div className="accountant-name-list">
                                    <span className="accountant-name-list-title">Ուղարկված է</span>
                                    {data.accountant_list.map((item, index) => {
                                        return <div key={index} className="notification-accountant-name">{item.fullname}
                                            {(item.fullname.charAt(item.fullname.length - 1) === "ա" || item.fullname.charAt(item.fullname.length - 1) === "ո") ? "յին" : "ին"},</div>
                                    })}
                                </div>
                                {/* <p className="end-date">{word.end_date}՝</p> */}
                                <p className="end-date">{moment(data.date).format('LL')}</p></div>
                            <div className='img-cont'>
                                {data.notification_file.map((item, index) => {
                                    return <div className='img' key={index} onClick={() => this.raiseInvoiceClicked(item.file)}>
                                        <span className='icon-Photos'></span><span className='phoro-name'>{item.file_name}</span></div>
                                })}
                            </div>
                            <div className="comment-cont">
                                <h5 className="comment-heading">Մեկնաբանություն</h5>
                                <div className="image-input">
                                    <img className="image" src={this.props.employee.image && this.props.employee.image !== null ? this.props.employee.image : user}
                                        alt="img" />
                                    <div className='input-image' >
                                        <div>{$filePreview}</div>
                                        <input value={this.state.comment} onChange={(e) => {
                                            this.setState({ comment: e.target.value })
                                        }}
                                            autoFocus={true}
                                            onKeyDown={(e) => {
                                                if (!this.state.send_message) {
                                                    this.keyPress(e)
                                                }
                                            }} />
                                    </div>
                                    <div className="send-file">
                                        <label>
                                            <i className="fas fa-image"></i>
                                            {/* <i className="fas fa-paperclip"></i> */}
                                            <input type="file" className='input-icon' onChange={(e) => {
                                                let reader = new FileReader();
                                                let file = e.target.files[0]
                                                if (file.size === 0) {
                                                    alert("Ֆայլը դատարկ է")
                                                }
                                                reader.onloadend = () => {
                                                    this.setState({
                                                        file,
                                                        filePreviewUrl: reader.result
                                                    });
                                                }
                                                reader.readAsDataURL(file)
                                            }} />
                                        </label>
                                        <img alt="img" className="send-icon" src={send} onClick={() => {
                                            if (!this.state.send_message) {
                                                this.sendCopmment()
                                            }
                                        }}></img>
                                    </div>
                                </div>
                                <div className="comment-item">{data.notification_comment.map((item, index) => {
                                    let employee_item = item.comment_accountant ? item.comment_accountant : item.comment_manager;
                                    let my_comment = (this.props.employee.url === item.accountant || this.props.employee.url === item.manager) ? true : false
                                    return <div className={my_comment ? "my-comment-image comment-image" : "comment-image"} key={index}>
                                        <img className="image" src={employee_item.image !== null ? employee_item.image : user}
                                            alt="img" />
                                        <div className="comment">
                                            <span>{`${employee_item.user.first_name} ${employee_item.user.last_name}`}</span>
                                            <div className='created_date'>{moment(item.created_date).format('lll')}</div>
                                            <div className="comment-text-image">
                                                {item.comment ? <div className="comment-text">{item.comment}</div> : null}</div>
                                            {item.file_url && (item.file_url.includes(".jpg") || item.file_url.includes(".png") || item.file_url.includes(".jpeg")) ?
                                                <div className='sms-img'
                                                    onClick={() => this.raiseInvoiceClicked(item.file_url)}
                                                    style={{ backgroundImage: "url(" + item.file_url + ")" }}></div>
                                                : <div onClick={() => this.raiseInvoiceClicked(item.file_url)}>
                                                    {item.file_name !== "undefined" ? item.file_name : ""}</div>}
                                        </div>
                                    </div>
                                })}</div>
                            </div>
                        </Col >
                    </Row>
                </div>
            );
        }
        else {
            return <div className="loader-cont"><Loader
                type="Oval"
                color="#101C2A"
                height={30}
                width={30}
            /></div>
        }
    }
}
export default connect(
    (state) => ({ word: state.word, show: state.showReducer, tasks: state.tasks, employee: state.loginReducer }),
    (dispatch) => ({
        getTasks: (data) => dispatch(tasksAction(data)),
        getMyInfo: (data) => dispatch(employeeAction(data)),
        getNotification: (data) => dispatch(getNotificationAction(data)),
    })
)(NotificationPage);