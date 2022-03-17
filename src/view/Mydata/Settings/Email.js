import React, { Component } from 'react';
import { Form } from "react-bootstrap";
import { connect } from 'react-redux';
import { changeEmail, getMeById, checkEmail, login_post } from "../../../api";
import { employeeAction } from "../../../action/index";
import BlueButton from "../../../components/BlueButton/BlueButton";
import { toast } from 'react-toastify';
class Email extends Component {
    constructor(props) {
        super(props);
        this.state = {
            code: {
                key: "code",
                title: "Կոդ",
                value: "",
                valid: false,
                type: "number",
                active: false,
                errorMessage: "password_error",
            },
            form_email: [
                {
                    key: "email",
                    title: "Նոր էլ հասցե",
                    value: "",
                    valid: false,
                    type: "email",
                    active: false,
                    errorMessage: "email_error",
                },
                {
                    key: "password",
                    title: "Գաղտնաբառ",
                    value: "",
                    valid: false,
                    type: "password",
                    active: false,
                    errorMessage: "password_error",
                }
            ],
        }
    }
    keyPress(e) {
        if (e.key === "Enter") {
            this.submit()
        }
    }
    success_notify() {
        toast.success(this.props.word.success_process, {
            position: toast.POSITION.TOP_CENTER
        })
    };
    error_notify(text) {
        toast.error(text, {
            position: toast.POSITION.TOP_CENTER
        })
    };
    submit() {
        let user_data = this.props.login;
        let token = localStorage.getItem("token")
        let id = localStorage.getItem("id")
        this.setState({ submit: true, disabled: true })
        let data = {
        }
        if (!this.state.code_show) {

            for (let index = 0; index < this.state.form_email.length; index++) {
                const element = this.state.form_email[index];
                if (!element.valid) {
                    return
                }
                data[element.key] = element.value
            }
            data["old_email"] = user_data.user.email
            changeEmail(data, id)
                .then((res) => {
                    if (res.message) {
                        let text = res.message === "email already exists" ? "էլ հասցեն արդեն գոյություն ունի" : "Գաղտնաբառը սխալ է";
                        this.setState({ disabled: false })
                        this.error_notify(text)
                    } else {
                        this.setState({ disabled: false, code_show: true, submit: false })
                        this.success_notify()
                    }
                })
        }
        if (this.state.code_show) {
            let new_data = {
            }
            for (let index = 0; index < this.state.form_email.length; index++) {
                const element = this.state.form_email[index];
                if (!element.valid) {
                    return
                }
                new_data[element.key] = element.value
            }
            new_data["old_email"] = user_data.user.email;
            new_data["code"] = this.state.code.value;
            checkEmail(new_data)
                .then((res) => {
                    if (res.message) {
                        let text = res.message === "email already exists" ? "էլ հասցեն արդեն գոյություն ունի" : "Կոդը սխալ է";
                        this.setState({ disabled: false })
                        this.error_notify(text)
                    } else {
                        this.setState({ disabled: false })
                        this.props.close()
                        this.success_notify()
                        let token = res.token
                        let profession = localStorage.getItem("profession")
                        let id = localStorage.getItem("id")
                        getMeById(id, token, profession).then((getme) => {
                            this.props.getMyInfo(getme)
                            localStorage.setItem("token", res.token)
                        })

                    }
                })
        }
    }
    _render_email(item, index) {
        return <Form.Group className='justify-content-center' controlid="exampleForm.ControlInput1" key={index} >
            <Form.Control
                placeholder={item.title}
                className={(!item.valid && this.state.submit) ? "form-control is-invalid" : "form-control"}
                autoComplete="off"
                onKeyDown={this.keyPress}
                value={item.value}
                type={item.type}
                onChange={(e) => {
                    item.value = e.target.value
                    switch (item.type) {
                        case "email":
                            item.valid = (!item.value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i) && item.value.length > 0) || item.value.length === 0 ? false : true
                            break;
                        case "password":
                            item.valid = (item.value.length > 0 && item.value.length < 6 || item.value.length === 0) ? false : true
                            break;
                        case "number":
                            item.valid = (item.value.length > 0 && item.value.length < 6 || item.value.length === 0) ? false : true
                            break;
                        default:
                    }
                    this.setState({ form_email: this.state.form_email, form_code: this.state.form_code })
                }}
                onBlur={() => {
                    item.active = false;
                    this.setState({ loginForm: this.state.loginForm })
                }}
                onFocus={() => {
                    item.active = true;
                    this.setState({ loginForm: this.state.loginForm })
                }}
            />
            {(!item.valid && this.state.submit) ? <div className='validation valid-center'>
                <span>{this.props.word[item.errorMessage]}</span>
            </div> : null}
        </Form.Group>
    }
    render() {
        const { word, login } = this.props;
        let list = this.state.form_email;
        let code = { ...this.state.code };
        return (
            <div className='settings-item'>
                {!this.state.code_show ? <Form >{list.map((item, index) => {
                    return this._render_email(item, index)
                })}</Form> : <Form><Form.Group className='justify-content-center' controlid="exampleForm.ControlInput1">
                    <Form.Control
                        placeholder={code.title}
                        className={(!code.valid && this.state.submit) ? "form-control is-invalid" : "form-control"}
                        autoComplete="off"
                        onKeyDown={this.keyPress}
                        value={code.value}
                        type={code.type}
                        onChange={(e) => {
                            code.value = e.target.value;
                            code.valid = (code.value.length > 0 && code.value.length < 6 || code.value.length === 0) ? false : true;
                            this.setState({ code, disabled: false })
                        }}
                        onBlur={() => {
                            code.active = false;
                            this.setState({ code })
                        }}
                        onFocus={() => {
                            code.active = true;
                            this.setState({ code })
                        }}
                    />
                    {(!code.valid && this.state.submit) ? <div className='validation valid-center'>
                        <span>{this.props.word[code.errorMessage]}</span>
                    </div> : null}
                </Form.Group></Form>
                }
                <BlueButton
                    disabled={this.state.disabled}
                    // buttonStyle={!this.state.disabled ? "blue-button" : "blue-button blue-button-disabled"}
                    onChangeValue={() => { this.submit() }}
                    title="Հաստատել" />
                {/* <div className="tool-tip-cont">
                    <div className="tool-tip">Հաստատել</div>
                    <div className="check-mark" onClick={() => this.submit()}></div>
                </div> */}
            </div >
        );
    }
}
export default connect(
    (state) => ({ word: state.word, login: state.loginReducer, show: state.showReducer }),
    (dispatch) => ({
        getMyInfo: (data) => dispatch(employeeAction(data)),
    })
)(Email);