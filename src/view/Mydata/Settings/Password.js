import React, { Component } from 'react';
import { Form } from "react-bootstrap";
import { connect } from 'react-redux';
import { changeExistingPassword } from "../../../api";
import BlueButton from "../../../components/BlueButton/BlueButton";
import { toast } from 'react-toastify';
class Password extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // email: "",
            // old_email: ""
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
    error_notify() {
        toast.error("Հին գաղտնաբառը սխալ է", {
            position: toast.POSITION.TOP_CENTER
        })
    };
    submit() {
        let data = this.props.login;
        let token = localStorage.getItem("token")
        let id = localStorage.getItem("id")
        this.setState({ submit: true, disabled: true })
        data = {
            email: data.user.email,
            old_password: this.state.old_password,
            new_password: this.state.new_password,
            repeat_password: this.state.repeat_password
        }
        if (this.state.old_password && this.state.new_password && this.state.repeat_password && (this.state.new_password === this.state.repeat_password)) {
            changeExistingPassword(data, id)
                .then((res) => {
                    if (res.error) {
                        this.setState({ disabled: false })
                        this.error_notify()
                    } else {
                        this.setState({ disabled: false, code_show: true })
                        localStorage.setItem("token", res.token)
                        this.props.close()
                        this.success_notify()
                    }
                })
        } else {
            this.setState({ disabled: false })
        }
    }
    render() {
        const { word, login } = this.props
        return (
            <div className='settings-item-password'>
                <i className="fa fa-times" aria-hidden="true" onClick={() => this.props.close()}></i>
                <Form >
                    {/* <Form.Group className='justify-content-center' controlid="exampleForm.ControlInput1" >
                    <Form.Control
                        placeholder="Էլ․ հասցե"
                        className={(!this.state.valid && this.state.submit) ? "form-control is-invalid" : "form-control"}
                        autoComplete="off"
                        onKeyDown={this.keyPress}
                        onChange={(e) => {
                            let value = e.target.value
                            let valid = (!value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i) && value.length > 0) || value.length === 0 ? false : true
                            this.setState({ valid, email: value })
                        }}
                    />
                    {(!this.state.valid && this.state.submit) ? <div className='validation valid-center'>
                        <span>{this.props.word.email_error}</span>
                    </div> : null}
                </Form.Group> */}
                    <Form.Group className='justify-content-center' controlid="exampleForm.ControlInput1" >
                        <Form.Control
                            placeholder="Հին գաղտանբառ"
                            type="password"
                            className={(!this.state.valid_old && this.state.submit) ? "form-control is-invalid" : "form-control"}
                            autoComplete="off"
                            onKeyDown={this.keyPress}
                            onChange={(e) => {
                                let value = e.target.value
                                let valid_old = value.length >= 6
                                this.setState({ valid_old, old_password: value })
                            }}
                        />
                        {(!this.state.valid_old && this.state.submit) ? <div className='validation valid-center'>
                            <span>{this.props.word.password_error}</span>
                        </div> : null}
                    </Form.Group>
                    <Form.Group className='justify-content-center' controlid="exampleForm.ControlInput1" >
                        <Form.Control
                            placeholder="Նոր գաղտանբառ"
                            type="password"
                            className={(!this.state.valid_new && this.state.submit) ? "form-control is-invalid" : "form-control"}
                            autoComplete="off"
                            onKeyDown={this.keyPress}
                            onChange={(e) => {
                                let value = e.target.value
                                let valid_new = value.length >= 6
                                this.setState({ valid_new, new_password: value })
                            }}
                        />
                        {(!this.state.valid_new && this.state.submit) ? <div className='validation valid-center'>
                            <span>{this.props.word.password_error}</span>
                        </div> : null}
                    </Form.Group>
                    <Form.Group className='justify-content-center' controlid="exampleForm.ControlInput1" >
                        <Form.Control
                            placeholder="Կրկնել գաղտանբառը"
                            type="password"
                            className={(!this.state.valid_repeat && this.state.submit) ? "form-control is-invalid" : "form-control"}
                            autoComplete="off"
                            onKeyDown={this.keyPress}
                            onChange={(e) => {
                                let value = e.target.value
                                let valid_repeat = value.length >= 6 && value === this.state.new_password
                                this.setState({ valid_repeat, repeat_password: value })
                            }}
                        />
                        {(!this.state.valid_repeat && this.state.submit) ? <div className='validation valid-center'>
                            <span>Պետք է լինի նախորդ դաշտի նման</span>
                        </div> : null}
                    </Form.Group>
                </Form>
                <BlueButton
                    disabled={this.state.disabled}
                    // buttonStyle={!this.state.disabled ? "blue-button" : "blue-button blue-button-disabled"}
                    onChangeValue={() => { this.submit() }}
                    title="Հաստատել" />
            </div >
        );
    }
}
export default connect(
    (state) => ({ word: state.word, login: state.loginReducer, show: state.showReducer }),
)(Password);