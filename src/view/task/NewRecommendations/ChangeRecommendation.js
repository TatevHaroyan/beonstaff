import React, { Component } from 'react';
import { Row, Col } from 'react-bootstrap';
import BlueButton from "../../../components/BlueButton/BlueButton";
import { TextField } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import {
    withStyles,
} from '@material-ui/core/styles';
import {
    EditTask, newTaskByAccountant, employeeManagerAction,
    getOrg
} from "../../../api";
import { employeeAction, orgAction, stuffAction } from "../../../action";
import CheckboxFilter from '../../../components/CheckboxFilter';
import { connect } from 'react-redux';
import Loader from 'react-loader-spinner';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const ValidationTextField = withStyles({
    root: {
        '& textarea:valid + fieldset': {
            borderColor: '#63c0ba',
            borderWidth: 2,
        },
        '& textarea:invalid + fieldset': {
            borderColor: 'red',
            borderWidth: 2,
        },
        '& textarea:valid:focus + fieldset': {
            borderColor: '#63c0ba',
            borderLeftWidth: 6,
            padding: '4px !important', // override inline-style
        },
    },
})(TextField);
class ChangeRecommendation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dispatch: false,
            submited: false,
            visible_for_client: this.props.task ? this._getValue(this.props.task, "visible_for_client") : "",
            // select_all: false,
            // end_date: new Date(),
            form: [
                {
                    key: 'name',
                    value: this.props.task ? this._getValue(this.props.task, "name") : "",
                    errorMessage: "empty_error",
                    type: "textarea",
                    label: "",
                    valid: true,
                },
                {
                    key: 'text',
                    value: this.props.task ? this._getValue(this.props.task, "text") : "",
                    errorMessage: "empty_error",
                    type: "textarea",
                    label: "",
                    valid: true,
                },
                {
                    key: 'company',
                    value: this.props.task ? this._getValue(this.props.task, "company") : "",
                    option: "organization",
                    errorMessage: "select_error",
                    type: "dropDown",
                    label: this.props.task ? this._getValue(this.props.task, "company_name") : "",
                    valid: true,
                },
                // this.props.task ? this._getValue(this.props.task, localStorage.getItem("profession") === "manager" ? 'accountant' : "manager") : "",
                {
                    key: localStorage.getItem("profession") === "manager" ? 'accountant' : "manager",
                    value: this.props.task ? this._getValue(this.props.task, localStorage.getItem("profession") === "manager" ? 'accountant' : "manager") : "",
                    option: localStorage.getItem("profession") === "manager" ? "stuff" : "manager",
                    errorMessage: "select_error",
                    type: "dropDown",
                    label: this.props.task ? `${this._getValue(this.props.task, "accountant_first_name")}, ${this._getValue(this.props.task, "accountant_last_name")}` : "",
                    valid: true,
                },

            ],
            imagePreviewUrl: '',
            images: [],
        }
    }
    _getValue(data, key) {
        let result = data;
        let path = key.split(".")
        for (let index = 0; index < path.length; index++) {
            const element = path[index];
            result = result[element]
        }
        return result === data ? null : result;
    }
    // componentDidMount() {
    //     //     this.getStuff()
    //     this.getOrg()
    // }
    companyPage = 0
    success_notify = () => toast.success(this.props.word.success_process, {
        position: toast.POSITION.TOP_CENTER
    });
    error_notify = () => toast.error(this.props.word.no_changes, {
        position: toast.POSITION.TOP_CENTER
    });
    // getStuff() {
    //     let token = localStorage.getItem("token")
    //     getStuff(token, 1000)
    //         .then((res) => this.props.getStuff(res))
    // }
    getOrg() {
        let token = localStorage.getItem("token")
        getOrg(token, 1000)
            .then((res) => this.props.getOrg(res))
    }
    keyPress(e) {
        if (e.key === "Enter") {
            this.submite()
        }
    }
    handleChangeDate = date => {
        let date_get_time = date.getTime()
        let date_now = new Date()
        let new_date = this.state.new_date
        if (date_get_time > date_now) {
            new_date = date
        } else {
            new_date = date_now
        }
        this.setState({ end_date: new_date })
    }
    submite() {
        let token = localStorage.getItem("token")
        let url = this.props.myData.url
        let profession = localStorage.getItem("profession");
        let images = this.state.images;
        let formData = new FormData();
        let length = this.props.task.accountant ? this.state.form.length : this.state.form.length - 1
        this.setState({
            submited: true, disabled: true, loading: true
        })
        for (let i = 0; i < images.length; i++) {
            formData.append(`file${i + 1}`, images[i], images[i].name)
        }
        for (let index = 0; index < length; index++) {
            const element = this.state.form[index];
            if (!element.valid) {
                this.setState({ disabled: false, loading: false })
                return
            }
            //  else if (index !== this.state.form.length - 1) {
            formData.append(element.key, element.value)
            // }
        }
        formData.append(profession, url);
        formData.append("template_id", this.props.task.template_id ? this.props.task.template_id : 0);
        formData.append("visible_for_client", this.state.visible_for_client);
        if (this.props.copy) {
            let creator = this.props.login.user.url;
            formData.append("creator", creator)
            newTaskByAccountant(token, formData)
                .then((res) => {
                    if (res.error) {
                        this.error_notify()

                    } else {
                        this.success_notify()
                        this.props.close()
                    }
                    this.setState({
                        disabled: false,
                        loading: false
                    })
                })
                .catch((error) => {
                    console.log(error);
                })
        } else {
            EditTask(token, formData, this.props.task.id)
                .then((res) => {
                    if (res.error || res.change === false) {
                        this.error_notify()
                        this.setState({
                            disabled: false,
                            loading: false
                        })
                    } else {
                        this.setState({ loading: false, disabled: false, })
                        this.success_notify()
                        this.props.close()
                    }
                })
                .catch((error) => {
                    console.log(error);
                })
        }
    }
    getSelected(array, name) {
        let ind = -1
        if (array) {
            for (let index = 0; index < array.length; index++) {
                const element = array[index];
                if (!name) {
                    if (element.url === this.props.task.manager) {
                        ind = index
                    } else if ((element.user && element.user.last_name === this.props.task.accountant_last_name) && (element.user && element.user.first_name === this.props.task.accountant_first_name)) {
                        ind = index
                    }
                }
                else {
                    if (element.name === name) {
                        ind = index
                    }
                }


            }
            return array[ind]
        }
    }
    success_notify
    _renderDropDown(item, index) {
        let option = this.props[item.option].filter((el) => el.user.is_active)
        return <div key={index} className={!item.valid && this.state.submited ? "input-validation input-validation-valid" : "input-validation"}>
            <Autocomplete
                id="combo-box-demo"
                defaultValue={(item.key === "manager" || item.key === "accountant") ? this.getSelected(this.props[item.option]) : this.getSelected(this.props[item.option], item.label)}
                options={option}
                loading={option.length > 0 ? false : true}
                loadingText={<div className="auto-complete-loader"><Loader
                    type="Oval"
                    color="#101C2A"
                    height={20}
                    width={20}
                /></div>}
                onChange={(e, value) => {
                    item.active = false
                    item.value = value ? value.url : ""
                    item.valid = item.value.length > 0
                    this.setState({ form: this.state.form })
                }}
                getOptionLabel={option => {
                    return (item.key === "manager" || item.key === "accountant") ? `${option.user.first_name} ${option.user.last_name}` : option.name
                }}
                renderInput={params => (
                    <TextField {...params} error={!item.valid && this.state.submited} value={item.label}
                        id={!item.valid && this.state.submited === true ? "validation-outlined-input" : "outlined-helperText"}
                        label={this.props.word[item.key]}
                        onKeyDown={(e) => { this.keyPress(e) }}
                        variant="outlined" />
                )}
            />
            {(!item.valid && this.state.submited) ? <div className='validation valid-center'>{this.props.word[item.errorMessage]}</div> : null}
        </div>
    }
    _rederTextArea(item, index) {
        return <div className={!item.valid && this.state.submited ? "input-validation input-validation-valid" : "input-validation"} key={index} >
            <ValidationTextField
                onKeyDown={(e) => { this.keyPress(e) }}
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
                label={this.props.word[item.key]}
                // fullWidth={true}
                multiline={true}
                // maxLength={20}
                variant="outlined"
                error={!item.valid && this.state.submited}
                id={!item.valid && this.state.submited === true ? "validation-outlined-input" : "outlined-helperText"}
            />
            {(!item.valid && this.state.submited) ? <div className='validation valid-center'>{this.props.word[item.errorMessage]}</div> : null}
        </div>
    }
    _delete_photos(item) {
        this.setState(prevState => ({
            images: prevState.images.filter(el => el.name !== item.name)
        }));
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
                            <Col xs={12} sm={10} className="align-self-sm-center" > {this.props.copy ? word.new_recommendations : word.edit_task}</Col>
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
                                if (item.type === "dropDown") {
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
                            <div className='img-icon-cont'>
                                <div className='img-cont'>
                                    {this.state.images.map((item, index) => {
                                        return index < 4 ? <div className='img' key={index}><span className={(item.type === "image/jpeg") || (item.type === "image/png") ? 'icon-Photos' : "icon-files-empty"} /><span className='images-name'>{item.name}</span>
                                            <i className="fas fa-times" onClick={() => this._delete_photos(item)}></i></div> : "..."
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
                            {this.state.loading ? <div className="disable-loader"><Loader
                                type="Oval"
                                color="#101C2A"
                                height={30}
                                width={30}
                            /></div> : null}
                            <div className='button-line'>
                                <BlueButton disabled={this.state.disabled}
                                    title={this.props.copy ? word.create : word.edit}
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
        organization: state.organization.results ? state.organization.results.filter(item => item.is_deleted_by_manager === false) : [],
        stuff: state.stuff.results,
        manager: state.manager.array_manager.results,
        limit_data: state.limit_data,
        myData: state.loginReducer,
        task: state.taskReducer
    }),
    (dispatch) => ({
        getUserInfo: (data) => dispatch(employeeAction(data)),
        getOrg: (data) => dispatch(orgAction(data)),
        getStuff: (data) => dispatch(stuffAction(data)),
        getManager: (data) => dispatch(employeeManagerAction(data))
    })
)(ChangeRecommendation);