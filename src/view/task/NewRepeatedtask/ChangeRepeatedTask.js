import React, { Component } from 'react';
import { Row, Col } from 'react-bootstrap';
import BlueButton from "../../../components/BlueButton/BlueButton";
import { employeeManagerAction, getStuff, ChangeRepeatedTask, newRepeatedTask } from "../../../api";
import { employeeAction, stuffAction } from "../../../action";
import { connect } from 'react-redux';
import Loader from 'react-loader-spinner';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { TextField } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CheckboxFilter from "../../../components/CheckboxFilter";
class ChangeRepeatedtask extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible_for_client: this._getValue(this.props.data, "visible_for_client"),
            form: [
                {
                    key: 'company',
                    value: this.props.data ? this._getValue(this.props.data, "company") : "",
                    option: "organization",
                    errorMessage: "select_error",
                    type: "dropDown",
                    label: this._getValue(this.props.data, "company_name"),
                    valid: true,
                },
                {
                    key: localStorage.getItem("profession") === "manager" ? 'accountant' : "manager",
                    value: this.props.data ? this._getValue(this.props.data, 'accountant') : "",
                    option: localStorage.getItem("profession") !== "accountant" ? "stuff" : "manager",
                    errorMessage: "select_error",
                    type: "dropDown",
                    label: this.props.data ? `${this._getValue(this.props.data, "accountant_first_name")}, ${this._getValue(this.props.data, "accountant_last_name")}` : "",
                    valid: true
                },
                {
                    key: 'name',
                    value: this.props.data ? this._getValue(this.props.data, "name") : "",
                    errorMessage: "empty_error",
                    type: "text",
                    label: "",
                    valid: true
                },
                {
                    key: 'text',
                    value: this.props.data ? this._getValue(this.props.data, "text") : "",
                    errorMessage: "empty_error",
                    type: "text",
                    label: "",
                    valid: true
                },
                {
                    key: 'duration',
                    value: this.props.data ? this._getValue(this.props.data, "duration") : null,
                    errorMessage: "respective_error",
                    type: "number",
                    label: "",
                    valid: true
                },
                {
                    key: 'repeated_type',
                    value: this.props.data ? this._getValue(this.props.data, "repeated_type") : "",
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
                    label: this.props.data ? this._get_repeated_type_by_number(this._getValue(this.props.data, "repeated_type")) : "",
                    valid: true
                },
                {
                    key: 'repeated_value',
                    value: this.props.data ? this._getValue(this.props.data, "repeated_value") : "",
                    errorMessage: "respective_error",
                    type: "number",
                    label: "",
                    valid: true
                },
            ],
            imagePreviewUrl: '',
            images: [],
            active: this.props.data ? this._getValue(this.props.data, "is_active") : true
        }
    }
    getSelected(array, name) {
        // let name_list = name.split(",")
        let ind = -1
        if (array) {
            for (let index = 0; index < array.length; index++) {
                const element = array[index];
                if (!name) {
                    if ((element.user.last_name === this.props.data.accountant_last_name) && (element.user.first_name === this.props.data.accountant_first_name)) {
                        ind = index
                    }
                    if (element.url === this.props.data.manager) {
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
    success_notify = () => toast.success(this.props.word.success_process, {
        position: toast.POSITION.TOP_CENTER
    });
    error_notify = () => toast.error(this.props.word.error_process, {
        position: toast.POSITION.TOP_CENTER
    });
    _get_repeated_type_by_number(number) {
        switch (number) {
            case 1:
                return "daily"
            case 2:
                return "weekly"
            case 3:
                return "monthly"
            case 4:
                return "annual"
            default:
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
    componentDidMount() {
        // this.getStuff()
        // this.getOrg()
    }
    companyPage = 0
    getStuff() {
        let token = localStorage.getItem("token")
        getStuff(token, 1000)
            .then((res) => this.props.getStuff(res))
    }
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
    get_repeated_type() {
        let repeated_type = "";
        let index = 0;
        for (let i = 0; i < this.state.form.length; i++) {
            if (this.state.form[i].key === "repeated_type") {
                index = i
            }
        }
        repeated_type = this.state.form[index].value
        return repeated_type
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
        item.valid = valid;
        this.setState({ form: this.state.form })
    }
    submite() {
        let token = localStorage.getItem("token")
        // let id = localStorage.getItem("id");
        let id_task = this.props.data.id;
        let url = this.props.myData.url;
        let profession = localStorage.getItem("profession");
        let formData = new FormData();
        this.setState({
            submited: true, disabled: true
        })
        for (let index = 0; index < (parseInt(this.state.form[5].value, 10) === 1 ? this.state.form.length - 1 : this.state.form.length); index++) {
            const element = this.state.form[index];
            if (!element.valid) {
                this.setState({ disabled: false })
                return
            }
            formData.append(element.key, element.value)
        }
        formData.append(profession, url);
        formData.append("is_active", this.state.active);
        formData.append("visible_for_client", this.state.visible_for_client);
        if (this.props.copy) {
            let creator = this.props.login.user.url;
            formData.append("creator", creator)
            newRepeatedTask(token, formData)
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
        } else {
            ChangeRepeatedTask(token, formData, id_task)
                .then((res) => {
                    if (res.error) {
                        this.error_notify()
                        this.setState({
                            disabled: false
                        })
                    } else {
                        this.props.close()
                        this.success_notify()
                        this.props.getRepeatedTaskData()
                    }
                })
                .catch((error) => {
                })
        }
    }
    _renderDropDown(item, index) {
        let option = this.props[item.option]
        let object = this.getSelected(this.props[item.option], item.label)
        if (item.key === "repeated_type") {
            return <div key={index} className="input-validation"><Autocomplete
                id="combo-box-demo"
                options={item.option}
                defaultValue={this.getSelected(item.option, item.label)}
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
                        variant="outlined" fullWidth value={item.label} />
                )}
            />
                {(!item.valid && (this.state.submited || item.active)) ? <div className='validation valid-center'>{this.props.word[item.errorMessage]}</div> : null}
            </div>
        }
        else if (item.key === "manager" || item.key === "accountant") {
            return <div key={index} className="input-validation"><Autocomplete
                id="combo-box-demo"
                defaultValue={this.getSelected(this.props[item.option])}
                options={option}
                onChange={(e, value) => {
                    item.active = false
                    item.value = value ? value.url : ""
                    item.valid = item.value.length > 0
                    this.setState({ form: this.state.form })
                }}
                getOptionLabel={option => {
                    return `${option.user.first_name} ${option.user.last_name}`
                }}
                renderInput={params => (
                    <TextField {...params} label={this.props.word[item.key]}
                        onChange={(e) => {
                        }}
                        variant="outlined" fullWidth />
                )}
            />
                {(!item.valid && (this.state.submited || item.active)) ? <div className='validation valid-center'>{this.props.word[item.errorMessage]}</div> : null}
            </div>
        }
        else {
            return <div key={index} className="input-validation"><Autocomplete
                id="combo-box-demo"
                defaultValue={object}
                options={option}
                loading={option ? false : true}
                loadingText={<div className="auto-complete-loader"><Loader
                    type="Oval"
                    color="#101C2A"
                    height={20}
                    width={20}
                /></div>}
                getOptionLabel={option => option.name}
                onChange={(e, value) => {
                    item.active = false
                    item.value = value ? value.url : ""
                    item.valid = item.value.length > 0
                    this.setState({ form: this.state.form })
                }}
                renderInput={params => (
                    <TextField {...params} label={this.props.word[item.key]}
                        value={item.label}
                        variant="outlined" fullWidth />
                )}
            />
                {(!item.valid && (this.state.submited || item.active)) ? <div className='validation valid-center'>{this.props.word[item.errorMessage]}</div> : null}
            </div>
        }
    }
    _renderInput(item, index) {
        return !(this.get_repeated_type() === 1 && item.key === "repeated_value") ? <div className='input-validation' key={index}>
            <TextField
                type={item.type}
                variant="outlined"
                label={this.props.word[item.key]}
                fullWidth={true}
                multiline={item.key === "text" ? true : false}
                maxLength={20}
                onKeyDown={(e) => this.keyPress(e)}
                // color={theme.palette.secondary}
                // placeholder={this.props.word[item.key]} 
                name={item.key}
                value={item.value}
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
            />
            {(!item.valid && (this.state.submited || item.active)) ? <div className='validation valid-center'>{this.props.word[item.errorMessage]}</div> : null}
        </div> : null
    }
    render() {
        // let { imagePreviewUrl } = this.state;
        // let $imagePreview = null;
        // if (imagePreviewUrl !== "") {
        //     $imagePreview = (<img className='recommendations-image' src={imagePreviewUrl} />);
        // }
        const { word } = this.props
        return (
            <div className='new-recommendation'>
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
                                if (item.type === "dropDown") {
                                    return this._renderDropDown(item, index)
                                }
                                return this._renderInput(item, index);
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
                                        return index < 4 ? <div className='img' key={index}><span className='icon-Photos'></span><span className='images-name'>{item.name}</span></div> : "..."
                                    })}
                                </div>
                            </div>
                            <label className="cont">{this.props.word.active}
                                <input onChange={() => this.setState({ active: !this.state.active })} type="checkbox"
                                    value={this.state.active} onKeyDown={(e) => this.keyPress(e)}
                                    checked={this.state.active}
                                />

                                <span className="checkmark"></span>
                            </label>
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
                                    title={this.props.copy ? word.create : word.edit}
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
        myData: state.loginReducer
    }),
    (dispatch) => ({
        getUserInfo: (data) => dispatch(employeeAction(data)),
        // getOrg: (data) => dispatch(orgAction(data)),
        getStuff: (data) => dispatch(stuffAction(data)),
        getManager: (data) => dispatch(employeeManagerAction(data))
    })
)(ChangeRepeatedtask);