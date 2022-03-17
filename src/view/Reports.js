import React, { Component } from 'react';
import { connect } from 'react-redux';
import RegisButton from "../components/RegisButton/RegisButton";
import { TextField } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Button from 'react-bootstrap/Button';
import Collapse from 'react-bootstrap/Collapse'
// import Button from "../Button/Button";
import DatePicker from "react-datepicker";
import { SERVER } from "../config";
import { getReport, getTaskTemplate } from "../api";
import { toast } from 'react-toastify';
import "react-datepicker/dist/react-datepicker.css";
import "../assets/css/managerrecommendation.css";
import { get_task_template } from "../action";
import moment from 'moment';
import 'moment/locale/hy-am';
// const date = new Date()
// date.setMonth(date.getMonth() - 1)
// const end_date = new Date()
// end_date.setDate(end_date.getDate() + 1);
class Reports extends Component {
    constructor(props) {
        super(props);
        this.state = {
            active: "accountant"
            // manager: false,
            // start_date: new Date(),
            // end_date: new Date(),
        }
    }
    componentDidMount() {
        let token = localStorage.getItem("token")
        getTaskTemplate(token)
            .then((res) => {
                this.props.get_task_template(res)
            })
    }
    success_notify() {
        toast.success(this.props.word.success_process, {
            position: toast.POSITION.TOP_CENTER
        })
    };
    error_notify() {
        toast.error(this.props.word.error_process, {
            position: toast.POSITION.TOP_CENTER
        })
    };
    handleChangestartDate = date => {
        let date_now = new Date()
        let start_date = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
        if (date <= date_now) {
            this.setState({
                start_date: date,
                filter_start_date: start_date
            })
        }

    };
    handleChangefinishDate = date => {
        let date_now = new Date()
        let end_date = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
        if (date <= date_now) {
            this.setState({
                end_date: date,
                filter_end_date: end_date
            })
        }
    };
    selected_list() {
        switch (this.state.active) {
            case "manager":
                return <Autocomplete
                    key={Math.random().toString()}
                    id="combo-box-demo"
                    options={this.props.manager}
                    value={this.state.value}
                    // defaultValue={stuff[0]}
                    onChange={(e, value) => {
                        if (value) {
                            this.setState({
                                id: value.id,
                                value: `${value.user.first_name} ${value.user.last_name}`
                            })
                        }
                    }}
                    getOptionLabel={option => {
                        if (option && option.user) {
                            return `${option.user.first_name} ${option.user.last_name}`
                        } else {
                            return option.toString()
                        }


                    }}
                    renderInput={params => (
                        <TextField {...params}
                            value={this.state.value ? this.state.value : ""}
                            //  error={!item.valid && this.state.submited}
                            // id={!item.valid && this.state.submited === true ? "validation-outlined-input" : "outlined-helperText"}
                            // label={this.props.word[item.key]}
                            fullWidth />
                    )}
                />
            case "accountant":
                return <Autocomplete
                    id="combo-box-demo"
                    key={Math.random().toString()}
                    options={this.props.stuff}
                    value={this.state.value}
                    // defaultValue={stuff[0]}
                    onChange={(e, value) => {
                        if (value) {
                            this.setState({
                                id: value.id,
                                value: `${value.user.first_name} ${value.user.last_name}`
                            })
                        }
                    }}
                    getOptionLabel={option => {
                        if (option && option.user) {
                            return `${option.user.first_name} ${option.user.last_name}`
                        } else {
                            return option.toString()
                        }
                    }}
                    renderInput={params => (
                        <TextField {...params}
                            value={this.state.value ? this.state.value : ""}
                            //  error={!item.valid && this.state.submited}
                            // id={!item.valid && this.state.submited === true ? "validation-outlined-input" : "outlined-helperText"}
                            // label={this.props.word[item.key]}
                            fullWidth />
                    )}
                />
            case "template":
                return <Autocomplete
                    key={Math.random().toString()}
                    id="combo-box-demo"
                    options={this.props.template}
                    value={this.state.value}
                    // defaultValue={stuff[0]}
                    onChange={(e, value) => {
                        if (value) {
                            this.setState({
                                id: value.id,
                                value: `${value.name}`
                            })
                        }
                    }}
                    getOptionLabel={option => {
                        if (option && option.name) {
                            return `${option.name}`
                        } else {
                            return option.toString()
                        }
                    }}
                    renderInput={params => (
                        <TextField {...params}
                            value={this.state.value ? this.state.value : ""}
                            //  error={!item.valid && this.state.submited}
                            // id={!item.valid && this.state.submited === true ? "validation-outlined-input" : "outlined-helperText"}
                            // label={this.props.word[item.key]}
                            fullWidth />
                    )}
                />
            default:
                break;
        }
    }
    render() {
        const { stuff, manager, template } = this.props;
        const link = `${SERVER}report/${this.state.id}/${this.state.filter_start_date}/${this.state.filter_end_date}/${this.state.active}/excel/`;
        return (
            <div className="reports">
                <div className="reports-buttons">
                    <div className={this.state.active === "accountant" ? "report-button-active" : "report-button"}
                        onClick={() => this.setState({ active: "accountant", id: null, value: "", result: [] })}>Աշխատակից</div>
                    <div className={this.state.active === "manager" ? "report-button-active" : "report-button"}
                        onClick={() => this.setState({ active: "manager", id: null, value: "", result: [] })}>Մենեջեր</div>
                    <div className={this.state.active === "template" ? "report-button-active" : "report-button"}
                        onClick={() => this.setState({ active: "template", id: null, value: "", result: [] })}>Ձևանմուշ</div>
                </div>
                <div className="reports-item-cont">
                    <div className="reports-item">
                        <div className="left-green-button"><span>{this.state.active === "manager" ? "Մենեջեր" : (this.state.active === "accountant" ? "Աշխատակից" : "Առաջադրանքի վերնագիր")}</span></div>
                        {this.selected_list()}
                        {/* <Autocomplete
                            id="combo-box-demo"
                            options={this.state.active === "manager" ? manager : (this.state.active === "accountant" ? stuff : template)}
                            value={this.state.value}
                            // defaultValue={stuff[0]}
                            onChange={(e, value) => {
                                if (value) {
                                    this.setState({
                                        id: value.id,
                                        value: this.state.active !== "template" ?
                                            `${value.user.first_name} ${value.user.last_name}` : `${value.name}`
                                    })
                                }
                            }}
                            getOptionLabel={option => {
                                console.log(option, "optionoptionoption");
                                return this.state.active !== "template" && option.user ? `${option.user.first_name} ${option.user.last_name}` : `${option.name}`
                            }}
                            renderInput={params => (
                                <TextField {...params}
                                    value={this.state.value ? this.state.value : ""}
                                    //  error={!item.valid && this.state.submited}
                                    // id={!item.valid && this.state.submited === true ? "validation-outlined-input" : "outlined-helperText"}
                                    // label={this.props.word[item.key]}
                                    fullWidth />
                            )}
                        /> */}
                    </div>
                    <div className="reports-item">
                        <div className="left-green-button"><span>Սկիզբ</span></div>
                        <div className="contDatePicker">
                            <DatePicker
                                dateFormat="dd/MM/yyyy"
                                selected={this.state.start_date}
                                onChange={this.handleChangestartDate}
                            />
                        </div>
                    </div>
                    <div className="reports-item">
                        <div className="left-green-button"><span>Ավարտ</span></div>
                        <div className="contDatePicker">
                            <DatePicker
                                dateFormat="dd/MM/yyyy"
                                selected={this.state.end_date}
                                onChange={this.handleChangefinishDate

                                }
                            />
                        </div>
                    </div>
                </div>
                {/* <a href={this.state.id && this.state.filter_start_date && this.state.filter_end_date ?
                    link : null}
                    download
                >
                    {this.state.start_date <= this.state.end_date && this.state.id
                        ?
                        <RegisButton title="Տեսնել" onChangeValue={() => {
                            getAccountantReport(this.state.id, this.state.filter_start_date, this.state.filter_end_date)
                            .then((res)=>{this.setState({...this.state,...res})})
                            console.log(this.state.id, this.state.filter_start_date, this.state.filter_end_date)
                        }} 
                        // icon="fa fa-download"
                         />
                        : null}
                </a>
                {console.log(this.state,"stateeeeeeeeeeeeeeeeeeeeeeee")} */}
                {/* http://testadmin.beon.am/api/report/3/2021-1-1/2021-4-26/template/json/ */}
                {this.state.start_date && this.state.start_date && this.state.start_date <= this.state.end_date && this.state.id
                    ? <div className="report-buttons">
                        <Button
                            onClick={() => {
                                let title = this.state.active
                                let id = this.state.id;
                                getReport(id, this.state.filter_start_date, this.state.filter_end_date, title)
                                    .then((res) => {
                                        if (res.error) {
                                            this.error_notify()
                                        } else {
                                            this.setState({ ...this.state, ...res, open: true })
                                        }
                                    })
                                // if (!this.state.manager) {
                                //     getAccountantReport(this.state.id, this.state.filter_start_date, this.state.filter_end_date)
                                //         .then((res) => {
                                //             if (res.error) {
                                //                 this.error_notify()
                                //             } else {
                                //                 this.setState({ ...this.state, ...res, open: true })
                                //             }
                                //         })
                                // } else {
                                //     getManagerReport(this.state.id, this.state.filter_start_date, this.state.filter_end_date)
                                //         .then((res) => {
                                //             if (res.error) {
                                //                 this.error_notify()
                                //             } else {
                                //                 this.setState({ ...this.state, ...res, open: true })
                                //             }
                                //         })
                                // }
                            }}
                            aria-controls="example-collapse-text"
                            aria-expanded={this.state.open}
                        >
                            Տեսնել
                        </Button>  <a href={this.state.id && this.state.filter_start_date && this.state.filter_end_date ?
                            link : null}
                            download
                        >   <div className="tool-tip-cont">
                                <div className="tool-tip">Բեռնել</div>
                                <i className="fa fa-download"></i>
                            </div>
                        </a>
                    </div> : null}
                <div className="table-cont">
                    <Collapse in={this.state.open}>
                        <div id="example-collapse-text">
                            <table>
                                {this.state.result && this.state.result.length > 0 ? <tbody>
                                    <tr>
                                        <th>Կազմակերպության անուն</th>
                                        <th>Առաջադրանքի անուն</th>
                                        <th>Ստեղծվել է</th>
                                        <th>Սկսվել է</th>
                                        <th>Ավարտվել է</th>
                                        <th>Տևել է</th>
                                        <th>Ընդհանուր</th>
                                    </tr>
                                    {this.state.result.map((item, index) => {
                                        return <tr className='report-list' key={index}>
                                            <td className='report-item'>{item.company_name}</td>
                                            <td className='report-item'>{item.task_name}</td>
                                            <td className='report-item'>{
                                                moment(item.created_date).tz('Asia/Yerevan').format('L')} {moment(item.created_date).tz('Asia/Yerevan').format('LTS')
                                                    // moment(item.created_date).tz('Asia/Yerevan').format('MMMM Do YYYY, h:mm:ss a')
                                                }</td>
                                            <td className='report-item'>{
                                                moment(item.created_date).tz('Asia/Yerevan').format('L')} {moment(item.start_date).tz('Asia/Yerevan').format('LTS')
                                                    // moment(item.created_date).tz('Asia/Yerevan').format('MMMM Do YYYY, h:mm:ss a')
                                                }</td>
                                            {item.end_date !== "None" ? <td className='report-item'>{
                                                moment(item.end_date).tz('Asia/Yerevan').format('L')} {moment(item.end_date).tz('Asia/Yerevan').format('LTS')
                                                    // moment(item.end_date).tz('Asia/Yerevan').format('MMMM Do YYYY, h:mm:ss a')
                                                }</td> : null}
                                            <td className='report-item'>{item.duration}</td>
                                            {index === 0 ? <td className='report-item'>{this.state.all_duration}</td> : null}
                                        </tr>
                                    })}
                                </tbody> : <span>Առաջադրանքներ չկան</span>}
                            </table>
                        </div>
                    </Collapse>
                </div>
            </div>
        );
    }
}
export default connect(
    (state) => ({
        word: state.word, stuff: state.stuff.results,
        template: state.taskTemplate,
        manager: state.manager.array_manager.results,
    }),
    (dispatch) => ({
        get_task_template: (data) => dispatch(get_task_template(data))
    })
)(Reports);