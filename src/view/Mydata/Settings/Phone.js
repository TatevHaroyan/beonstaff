import React, { Component } from 'react';
import { Form } from "react-bootstrap";
import { connect } from 'react-redux';
import { changeMyData, getMeById } from "../../../api";
import { employeeAction } from "../../../action";
import BlueButton from "../../../components/BlueButton/BlueButton";
import { toast } from 'react-toastify';
class Phone extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: ""
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
        toast.error(this.props.word.error_process, {
            position: toast.POSITION.TOP_CENTER
        })
    };
    submit() {
        let formData = new FormData();
        let data = this.props.login;
        let token = localStorage.getItem("token")
        let id = localStorage.getItem("id")
        this.setState({ submit: true, disabled: true })
        let profession = localStorage.getItem("profession")
        if (this.state.valid) {
            formData.append("user.first_name", data.user.first_name)
            formData.append("user.last_name", data.user.last_name)
            formData.append("phone", this.state.phone)
            formData.append("user.email", data.user.email)
            changeMyData(formData, id)
                .then((res) => {
                    if (res.error) {
                        this.setState({ disabled: false })
                        this.error_notify()
                    } else {
                        this.setState({ disabled: false })
                        this.props.close()
                        this.success_notify()
                        getMeById(id, token, profession)
                            // .then((inf) => {
                            //     this.props.getUserInfo(inf)
                            // })
                            .catch((error) => {
                                console.log(error);
                            })
                    }
                })
        } else {
            this.setState({ disabled: false })
        }
    }
    render() {
        const { word } = this.props
        return (
            <div className='settings-item'>
                <Form.Group className='justify-content-center' controlid="exampleForm.ControlInput1" >
                    <Form.Control
                        placeholder="Հեռախոսահամար"
                        className={(!this.state.valid && this.state.submit) ? "form-control is-invalid" : "form-control"}
                        autoComplete="off"
                        onKeyDown={this.keyPress}
                        onChange={(e) => {
                            let value = e.target.value
                            let re = /^[0-9]/;
                            let valid = !(re.test(String(value).toLowerCase()) && value[0] === '0' && value.length === 9) ? false : true
                            this.setState({ valid, phone: value })
                        }}
                    />
                    {(!this.state.valid && this.state.submit) ? <div className='validation valid-center'>
                        <span>{this.props.word.phone_error}</span>
                    </div> : null}
                </Form.Group>
                {/* <div className="tool-tip-cont">
                    <div className="tool-tip">Հաստատել</div>
                    <div className="check-mark" onClick={() => this.submit()}></div>
                </div> */}
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
    (dispatch) => ({
        getMyInfo: (data) => dispatch(employeeAction(data)),
    })
)(Phone);