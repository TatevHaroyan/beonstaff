import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Col } from 'react-bootstrap';
import "../assets/css/managerlogin.css";
import { login_post, getMe } from "../api/index";
import { GET_PORFESSION } from "../action/type";
import Button from '../components/Button/Button';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
class ManagerLogin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dispatch: false,
            prof: false,
            form: [
                {
                    key: "username",
                    value: "",
                    errorMessage: "email_error",
                    type: "email",
                    label: ""
                },
                {
                    key: 'password',
                    value: "",
                    errorMessage: "password_error",
                    type: "password",
                    label: ""
                },
            ],
            "error": ""
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
            this.login()
        }
    }
    login() {
        let profession = !this.state.prof ? "manager" : "accountant"
        localStorage.setItem("profession", profession)
        let prof = localStorage.getItem("profession")
        let data = {}
        this.setState({
            submited: true, disabled: true
        })
        for (let i = 0; i < this.state.form.length; i++) {
            const element = this.state.form[i]
            if (!element.valid) {
                this.setState({
                    disabled: false
                })
                return
            }
            data[element.key] = element.value
        }
        login_post(data, prof).then((res) => {
            if (res.error) {
                this.error_notify()
                this.setState({
                    disabled: false
                })
                return
            }
            this.success_notify()
            if (res.token) {
                localStorage.setItem("token", res.token)
                let prof = localStorage.getItem("profession")
                getMe(res.token, prof).then((user) => {
                    localStorage.setItem("id", user.id);
                    localStorage.setItem("user_id", user.user_id);
                    window.location = "/main_employee"
                })
                    .catch((error) => {
                        console.log(error);
                    })
            }
        })
    }
    _loginRender(item, index) {
        return <div key={index} className="login-input-valid">
            <input className="login-input" type={item.type} placeholder={this.props.word[item.key]} name={item.key} onKeyDown={(e) => this.keyPress(e)}
                autoComplete="off"
                value={item.value} onChange={(e) => {
                    item.value = e.target.value
                    switch (item.key) {
                        case "username":
                            item.valid = !item.value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i) ? false : true
                            break;
                        case "password":
                            item.valid = item.value.length >= 0 && item.value.length < 6 ? false : true
                            break;
                        default:
                    }
                    this.setState({ form: this.state.form })
                }}
                onBlur={() => {
                    item.active = true;
                    this.setState({ form: this.state.form })
                }}
                onFocus={() => {
                    item.active = true;
                    this.setState({ form: this.state.form })
                }}
            />
            {(!item.valid && this.state.submited) ? <div className='validation-accountant'>{this.props.word[item.errorMessage]}</div> : null}
        </div>
    }
    render() {
        const { word } = this.props
        return (
            <div className="manager-container">
                <div className='manager-login'>
                    <div className="login-input-cont">
                        <div className="manager-login-input">
                            {this.state.form.map((item, index) => {
                                return this._loginRender(item, index)
                            })}

                            {/* <div className='validation'>{this.state.error}</div> */}
                            {/* <div className='manager-login-input'> */}
                                <label className="cont"><span className="checkmark-text">{this.props.word.login_accountant}</span>
                                    <input onChange={() => this.setState({ prof: !this.state.prof })} type="checkbox" onKeyDown={(e) => this.keyPress(e)} />
                                    <span className="checkmark"></span>
                                </label>

                            {/* </div> */}
                            <Button
                                disabled={this.state.disabled}
                                buttonStyle={!this.state.disabled ? "blue-button" : "blue-button blue-button-disabled"}
                                title={word.log_in}
                                onChangeValue={() => this.login()}
                            />
                        </div>
                    </div>
                    <div className="manager-img">
                    </div>
                </div>
            </div>
        );
    }
}
export default connect(
    (state) => ({ word: state.word, show: state.showReducer, profession: state.profession }),
    (dispatch) => ({ getProfession: () => dispatch({ type: GET_PORFESSION }) })
)(ManagerLogin);