import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Form } from 'react-bootstrap';
import Button from "../../components/Button/Button";
import '../../assets/css/add.css';
import { newStuff, getStuff } from "../../api/index";
import { stuffAction } from "../../action";
import { toast } from 'react-toastify';
import { SERVER } from "../../config";
import 'react-toastify/dist/ReactToastify.css';
import Loader from 'react-loader-spinner';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

class Add extends Component {
    constructor(props) {
        super(props);
        this.state = {
            form: [
                {
                    key: 'user.first_name',
                    value: "",
                    errorMessage: "name_error",
                    type: "text",
                    label: ""
                },
                {
                    key: 'user.last_name',
                    value: "",
                    errorMessage: "name_error",
                    type: "text",
                    label: ""
                },
                {
                    key: 'phone',
                    value: "",
                    errorMessage: "phone_error",
                    type: "text",
                    label: ""
                },
                {
                    key: 'user.email',
                    value: "",
                    errorMessage: "email_error",
                    type: "email",
                    label: ""
                },
                {
                    key: 'user.password',
                    value: "",
                    errorMessage: "password_error",
                    type: "password",
                    label: ""
                },
            ],

            imagePreviewUrl: "",
            show: false,
            image: "",
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
            this.addStuff()
        }
    }
    addStuff() {
        let token = localStorage.getItem("token");
        let image = this.state.image;
        let formData = new FormData();
        if (image) formData.append("image", image, image.name)
        this.setState({
            submited: true, disabled: true
        })
        for (let i = 0; i < this.state.form.length; i++) {
            const element = this.state.form[i]
            if (!element.valid) {
                this.setState({ disabled: false })
                return
            }
            formData.append(element.key, element.value)
        }
        formData.append("accountant_type", `${SERVER}accountant-types/${this.props.type}/`)
        newStuff(token, formData)
            .then((res) => {
                if (res.error) {
                    this.error_notify()
                    this.setState({
                        disabled: false
                    })
                } else {
                    this.success_notify();
                    this.props.close();
                    this.props.get_new_info()
                    // getStuff(token, 1000)
                    //     .then((res) => this.props.getStuff(res))
                }
            })
            .catch((error) => {
                console.log(error);
            })


    }
    _addNewEmployee(item, index) {
        return <Form.Group className='justify-content-center' controlid="exampleForm.ControlInput1" key={index}>
            <Form.Control type={item.type} onKeyDown={(e) => this.keyPress(e)}
                className={(!item.valid && this.state.submited) ? "form-control is-invalid" : "form-control"}
                autoComplete="off"
                onChange={(e) => {
                    item.value = e.target.value
                    // item.valid = item.value.length > 0
                    switch (item.key) {
                        case "user.first_name":
                            item.valid = (item.value.length === 0 || (item.value.length !== 0 && item.value.length < 3)) ? false : true
                            break;
                        case "user.last_name":
                            item.valid = (item.value.length === 0 || (item.value.length !== 0 && item.value.length < 3)) ? false : true
                            break;
                        case "phone":
                            let re = /^[0-9]/;
                            item.valid = !(re.test(String(item.value).toLowerCase()) && item.value[0] === '0' && item.value.length === 9) ? false : true
                            break;
                        case "user.email":
                            item.valid = !item.value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i) && item.value.length > 0 ? false : true
                            break;
                        case "user.password":
                            item.valid = item.value.length !== 0 && item.value.length < 6 ? false : true
                            break;
                        default:
                    }
                    this.setState({ form: this.state.form })
                }} onBlur={() => {
                    item.active = true;
                    this.setState({ form: this.state.form })
                }}
                onFocus={() => {
                    item.active = true;
                    this.setState({ form: this.state.form })
                }}
                placeholder={this.props.word[item.key]} name={item.key} value={item.value}
            />
            {(!item.valid && this.state.submited) ? <div className='validation'>
                <span>{this.props.word[item.errorMessage]}</span>
            </div> : null}
        </Form.Group>
        // return <div className='input-validation' key={index}>
        //     <input type={item.type} onKeyDown={(e) => this.keyPress(e)}
        //         onChange={(e) => {
        //             item.value = e.target.value
        //             // item.valid = item.value.length > 0
        //             switch (item.key) {
        //                 case "user.first_name":
        //                     item.valid = !item.value.length === 0 && item.value.length < 3 ? false : true
        //                     break;
        //                 case "user.last_name":
        //                     item.valid = !item.value.length === 0 && item.value.length < 3 ? false : true
        //                     break;
        //                 case "phone":
        //                     let re = /^[0-9]/;
        //                     item.valid = !(re.test(String(item.value).toLowerCase()) && item.value[0] === '0' && item.value.length === 9) ? false : true
        //                     break;
        //                 case "user.email":
        //                     item.valid = !item.value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i) && item.value.length > 0 ? false : true
        //                     break;
        //                 case "user.password":
        //                     item.valid = !item.value.length === 0 && item.value.length < 6 ? false : true
        //                     break;
        //                 default:
        //             }
        //             this.setState({ form: this.state.form })
        //         }} onBlur={() => {
        //             item.active = true;
        //             this.setState({ form: this.state.form })
        //         }}
        //         onFocus={() => {
        //             item.active = true;
        //             this.setState({ form: this.state.form })
        //         }}
        //         placeholder={this.props.word[item.key]} name={item.key} value={item.value} />
        //     {(!item.valid && (this.state.submited || item.active)) ? <div className='validation-accountant'>{this.props.word[item.errorMessage]}</div> : null}
        // </div>
    }

    render() {
        let { imagePreviewUrl } = this.state;
        let $imagePreview = null;
        const { word } = this.props
        if (imagePreviewUrl !== "") {
            $imagePreview = (<div className='change-my-img' style={{ backgroundImage: "url(" + imagePreviewUrl + ")" }} />);
        } else {
            $imagePreview = <i className="fas fa-camera" ></i>

        }
        return (
            <div className='add'>
                <div className="tool-tip-cont">
                    <div className="tool-tip">Փակել</div>
                    <i className="fas fa-times" onClick={() => {
                        this.props.close()
                    }}></i>
                </div>
                <div className='green-top'>
                    <Col xs={12} sm={10}> {this.props.create}</Col>
                </div>
                <div className='container'>
                    <Row className="d-flex justify-content-around">
                        <Col xs={12} sm={10}>
                            <div className='add-img'>
                                <label>
                                    <input type="file" onChange={(e) => {
                                        // let value = e.target.files[0]
                                        let reader = new FileReader();
                                        let file = e.target.files[0] ? e.target.files[0] : this.state.image;
                                        reader.onloadend = () => {
                                            this.setState({
                                                ...this.state,
                                                imagePreviewUrl: reader.result,
                                                image: file,
                                            });
                                        }
                                        // this.uploadImage(value)
                                        reader.readAsDataURL(file)
                                    }} />
                                    <span className='add-span'>{word.add_picture}</span>
                                    <div className='add-round-img'>{$imagePreview}</div>
                                </label>
                                {this.state.form.map((item, index) => {
                                    return this._addNewEmployee(item, index)
                                })}
                            </div>
                        </Col>
                    </Row>
                    {this.state.disabled ? <div className="disable-loader"><Loader
                        type="Oval"
                        color="#101C2A"
                        height={30}
                        width={30}
                    /></div> : null}
                    <Row className="d-flex ">
                        <Col xs={12} sm={10} className="d-flex align-items-end">
                            <Button
                                disabled={this.state.disabled}
                                buttonStyle={!this.state.disabled ? "blue-button" : "blue-button blue-button-disabled"}
                                onChangeValue={() => this.addStuff()}
                                title={word.confirmed}
                            />
                        </Col>
                    </Row>

                </div>

            </div >
        );
    }
}


export default connect(
    (state) => ({ word: state.word, show: state.showReducer }),
    (dispatch) => ({ getStuff: (data) => dispatch(stuffAction(data)) })
)(Add);