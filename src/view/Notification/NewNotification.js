import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col } from 'react-bootstrap';
import Button from "../../components/Button/Button";
import '../../assets/css/add.css';
import TextField from '@material-ui/core/TextField';
import "react-datepicker/dist/react-datepicker.css";
import { newNotification, getNotification } from "../../api/index";
import DateTimePicker from 'react-datetime-picker';
import "react-datepicker/dist/react-datepicker.css";
import { stuffAction } from "../../action";
import moment from 'moment';
import 'moment/locale/hy-am';
import Loader from 'react-loader-spinner';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import { toast } from 'react-toastify';
import Select from 'react-select';
import { SERVER } from "../../config";
import 'react-toastify/dist/ReactToastify.css'
// import { tr } from 'date-fns/esm/locale';
class NewNotification extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: "",
            description: "",
            imagePreviewUrl: '',
            images: [],
            date: new Date(),
            accountants_client: [],
            managers_client: []
        }
    }
    success_notify = () => toast.success(this.props.word.success_process, {
        position: toast.POSITION.TOP_CENTER
    });
    error_notify = () => toast.error(this.props.word.error_process, {
        position: toast.POSITION.TOP_CENTER
    });
    keyPress(e) {
        if (e.key === "Enter") {
            this.newNotification()
        }
    }
    handleChangeDate = e => {
        this.setState({ date: e.target.value })
    }
    newNotification() {
        let token = localStorage.getItem("token");
        let formData = new FormData();
        let id = localStorage.getItem("id")
        let images = this.state.images;
        let date = moment(this.state.date).format("YYYY-MM-DD HH:mm:ss");
        let accountants_client = [];
        for (let index = 0; index < this.state.accountants_client.length; index++) {
            const element = this.state.accountants_client[index];
            accountants_client.push(`${SERVER}accountant/${element.value}/`)
        }
        for (let index = 0; index < this.state.managers_client.length; index++) {
            const element = this.state.managers_client[index];
            formData.append(`managers_client`, `${SERVER}manager/${element.value}/`)
        }
        for (let i = 0; i < images.length; i++) {
            formData.append(`file${i + 1}`, images[i], images[i].name)
            // formData.append(`file_name${i + 1}`, images[i].name)
        }
        formData.append(`title`, this.state.title)
        formData.append(`description`, this.state.description)
        formData.append(`manager`, this.props.employee.url)
        formData.append(`date`, date)
        for (const key of accountants_client) {
            formData.append(`accountants_client`, key)
        }
        this.setState({
            disabled: true,
            loading: true,
            submited: true
        })
        if (this.state.title.length > 0 && (this.state.accountants_client.length > 0 || this.state.managers_client.length > 0)) {
            newNotification(token, formData)
                .then((res) => {
                    if (res.error) {
                        this.error_notify()
                        this.setState({
                            disabled: false,
                            loading: false,
                        })
                    } else {
                        this.setState({
                            disabled: false,
                            loading: false,
                        })
                        this.success_notify()
                        getNotification({ manager_neq: id, managers_client_eq: id })
                            .then((res) => {
                                this.props.close(res)
                            })
                    }
                })
        } else {
            this.setState({ disabled: false, loading: false })
        }
    }

    render() {
        const { word, multi_manager } = this.props
        // const animatedComponents = makeAnimated();
        const option = this.props.limit_data.stuff
        return (
            <div className='add'>
                <div className="tool-tip-cont">
                    <div className="tool-tip">Փակել</div>
                    <i className="fas fa-times" onClick={() => this.props.close()}></i>
                </div>
                <div className='green-top'>
                    <Col xs={12} sm={10}> Ծանուցում</Col>
                </div>
                <div className='container'>
                    <Row className="d-flex justify-content-around">
                        <Col xs={12} sm={10} className="align-items-sm-center">
                            <div className={this.state.title.length === 0 && this.state.submited ? "input-validation input-validation-valid" : "input-validation"}>
                                <TextField error={this.state.title.length === 0 && this.state.submited ? true : false}
                                    variant="outlined"
                                    multiline={true}
                                    id={this.state.title.length === 0 && this.state.submited ? "standard-error" : "standard-basic"}
                                    label="Վերնագիր"
                                    onKeyDown={(e) => this.keyPress(e)} name="title" value={this.state.title}
                                    onChange={(e) => {
                                        const { name, value } = e.target;
                                        let empty_error = this.state.empty_error
                                        if (value.length === 0) {
                                            empty_error = "Մուտքագրել տվյալներ"
                                        }
                                        // value.length === 0 ? empty_error = "Մուտքագրել տվյալներ" : ""
                                        this.setState({ [name]: value, empty_error })

                                    }} />
                                {(this.state.title.length === 0 && this.state.submited) ? <div className='validation valid-center'>Մուտքագրել տվյալներ</div> : null}
                            </div>
                            <div className={this.state.description.length === 0 && this.state.submited ? "input-validation input-validation-valid" : "input-validation"}>
                                <TextField error={this.state.description.length === 0 && this.state.submited ? true : false}
                                    multiline={true}
                                    variant="outlined"
                                    id={this.state.description.length === 0 && this.state.submited ? "standard-error" : "standard-basic"}
                                    label="Բովանդակություն"
                                    onKeyDown={(e) => this.keyPress(e)} name="description" value={this.state.description} onChange={(e) => {
                                        const { name, value } = e.target;
                                        let empty_error = this.state.empty_error
                                        if (value.length === 0) {
                                            empty_error = "Մուտքագրել տվյալներ"
                                        }
                                        // value.length === 0 ? empty_error = "Մուտքագրել տվյալներ" : ""
                                        this.setState({ [name]: value, empty_error })
                                    }} />
                                {(this.state.description.length === 0 && this.state.submited) ? <div className='validation valid-center'>Մուտքագրել տվյալներ</div> : null}
                            </div>
                            <div className={this.state.managers_client.length === 0 && this.state.accountants_client.length === 0 && this.state.submited ? "input-validation input-validation-valid" : "input-validation"}>
                                {option ? <Select
                                    closeMenuOnSelect={false}
                                    options={option}
                                    className={this.state.managers_client.length === 0 && this.state.accountants_client.length === 0 && this.state.submited ? "error-select" : ""}
                                    onChange={(list) => {
                                        this.setState({ accountants_client: list ? list : [] })
                                    }}
                                    placeholder="Ընտրել աշխատակից"
                                    isMulti
                                /> : null}
                                {(this.state.managers_client.length === 0 && this.state.accountants_client.length === 0 && this.state.submited) ?
                                    <div className='validation valid-center'>Ընտրել տվյալներ</div> : null}
                            </div>
                            <div className={this.state.managers_client.length === 0 && this.state.accountants_client.length === 0 && this.state.submited ? "input-validation input-validation-valid" : "input-validation"}>
                                {multi_manager ? <Select
                                    closeMenuOnSelect={false}
                                    options={multi_manager}
                                    className={this.state.managers_client.length === 0 && this.state.accountants_client.length === 0 && this.state.submited ? "error-select" : ""}
                                    onChange={(list) => {
                                        this.setState({ managers_client: list ? list : [] })
                                    }}
                                    placeholder="Ընտրել մենեջեր"
                                    isMulti
                                /> : null}
                                {(this.state.managers_client.length === 0 && this.state.accountants_client.length === 0 && this.state.submited) ?
                                    <div className='validation valid-center'>Ընտրել տվյալներ</div> : null}
                            </div>
                            <div className='input-validation'>
                                <TextField
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
                            {/* <DateTimePicker
                                onChange={this.handleChangeDate}
                                value={this.state.date}
                            /> */}
                            <div className='img-icon-cont'>
                                <div className='img-cont'>
                                    {this.state.images.map((item, index) => {
                                        return index < 4 ? <div className='img-delete' key={index}><div className='img'>
                                            <span className='icon-Photos'></span><span className='images-name'>{item.name}</span>
                                        </div><i className="far fa-times-circle" onClick={() => {
                                            this.setState((prevState) => {
                                                let list = [...prevState.images]
                                                list.splice(index, 1)
                                                return {
                                                    ...prevState,
                                                    images: list
                                                }
                                            })
                                        }} /></div> : "..."
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
                            <Button
                                disabled={this.state.disabled}
                                buttonStyle="blue-button"
                                onChangeValue={() => this.newNotification()}
                                title={word.save}
                            />
                        </Col>
                    </Row>
                </div>
            </div >
        );
    }
}
export default connect(
    (state) => ({
        word: state.word, show: state.showReducer,
        employee: state.loginReducer, limit_data: state.limit_data,
        multi_manager: state.manager.multi_manager
    }),
    (dispatch) => ({ getStuff: (data) => dispatch(stuffAction(data)) })
)(NewNotification);