import React, { Component } from 'react';
import { Row, Col } from 'react-bootstrap';
import BlueButton from "../../../components/BlueButton/BlueButton";
import { TextField } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
// import DateTimePicker from 'react-datetime-picker';
import moment from 'moment';
import 'moment/locale/hy-am';
import { employeeManagerAction, getOrg, multiNewRepeatedTask, getTaskTemplate } from "../../../api";
import { employeeAction, orgAction, stuffAction, get_stuff_limit, get_org_limit, get_task_template } from "../../../action";
import { connect } from 'react-redux';
import Loader from 'react-loader-spinner';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import {
    withStyles,
} from '@material-ui/core/styles';
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
class NewRepeatedTaskMuchOrgs extends Component {
    constructor(props) {
        super(props);
        this.state = {
            select_all: false,
            end_date: new Date(),
            form: [

                {
                    key: 'name',
                    value: "",
                    errorMessage: "empty_error",
                    type: "text",
                    label: "",
                },
                {
                    key: 'text',
                    value: "",
                    errorMessage: "empty_error",
                    type: "text",
                    label: "",
                },
                {
                    key: 'duration',
                    value: "",
                    errorMessage: "empty_error",
                    type: "number",
                    label: "",
                },
                {
                    key: 'repeated_type',
                    value: "",
                    errorMessage: "empty_error",
                    type: "dropDown",
                    option: [{
                        name: "daily",
                        value: 1
                    },
                    {
                        name: "weekly",
                        value: 2
                    },
                    {
                        name: "monthly",
                        value: 3
                    },
                    {
                        name: "annual",
                        value: 4
                    }
                    ],
                    label: "",
                },
                {
                    key: 'repeated_value',
                    value: "",
                    errorMessage: "respective_error",
                    type: "number",
                    label: "",
                },
                {
                    key: 'company',
                    value: "",
                    option: "orgs",
                    errorMessage: "select_error",
                    type: "dropDown",
                    label: "",
                },
                // {
                //     key: 'accountant',
                //     value: "",
                //     option: "stuff",
                //     errorMessage: "select_error",
                //     type: "dropDown",
                //     label: "",
                // },
            ],
            imagePreviewUrl: '',
            images: [],
        }
    }
    success_notify = () => toast.success(this.props.word.success_process, {
        position: toast.POSITION.TOP_CENTER
    });
    error_notify = () => toast.error(this.props.word.error_process, {
        position: toast.POSITION.TOP_CENTER
    });
    _get_repeated_type_by_number(number) {
        switch (number) {
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
    componentDidMount() {
        let token = localStorage.getItem("token");
        getTaskTemplate(token)
            .then((res) => {
                this.props.get_task_template(res)
            })
        getOrg({ limit: 1000 })
            .then((res) => this.props.getLimitOrg(res.results))
    }
    companyPage = 0
    keyPress(e) {
        if (e.key === "Enter") {
            this.submite()
        }
    }
    get_repeated_type() {
        let repeated_type = "";
        let index = 0;
        for (let i = 0; i < this.state.form.length; i++) {
            if (this.state.form[i].key === "repeated_type") {
                index = i
            }
        }
        repeated_type = this.state.form[index].value
        return parseInt(repeated_type, 10)
    }
    set_interval(min, max, item) {
        if (min <= parseInt(item.value, 10) && parseInt(item.value, 10) <= max) {
            return true
        } else {
            return false
        }
    }
    onChange(e, item, index) {
        e.preventDefault();
        item.value = e.target.value
        let valid = false;
        switch (item.type) {
            case "number":
                if (this.get_repeated_type() === 2) {
                    valid = this.set_interval(1, 7, item)
                }
                if (this.get_repeated_type() === 3) {
                    valid = this.set_interval(1, 31, item)
                }
                if (this.get_repeated_type() === 4) {
                    valid = this.set_interval(1, 366, item)
                }
                if (item.key === "duration") {
                    valid = item.value > 0 && item.value.length < 4
                }
                break
            case "text":
                valid = item.value.length > 0
                break;
            default:
        }
        item.valid = valid
        this.setState({ form: this.state.form })
    }
    submite() {
        let token = localStorage.getItem("token")
        let url = this.props.myData.url;
        let profession = localStorage.getItem("profession");
        let company = this.state.form[this.state.form.length - 1].value;
        let postCompany = []
        let end_date = moment(this.state.end_date).format("YYYY-MM-DD HH:mm:ss");
        let creator = this.props.login.user.url
        let formData = new FormData();
        this.setState({
            submited: true, disabled: true
        })
        for (let index = 0; index < company.length; index++) {
            const element = company[index];
            postCompany.push(element.value)
        }
        for (let index = 0; index < (parseInt(this.state.form[3].value, 10) === 1 ? this.state.form.length - 1 : this.state.form.length); index++) {
            const element = this.state.form[index];
            if (!element.valid && this.state.select_all !== true && element.key !== "company") {
                this.setState({ disabled: false })
                return
            } else if (index !== this.state.form.length - 1) {
                formData.append(element.key, element.value)
            }
        }
        formData.append("creator", creator)
        formData.append(profession, url)
        formData.append("is_active", true)
        formData.append("company", postCompany)
        formData.append("selectAll", this.state.select_all)
        // formData.append("end_date", end_date)
        if (end_date) {
            formData.append("end_date", end_date)
        }
        multiNewRepeatedTask(token, formData)
            .then((res) => {
                if (res.error) {
                    this.error_notify()
                    this.setState({
                        disabled: false
                    })
                } else {
                    this.success_notify()
                    this.props.close()
                    this.props.getRepeatedtask()
                }
            })
            .catch((error) => {
                console.log(error);
            })
    }
    _renderDropDown(item, index) {
        if (item.key === "repeated_type") {
            return <div key={index} className={!item.valid && this.state.submited ? "input-validation input-validation-valid" : "input-validation"}><Autocomplete
                id="combo-box-demo"
                options={item.option}
                getOptionLabel={option => this.props.word[option.name]}
                onChange={(e, value) => {
                    item.active = false
                    item.value = value ? value.value : ""
                    item.valid = (item.value === 1 || item.value === 2 || item.value === 3 || item.value === 4) ? true : false
                    if (item.value === 1) {
                        this.state.form[index + 1].valid = true
                    }
                    this.setState({ form: this.state.form })
                }}
                renderInput={params => (
                    <TextField {...params} label={this.props.word[item.key]}
                        onKeyDown={(e) => { this.keyPress(e) }}
                        error={!item.valid && this.state.submited}
                        id={!item.valid && this.state.submited === true ? "validation-outlined-input" : "outlined-helperText"}
                        variant="outlined" fullWidth />
                )}
            />
                {(!item.valid && this.state.submited) ? <div className='validation valid-center'>{this.props.word[item.errorMessage]}</div> : null}
            </div>
        } else if (item.key === "manager" || item.key === "accountant") {
            const animatedComponents = makeAnimated();
            let option = this.props.limit_data[item.option]
            return <div key={index} className={!item.valid && this.state.submited ? "input-validation input-validation-valid" : "input-validation"}>
                {option ? <Select
                    closeMenuOnSelect={false}
                    components={animatedComponents}
                    options={option}
                    onChange={(list) => {
                        // item.active = false
                        // item.value = value ? value.url : ""
                        // item.valid = item.value.length > 0
                        // this.setState({ form: this.state.form })
                        // this.onChangeSelectCompany(list) naxord
                    }}
                    placeholder={this.props.word[item.key]}
                    isMulti
                /> : null}
                {(!item.valid && this.state.submited) ? <div className='validation valid-center'>{this.props.word[item.errorMessage]}</div> : null}
            </div>
        } else {
            const animatedComponents = makeAnimated();
            let option = this.props.limit_data[item.option]
            // option = this.props[item.option]
            return <div key={index} className={!item.valid && this.state.submited ? "input-validation input-validation-valid" : "input-validation"}>
                {option && !this.state.select_all ? <Select
                    // defaultValue={this.getNameById(limit_data.orgs, this.params.get("id"))}
                    isLoading={this.props.limit_data.loader_orgs}
                    closeMenuOnSelect={false}
                    components={animatedComponents}
                    options={option}
                    onChange={(list) => {
                        item.active = false
                        item.value = list
                        item.valid = item.value.length > 0
                        this.setState({ form: this.state.form })
                        // this.onChangeSelectCompany(list) naxord
                    }}
                    placeholder={this.props.word[item.key]}
                    isMulti
                /> : null}
                {(!item.valid && this.state.submited) ? <div className='validation valid-center'>{this.props.word[item.errorMessage]}</div> : null}
            </div>
        }
    }
    _renderInput(item, index) {
        return !(this.get_repeated_type() === 1 && item.key === "repeated_value") ? <div className={!item.valid && this.state.submited ? "input-validation input-validation-valid" : "input-validation"} key={index}>
            <ValidationTextField
                type={item.type}
                name={item.key} value={item.value}
                onChange={(e) => {
                    this.onChange(e, item, index)
                }}
                onBlur={() => {
                    item.active = false;
                    this.setState({ form: this.state.form })
                }}
                onFocus={() => {
                    item.active = true;
                    this.setState({ form: this.state.form })
                }}
                onKeyDown={(e) => this.keyPress(e)}
                label={this.props.word[item.key]}
                multiline={true}
                maxLength={20}
                variant="outlined"
                error={!item.valid && this.state.submited}
                id={!item.valid && this.state.submited === true ? "validation-outlined-input" : "outlined-helperText"}
            />
            {(!item.valid && this.state.submited) ? <div className='validation valid-center'>{this.props.word[item.errorMessage]}</div> : null}
        </div> : null
    }
    render() {
        const { word, taskTemplate } = this.props
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
                            <div className="input-validation">
                                <Autocomplete
                                    loading={taskTemplate && taskTemplate.length > 0 ? false : true}
                                    loadingText={<div className="auto-complete-loader"><Loader
                                        type="Oval"
                                        color="#101C2A"
                                        height={15}
                                        width={15}
                                    /></div>}
                                    id="combo-box-demo"
                                    options={taskTemplate}
                                    onChange={(e, value) => {
                                        this.setState((prevState) => {
                                            let tmp = prevState.form
                                            tmp.map((item) => {
                                                if (item.key === "name") {
                                                    item.value = value ? value.name : "",
                                                        item.valid = true
                                                }
                                            })
                                            return {
                                                ...prevState,
                                                form: tmp,
                                                template_id: value ? value.id : 0
                                            }
                                        })
                                    }}
                                    getOptionLabel={option => {
                                        return option.name
                                    }}
                                    renderInput={params => (
                                        <TextField {...params}
                                            label="Ընտրել առաջադրանքի վերնագիր"
                                            variant="outlined" fullWidth
                                            onKeyDown={(e) => { this.keyPress(e) }} />
                                    )}
                                />
                            </div>
                            {this.state.form.map((item, index) => {
                                if (item.type === "dropDown") {
                                    return this._renderDropDown(item, index)
                                }
                                return this._renderInput(item, index);
                            })}
                            <label className="cont">Ընտրել բոլոր կազմակերպությունները
                                <input value={this.state.select_all} onChange={() => this.setState({ select_all: !this.state.select_all })} type="checkbox" />
                                <span className="checkmark"></span>
                            </label>
                            {/* <div className="end-date-add">
                                Վերջնաժամկետ
                                <DateTimePicker
                                    onChange={this.handleChangeDate}
                                    value={this.state.end_date}
                                />
                            </div> */}
                            <div className='line-blue'></div>
                            {this.state.disabled ? <div className="disable-loader"><Loader
                                type="Oval"
                                color="#101C2A"
                                height={30}
                                width={30}
                            /></div> : null}
                            <div className='button-line'>
                                <BlueButton
                                    disabled={this.state.disabled}
                                    buttonStyle={!this.state.disabled ? "blue-button" : "blue-button blue-button-disabled"}
                                    title={word.create}
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
        login: state.loginReducer, organization: state.organization.results,
        stuff: state.stuff.results,
        manager: state.manager.array_manager.results,
        limit_data: state.limit_data,
        myData: state.loginReducer,
        taskTemplate: state.taskTemplate,
    }),
    (dispatch) => ({
        getUserInfo: (data) => dispatch(employeeAction(data)),
        getOrg: (data) => dispatch(orgAction(data)),
        getStuff: (data) => dispatch(stuffAction(data)),
        getManager: (data) => dispatch(employeeManagerAction(data)),
        getLimitOrg: (data) => dispatch(get_org_limit(data)),
        getLimitStuff: (data) => (dispatch(get_stuff_limit(data))),
        get_task_template: (data) => dispatch(get_task_template(data))
    })
)(NewRepeatedTaskMuchOrgs);