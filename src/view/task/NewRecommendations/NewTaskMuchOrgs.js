import React, { Component } from 'react';
import { Row, Col } from 'react-bootstrap';
import BlueButton from "../../../components/BlueButton/BlueButton";
import { TextField } from '@material-ui/core';
import DateTimePicker from 'react-datetime-picker';
import moment from 'moment';
import 'moment/locale/hy-am';
import "react-datepicker/dist/react-datepicker.css";
// import PropTypes from "prop-types";
// import Autocomplete from '@material-ui/lab/Autocomplete';
import {
    // createStyles,
    // fade,
    // Theme,
    // ThemeProvider,
    withStyles,
    // makeStyles,
    // createMuiTheme,
} from '@material-ui/core/styles';
import {
    MultiTask, employeeManagerAction,
} from "../../../api";
import { employeeAction, orgAction, stuffAction } from "../../../action";
import { connect } from 'react-redux';
import Loader from 'react-loader-spinner';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import CheckboxFilter from '../../../components/CheckboxFilter';
const ValidationTextField = withStyles({
    root: {
        '& input:valid + fieldset': {
            borderColor: '#63c0ba',
            borderWidth: 2,
        },
        '& input:invalid + fieldset': {
            borderColor: 'red',
            borderWidth: 2,
        },
        '& input:valid:focus + fieldset': {
            borderColor: '#63c0ba',
            borderLeftWidth: 6,
            padding: '4px !important', // override inline-style
        },
    },
})(TextField);
class NewTaskMuchOrgs extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dispatch: false,
            submited: false,
            select_all: false,
            visible_for_client: true,
            // end_date: new Date(),
            form: [
                {
                    key: 'name',
                    value: "",
                    errorMessage: "empty_error",
                    type: "textarea",
                    label: ""
                },
                {
                    key: 'text',
                    value: "",
                    errorMessage: "empty_error",
                    type: "textarea",
                    label: ""
                },
                {
                    key: 'company',
                    value: [],
                    option: "orgs",
                    errorMessage: "select_error",
                    type: "dropDown",
                    label: ""
                },
                // {
                //     key: localStorage.getItem("profession") === "manager" ? 'accountant' : "manager",
                //     value: "",
                //     option: localStorage.getItem("profession") === "manager" ? "stuff" : "manager",
                //     errorMessage: "select_error",
                //     type: "dropDown",
                //     label: ""
                // },

            ],
            imagePreviewUrl: '',
            images: [],
        }
    }
    // componentDidMount() {
    //     this.getStuff()
    //         this.getOrg()
    // }
    companyPage = 0
    success_notify = () => toast.success(this.props.word.success_process, {
        position: toast.POSITION.TOP_CENTER
    });
    error_notify = () => toast.error(this.props.word.error_process, {
        position: toast.POSITION.TOP_CENTER
    });
    // getStuff() {
    //     let token = localStorage.getItem("token")
    //     getStuff(token, 1000)
    //         .then((res) => this.props.getStuff(res))
    // }
    // getOrg() {
    //     let token = localStorage.getItem("token")
    //     getOrg(token, 1000)
    //         .then((res) => this.props.getOrg(res))
    // }
    keyPress(e) {
        if (e.key === "Enter") {
            this.submite()
        }
    }
    handleChangeDate = date => {
        // let date_get_time = date.getTime()
        // let date_now = new Date()
        // let new_date = this.state.new_date
        // if (date_get_time > date_now) {
        //     new_date = date
        // } else {
        //     new_date = date_now
        // }
        this.setState({ end_date: date })
    }
    submite() {
        // if (this.state.end_date < new Date()) {
        //     return
        // }
        let token = localStorage.getItem("token")
        // let id = localStorage.getItem("id");
        let url = this.props.myData.url
        let profession = localStorage.getItem("profession");
        let images = this.state.images;
        let formData = new FormData();
        let company = this.state.form[this.state.form.length - 1].value;
        let end_date = moment(this.state.end_date).format("YYYY-MM-DD HH:mm:ss");
        let creator = this.props.login.user.url
        let postCompany = []
        this.setState({
            submited: true, disabled: true
        })
        for (let i = 0; i < images.length; i++) {
            formData.append(`file${i + 1}`, images[i], images[i].name)
        }
        for (let index = 0; index < company.length; index++) {
            const element = company[index];
            postCompany.push(element.value)
        }
        for (let index = 0; index < this.state.form.length; index++) {
            const element = this.state.form[index];
            if (!element.valid && this.state.select_all !== true && element.type !== "dropDown") {
                this.setState({ disabled: false })
                return
            } else if (index !== this.state.form.length - 1) {
                formData.append(element.key, element.value)
            }

        }
        formData.append(profession, url);
        formData.append("company", postCompany);
        formData.append("selectAll", this.state.select_all);
        formData.append("visible_for_client", this.state.visible_for_client);
        if (end_date) {
            formData.append("end_date", end_date)
        }
        formData.append("creator", creator)
        MultiTask(token, formData)
            .then((res) => {
                if (res.error) {
                    this.error_notify()
                    this.setState({
                        disabled: false
                    })
                } else {
                    this.success_notify()
                    this.props.close()
                }

            })
            .catch((error) => {
                console.log(error);
            })
    }
    _renderDropDown(item, index) {
        const animatedComponents = makeAnimated();
        let option = this.props.limit_data[item.option]
        // let option = this.props[item.option]
        return <div key={index} className={!item.valid && this.state.submited ? "input-validation input-validation-valid" : "input-validation"}>
            <Select
                isLoading={option ? false : true}
                onKeyDown={(e) => { this.keyPress(e) }}
                closeMenuOnSelect={false}
                components={animatedComponents}
                options={option}
                className={!item.valid && (this.state.submited || item.active) ? "error-select" : ""}
                onChange={(list) => {
                    item.value = list
                    item.active = false
                    item.valid = item.value ? item.value.length > 0 : false
                    this.setState({ form: this.state.form })
                }}
                placeholder={this.props.word[item.key]}
                isMulti
            />
            {(!item.valid && this.state.submited) ? <div className='validation valid-center'>{this.props.word[item.errorMessage]}</div> : null}
        </div>
    }
    _rederTextArea(item, index) {
        return <div className={!item.valid && this.state.submited ? "input-validation input-validation-valid" : "input-validation"} key={index} >
            <ValidationTextField
                name={item.key} value={item.value}
                onChange={(e) => {
                    item.value = e.target.value
                    item.valid = item.value.length > 0
                    this.setState({ form: this.state.form })
                }}
                onBlur={() => {
                    item.active = false;
                    this.setState({ form: this.state.form })
                }}
                onFocus={() => {
                    item.active = true;
                    this.setState({ form: this.state.form })
                }}
                onKeyDown={(e) => { this.keyPress(e) }}
                label={this.props.word[item.key]}
                multiline={true}
                variant="outlined"
                error={!item.valid && this.state.submited}
                id={!item.valid && this.state.submited === true ? "validation-outlined-input" : "outlined-helperText"}
            />
            {(!item.valid && this.state.submited) ? <div className='validation valid-center'>{this.props.word[item.errorMessage]}</div> : null}
        </div>
    }
    render() {
        const { word } = this.props
        return (
            <div className='new-recommendation'>
                <div className="tool-tip-cont">
                    <div className="tool-tip">Փակել</div>
                    <i className="fas fa-times" onClick={() => this.props.close()}></i>
                </div>
                <div className='green-top'>
                    <div className='container  justify-content-center'>
                        <Row>
                            <Col xs={12} sm={10} className="align-self-sm-center" > {word.new_recommendations}</Col>
                        </Row>
                    </div>
                </div>
                <div className='container'>
                    <Row>
                        <Col xs={12} sm={10}>
                            {this.state.form.map((item, index) => {
                                if (item.type === "textarea") {
                                    return this._rederTextArea(item, index)
                                }
                                if (item.type === "dropDown" && !this.state.select_all) {
                                    return this._renderDropDown(item, index)
                                }
                                return null

                            })}
                            <CheckboxFilter title="Տեսանելի բոլորի համար"
                                my_task={this.state.visible_for_client}
                                onChange={() => {
                                    this.setState({ visible_for_client: !this.state.visible_for_client })
                                }}
                            />
                            <label className="cont">Ընտրել բոլոր կազմակերպությունները
                                <input value={this.state.select_all} onChange={() => this.setState({ select_all: !this.state.select_all })} type="checkbox" />
                                <span className="checkmark"></span>
                            </label>
                            <div>
                                Վերջնաժամկետ  <br />
                                <DateTimePicker
                                    onChange={this.handleChangeDate}
                                    value={this.state.end_date}
                                />
                            </div>

                            <div className='img-icon-cont'>
                                <div className='img-cont'>
                                    {this.state.images.map((item, index) => {
                                        return index < 4 ? <div className='img' key={index}><span className='icon-Photos'></span><span className='images-name'>{item.name}</span></div> : "..."
                                    })}
                                </div>
                                <label>
                                    <span className='icon-Attachment'></span>
                                    <input type="file" className='input-icon' onChange={(e) => {
                                        let reader = new FileReader();
                                        let file = e.target.files[0] ? e.target.files[0] : this.state.images[this.state.images.length - 1]
                                        reader.onloadend = () => {
                                            this.setState((prevSate) => {
                                                return file !== this.state.images[this.state.images.length - 1] ? prevSate.images.push(file) : this.state.images
                                            })
                                        }
                                        reader.readAsDataURL(file)
                                    }} />
                                </label>
                            </div>
                            <div className='line-blue'></div>
                            {this.state.disabled ? <div className="disable-loader"><Loader
                                type="Oval"
                                color="#101C2A"
                                height={30}
                                width={30}
                            /></div> : null}
                            <div className='button-line'>
                                <BlueButton disabled={this.state.disabled}
                                    title={word.create}
                                    buttonStyle={!this.state.disabled ? "blue-button" : "blue-button blue-button-disabled"}
                                    onChangeValue={() => this.submite()}
                                />
                            </div>

                        </Col>
                    </Row>
                </div>

            </div>
        );
    }
}
export default connect(
    (state) => ({
        word: state.word, show: state.showReducer,
        login: state.loginReducer,
        stuff: state.stuff.results,
        manager: state.manager.array_manager.results,
        limit_data: state.limit_data,
        myData: state.loginReducer,
    }),
    (dispatch) => ({
        getUserInfo: (data) => dispatch(employeeAction(data)),
        getOrg: (data) => dispatch(orgAction(data)),
        getStuff: (data) => dispatch(stuffAction(data)),
        getManager: (data) => dispatch(employeeManagerAction(data))
    })
)(NewTaskMuchOrgs);