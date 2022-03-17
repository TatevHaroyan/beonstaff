import React, { Component } from 'react';
import ChangeRepeatedtask from "./NewRepeatedtask/ChangeRepeatedTask";
import { connect } from 'react-redux';
import { getRepeadTaskById } from "../../api";
import 'moment/locale/hy-am';
import { tasksAction, employeeAction } from "../../action/index";
import Loader from 'react-loader-spinner';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
// import ResetRating from "../ResetRating/ResetRating";
// import SubTask from "../SubTask/SubTask";
import MyImgRound from "../../components/MyImgRound";
import "../../assets/css/managerrecommendation.css";
/* <MyImgRound />*/
class RepeatedTaskPage extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            show: false,
            data: {}
        }
    }
    // handleChangeEndDate = (date) => {
    //     let date_get_time = date.getTime()
    //     let date_now = new Date()
    //     let end_date = this.state.end_date
    //     if (date_get_time > date_now) {
    //         end_date = date
    //     } else {
    //         end_date = date_now
    //     }
    //     this.setState({
    //         data: {
    //             ...this.state.data,
    //             end_date: date
    //         }
    //     })
    // }

    componentDidMount() {
        this.getRepeadTaskById()
    }
    getRepeadTaskById() {
        let id = this.props.match.params.id
        let token = localStorage.getItem("token")
        getRepeadTaskById(token, id)
            .then((res) => this.setState({ data: res }))
    }
    renderRepeaedType(type) {
        switch (type) {
            case 1:
                return this.props.word.daily
            case 2:
                return this.props.word.weekly
            case 3:
                return this.props.word.monthly
            case 4:
                return this.props.word.annual
            default:

        }
    }
    render() {
        let data = this.state.data
        const { word } = this.props
        if (data.url) {
            return (
                <div className='recommendation-page'>
                    {this.state.show || this.state.copy ? <div className='popup' onClick={() => this.setState({ show: false, copy: false })}></div> : null}
                    {this.state.showPicker ? <div className='transparent' onClick={() => this.setState({ showPicker: false })}></div> : null}
                    {this.state.show ? <ChangeRepeatedtask
                        close={() => this.setState({ show: false })}
                        data={this.state.data}
                        getRepeatedTaskData={() => this.getRepeadTaskById()} /> : null}
                    {this.state.copy ? <ChangeRepeatedtask
                        copy={this.state.copy}
                        close={() => this.setState({ copy: false })}
                        data={this.state.data}
                        getRepeatedTaskData={() => this.getRepeadTaskById()} /> : null}
                    <div className="repeated-task-cont" >
                        <div className="icon-Compose-cont">
                            <div className="tool-tip-cont">
                                <div className="tool-tip">Պատճենել</div>
                                <i className="fas fa-copy" onClick={() => { this.setState({ copy: true }) }}></i>
                            </div>
                            {this.props.manager.url && (data.creator === this.props.manager.user.url) ? <div className="tool-tip-cont">
                                <div className="tool-tip">Խմբագրել</div>
                                <span onClick={() => { this.setState({ show: true }) }} className='icon-Compose'></span>
                            </div> : null}
                        </div>
                        <a onClick={() => this.props.history.goBack()} className="link-Backward-arrow"><span className="icon-Backward-arrow" ></span></a>
                        <div className='employee-name' onClick={() => this.setState({ show: true })}>
                            {data.accountant_image ? <MyImgRound image={data.accountant_image} /> : null}
                            <span>{data.accountant_first_name} <br />
                                {data.accountant_last_name}</span>
                        </div>
                        <div className='company-name repeated-task-page' onClick={() => this.props.history.push(`/main_employee/organization/${data.company_id}`)}>{data.company_name}</div>
                        <h1>{data.name}</h1>
                        <div className="repeated-task-data">
                            <span>{word.repeated_type}</span>
                            <p>{this.renderRepeaedType(data.repeated_type)}</p>
                        </div>
                        <div className="repeated-task-data">
                            <span>{word.duration}</span>
                            <p>{data.duration}</p>
                        </div>
                        <div className="repeated-task-data">
                            <span>{word.repeated_value}</span>
                            <p>{data.repeated_value}</p>
                        </div>
                        <div className="repeated-task-data">
                            <span>{word.accountant_name}</span>
                            <p>{data.accountant_first_name} {data.accountant_last_name}</p>
                        </div>
                        <div className="repeated-task-data">
                            <span>{word.text}</span>
                            <p>{data.text}</p>
                        </div>
                        {/* <SubTask/> */}
                        {/* <ResetRating /> */}
                    </div>

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
    (state) => ({ word: state.word, show: state.showReducer, tasks: state.tasks, manager: state.loginReducer }),
    (dispatch) => ({
        getTasks: (data) => dispatch(tasksAction(data)),
        getMyInfo: (data) => dispatch(employeeAction(data)),
    })
)(RepeatedTaskPage);