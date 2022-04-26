import React, { Component } from 'react';
import { Row, Col } from 'react-bootstrap';
import BlueButton from "../../../components/BlueButton/BlueButton";
import CheckboxFilter from "../../../components/CheckboxFilter";
import { TextField } from '@material-ui/core';
import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete';
import moment from 'moment';
import 'moment/locale/hy-am';
import {
    withStyles,
} from '@material-ui/core/styles';
import {
    newTask, employeeManagerAction, getTaskTemplate,
    getStuff, getOrg, newTaskByAccountant
} from "../../../api";
import { employeeAction, orgAction, stuffAction, get_task_template } from "../../../action";
import { connect } from 'react-redux';
import Loader from 'react-loader-spinner';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import DateTimePicker from 'react-datetime-picker';
// import Stack from '@mui/material/Stack';
import "react-datepicker/dist/react-datepicker.css";
import { SERVER } from "../../../config";
const profession = localStorage.getItem("profession");
const filter = createFilterOptions();
const date_now = new Date();
const year = date_now.getFullYear();
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
class NewRecommendation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dispatch: false,
            submited: false,
            for_me: false,
            template_id: 0,
            visible_for_client: true,
            end_date: null,
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
                    option: "organization",
                    errorMessage: "select_error",
                    type: "dropDown",
                    label: "",
                    valid: true
                },
                {
                    key: "manager",
                    value: "",
                    option: "manager",
                    errorMessage: "select_error",
                    type: "dropDown",
                    label: "",
                },
                {
                    key: 'accountant',
                    value: "",
                    option: "stuff",
                    errorMessage: "select_error",
                    type: "dropDown",
                    label: ""
                },
            ],
            imagePreviewUrl: '',
            images: [],
        }
    }
    companyPage = 0
    success_notify = () => toast.success(this.props.word.success_process, {
        position: toast.POSITION.TOP_CENTER
    });
    error_notify = () => toast.error(this.props.word.error_process, {
        position: toast.POSITION.TOP_CENTER
    });
    componentDidMount() {
        let token = localStorage.getItem("token")
        getTaskTemplate(token)
            .then((res) => {
                this.props.get_task_template(res)
            })
        if (this.props.stuff.length > 0 && localStorage.getItem("profession") === "accountant") {
            this.setState((prevState) => {
                for (let index = 0; index < prevState.form.length; index++) {
                    const element = prevState.form[index];
                    if (element.key === "accountant") {
                        let list = [];
                        let new_list = this.props.stuff.filter((item) => {
                            return item.id === +localStorage.getItem("id")
                        });
                        list.push({ label: `${new_list[0].user.first_name} ${new_list[0].user.last_name}`, value: new_list[0].id })
                        element.value = list;
                    }
                }
                return prevState
            })
        }
    }
    getStuff() {
        let token = localStorage.getItem("token")
        getStuff(token, 1000)
            .then((res) => this.props.getStuff(res))
    }
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
    handleChangeDate = e => {
        this.setState({ end_date: e.target.value })
    }
    submite() {
        let token = localStorage.getItem("token")
        let url = this.props.myData.url
        let images = this.state.images;
        let created_date = new Date().toLocaleString("en-US", { timeZone: "Asia/Yerevan" })
        let formData = new FormData();
        let creator = this.props.login.user.url;
        let multi_accountant = this.state.for_me ? [] : this.state.form[this.state.form.length - 1].value;
        this.setState({
            submited: true, disabled: true
        })
        for (let i = 0; i < images.length; i++) {
            formData.append(`file${i + 1}`, images[i], images[i].name)
        }
        for (let index = 0; index < this.state.form.length - 1; index++) {
            const element = this.state.form[index];

            if (element.key === "manager" && profession === "accountant" && index === 4) {
                continue
            }
            if (element.key === "manager" && profession === "manager" && index === 3) {
                formData.append(element.key, element.value)
                continue
            }
            if (!element.valid) {
                this.setState({ disabled: false })
                return
            }
            formData.append(element.key, element.value)
        }
        if (profession === "manager" && !this.state.form[3].valid && !this.state.form[4].valid) {
            this.setState({ disabled: false })
            return
        }
        // if (profession === "accountant") {
        //     formData.append(profession, url)
        //     // formData.append(`manager`, this.state.form[this.state.form.length - 1].value)
        // }
        formData.append("created_date", moment(created_date).format("YYYY-MM-DD HH:mm:ss"));
        formData.append("creator", creator);
        formData.append("template_id", this.state.template_id);
        formData.append("visible_for_client", this.state.visible_for_client);
        if (this.state.end_date) {
            formData.append("end_date", moment(this.state.end_date).format("YYYY-MM-DD HH:mm:ss"))
        }
        if (this.props.subTask) {
            formData.append("parent_task", this.props.task.url)
        }
        // if (profession === "manager" && !this.state.for_me) {
        formData.append(`manager`, this.state.form[3].value ? this.state.form[3].value : this.props.myData.url)
        if (multi_accountant.length > 0) {
            for (let index = 0; index < multi_accountant.length; index++) {
                const element = multi_accountant[index];
                formData.append(`accountant`, `${SERVER}accountant/${element.value}/`)
                this.newTaskByAccountant(token, formData)
            }
        } else {
            this.newTaskByAccountant(token, formData)
        }
        // } else {
        //     // formData.append(`manager`, this.state.form[this.state.form.length - 1].value)
        //     this.newTaskByAccountant(token, formData)
        // }
    }


    newTaskByAccountant(token, formData) {
        newTaskByAccountant(token, formData)
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
    }

    _renderDropDown(item, index) {
        const animatedComponents = makeAnimated();
        let option = this.props[item.option]
        return <div key={index}
            className={!item.valid
                && this.state.submited
                && !this.state.form[3].valid
                && !this.state.form[4].valid
                ? "input-validation input-validation-valid"
                : "input-validation"}>
            {(item.key === "accountant") ?
                <Select
                    isDisabled={this.state.for_me}
                    closeMenuOnSelect={false}
                    value={item.value}
                    components={animatedComponents}
                    options={this.props.limit_data[item.option]}
                    className={!item.valid
                        && (this.state.submited || item.active)
                        && !this.state.form[this.state.form.length - 2].valid
                        ? "error-select"
                        : ""}
                    onChange={(list) => {
                        let select_all_index = null;
                        if (list) {
                            for (let index = 0; index < list.length; index++) {
                                const element = list[index];
                                if (element.value === "*") {
                                    select_all_index = index;
                                }
                            }
                        }
                        let array = !list || list.length === 0 ? [] : list
                        let select_list = (array.length > 0 && select_all_index !== null)
                            ? [...this.props.limit_data[item.option]]
                            : array;
                        item.value = select_list;
                        item.active = false
                        item.valid = item.value && item.value.length > 0
                        this.setState({ form: this.state.form })
                    }}
                    placeholder={this.props.word[item.key]}
                    isMulti
                /> :
                <Autocomplete
                    loading={option.length > 0 ? false : true}
                    loadingText={<div className="auto-complete-loader"><Loader
                        type="Oval"
                        color="#101C2A"
                        height={15}
                        width={15}
                    /></div>}
                    id="combo-box-demo"
                    disabled={this.state.form[4].value.length > 0 && item.key === "manager" && profession === "manager"}
                    options={item.option === "organization" ? option.filter(item => item.is_deleted_by_manager === false) : option}
                    onChange={(e, value) => {
                        item.active = false
                        item.value = value ? value.url : ""
                        item.valid = item.value.length > 0
                        if (item.key === "manager" && value && profession === "manager") {
                            this.setState({ form: this.state.form, for_me: true })
                        } else if (item.key === "manager" && !value) {
                            this.setState({ form: this.state.form, for_me: false })
                        }
                        else {
                            this.setState({ form: this.state.form })
                        }
                    }}
                    getOptionLabel={option => {
                        return item.key === "manager" ? `${option.user.first_name} ${option.user.last_name}` : option.name
                    }}
                    filterOptions={(options, params) => {
                        // if (params.inputValue.length >= 2) {
                        if (item.key !== "manager") {
                            const filtered = options.filter((item) => {
                                return (item.name.toUpperCase().includes(params.inputValue.toUpperCase()));
                            });
                            return filtered;
                        } else {
                            const filtered = options.filter((item) => (
                                (item.user.last_name.toUpperCase().includes(params.inputValue.toUpperCase())
                                    || item.user.first_name.toUpperCase().includes(params.inputValue.toUpperCase()))
                            ));
                            return filtered;
                        }
                    }}
                    renderInput={params => (
                        <TextField {...params} error={!item.valid && this.state.submited === true && !this.state.form[4].valid}
                            id={!item.valid && this.state.submited === true && !this.state.form[4].valid
                                ? "validation-outlined-input"
                                : "outlined-helperText"}
                            label={this.props.word[item.key]}
                            variant="outlined" fullWidth
                            freeSolo
                            onKeyDown={(e) => { this.keyPress(e) }} />
                    )}
                />}
            {(!item.valid && this.state.submited)
                ? <div className='validation valid-center'>{this.props.word[item.errorMessage]}</div>
                : null}
        </div>
    }
    _rederTextArea(item, index) {
        return <div className={!item.valid && this.state.submited
            ? "input-validation input-validation-valid"
            : "input-validation"}
            key={index} >
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
                multiline={true}
                variant="outlined"
                error={!item.valid && this.state.submited}
                id={!item.valid && this.state.submited === true
                    ? "validation-outlined-input"
                    : "outlined-helperText"}
            />
            {(!item.valid && this.state.submited)
                ? <div className='validation valid-center'>{this.props.word[item.errorMessage]}</div>
                : null}
        </div>
    }
    _delete_photos(item) {
        this.setState(prevState => ({
            images: prevState.images.filter(el => el.name !== item.name)
        }));
    }
    render() {
        const { word, taskTemplate } = this.props;
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
                                    loading={taskTemplate.length > 0 ? false : true}
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
                                if (item.type === "textarea") {
                                    return this._rederTextArea(item, index)
                                }
                                if (item.type === "dropDown") {
                                    return this._renderDropDown(item, index)
                                }
                                return null
                            })}
                            {/* <div className="end-date-add">
                                Վերջնաժամկետ */}
                            {/* <DateTimePicker
                                    format="dd/MM/y HH:MM:ss"
                                    minDate={new Date()}
                                    maxDate={new Date(9999, 12, 31)}
                                    onChange={this.handleChangeDate}
                                    value={this.state.end_date ? new Date(this.state.end_date) : null}
                                /> */}
                            <div className='input-validation'>
                                <TextField
                                    // disabled
                                    id="datetime-local"
                                    label="Վերջնաժամկետ"
                                    type="datetime-local"
                                    onChange={this.handleChangeDate}
                                    variant="outlined"
                                    InputProps={{ inputProps: { min: moment(new Date()).format("YYYY-MM-DDTHH:mm") } }}
                                    sx={{ width: 250 }}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </div>
                            <CheckboxFilter title="Տեսանելի բոլորի համար"
                                my_task={this.state.visible_for_client}
                                onChange={() => {
                                    this.setState({ visible_for_client: !this.state.visible_for_client })
                                }}
                            />
                            {/* </div> */}
                            <div className='img-icon-cont'>
                                <div className='img-cont'>
                                    {this.state.images.map((item, index) => {
                                        return <div className='img' key={index}>
                                            <span className={(item.type === "image/jpeg") || (item.type === "image/png") ? 'icon-Photos' : "icon-files-empty"} />
                                            <span className='images-name'>{item.name}</span>
                                            <i className="fas fa-times" onClick={() => this._delete_photos(item)}></i>
                                        </div>
                                    })}
                                </div>
                                <label>
                                    <span className='icon-Attachment'></span>
                                    <input type="file" multiple className='input-icon' onChange={(e) => {
                                        let reader = new FileReader();
                                        let new_list = [];
                                        for (let i = 0; i < e.target.files.length; i++) {
                                            const element = e.target.files[i];
                                            new_list.push(element);
                                        }
                                        let new_file_list = [...this.state.images, ...new_list];
                                        this.setState({ images: new_file_list })
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
        organization: state.organization.results ? state.organization.results : [],
        stuff: state.stuff.results,
        manager: state.manager.array_manager.results,
        limit_data: state.limit_data,
        myData: state.loginReducer,
        taskTemplate: state.taskTemplate,
        task: state.taskReducer,
    }),
    (dispatch) => ({
        getUserInfo: (data) => dispatch(employeeAction(data)),
        getOrg: (data) => dispatch(orgAction(data)),
        getStuff: (data) => dispatch(stuffAction(data)),
        getManager: (data) => dispatch(employeeManagerAction(data)),
        get_task_template: (data) => dispatch(get_task_template(data))
    })
)(NewRecommendation);