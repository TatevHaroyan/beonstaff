import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col } from 'react-bootstrap';
import Button from "../../components/Button/Button";
import Loader from 'react-loader-spinner';
import { employeeAction } from "../../action";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import '../../assets/css/add.css';
import { changeMyData, getMeById } from "../../api/index"

class ChangeMyData extends Component {
    constructor(props) {
        super(props);
        this.state = {
            imagePreviewUrl: "",
            show: false,
            image: "",
            form: [
                {
                    key: 'user.first_name',
                    value: this._getValue(props.employee, 'user.first_name'),
                    errorMessage: "name_error",
                    type: "text",
                    label: "",
                    valid: true

                },
                {
                    key: 'user.last_name',
                    value: this._getValue(props.employee, 'user.last_name'),
                    errorMessage: "name_error",
                    type: "text",
                    label: "",
                    valid: true
                },
                {
                    key: 'phone',
                    value: this._getValue(props.employee, 'phone'),
                    errorMessage: "phone_error",
                    type: "phone",
                    label: "",
                    valid: true
                },
                {
                    key: 'user.email',
                    value: this._getValue(props.employee, 'user.email'),
                    errorMessage: "phone_error",
                    type: "email",
                    label: "",
                    valid: true
                },
                {
                    key: 'user.password',
                    value: "",
                    // value: this._getValue(props.employee, 'user.password'),
                    errorMessage: "phone_error",
                    type: "password",
                    label: "",
                    valid: true
                }
            ],


        }
    }
    keyPress(e) {
        if (e.key === "Enter") {
            this.changeMyData()
        }
    }
    _valid(item) {
        switch (item.type) {
            case "text":
                item.valid = item.value.length < 3 && item.value.length > 0 ? false : true
                break;
            case "phone":
                let re = /^[0-9]/;
                item.valid = !(re.test(String(item.value).toLowerCase()) && item.value[0] === '0' && item.value.length === 9) ? false : true
                break;
            default:
        }
        return item.valid
    }
    _renderInput(item, index) {
        return <div className='input-validation' key={index}>
            <input type='text' onKeyDown={(e) => this.keyPress(e)}
                onChange={(e) => {
                    item.value = e.target.value
                    // item.valid = item.value.length > 0
                    item.valid = this._valid(item);
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
            {(!item.valid && (this.state.submited || item.active)) ? <div className='validation'>{this.props.word[item.errorMessage]}</div> : null}
        </div>
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
        this.setState({ information: this.props.employee })
    }
    formValid = (formErrors, first_name, last_name, phone, email) => {
        let valid = true;
        Object.values(formErrors).forEach(element => {
            if (element.length > 0) {
                valid = false
            }
        });
        if (first_name.length === 0 && last_name.length === 0 && phone.length === 0 && email.length === 0) {
            valid = false
            this.setState({ formErrors: { ...this.state.formErrors, empty_error: "Մուտքագրել տվյալններ" } })
        }
        return valid
    }
    changeMyData() {
        let profession = localStorage.getItem("profession");
        let token = localStorage.getItem("token");
        let id = localStorage.getItem("id");
        let formData = new FormData();
        let image = this.state.image;
        if (image) formData.append("image", image, image.name)
        this.setState({ submited: true });
        if (image) formData.append("image", image, image.name)
        for (let index = 0; index < this.state.form.length; index++) {
            const element = this.state.form[index];
            if (!element.valid && element.value.length === 0) {
                return
            }
            formData.append(element.key, element.value)
        }
        changeMyData(formData, token, profession, id)
            .then(() => this.props.close())
            .then(() => {
                getMeById(id, token, profession)
                    .then((getme) => {
                        this.props.getMyInfo(getme)
                    }).catch((error) => console.log(error)
                    )
            }).catch((error) => {
                console.log(error);
            })
    }
    render() {
        let { imagePreviewUrl } = this.state;
        let $imagePreview = null;
        const { word } = this.props
        if (imagePreviewUrl !== "") {
            $imagePreview = (<div className='change-my-img' style={{ backgroundImage: "url(" + imagePreviewUrl + ")" }} />);
        } else {
            if (this.props.employee.image) { $imagePreview = (<div className='change-my-img' style={{ backgroundImage: "url(" + this.props.employee.image + ")" }} />); }
            else { $imagePreview = (<i className="fas fa-camera" ></i>); }
        }
        if (!this.props.employee.url) {
            return <div className='container'>
                <div className='loaderMargin'>
                    <Loader
                        type="Oval"
                        color="#101C2A"
                        height={30}
                        width={30}
                    /></div></div>
        } else {
            return (
                <div className='add'>
                    <div className="tool-tip-cont">
                        <div className="tool-tip">Փակել</div>
                        <i className="fas fa-times" onClick={() => this.props.close()}></i>
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
                                            let reader = new FileReader();
                                            let file = e.target.files[0] ? e.target.files[0] : this.state.information.image;
                                            reader.onloadend = () => {
                                                this.setState({
                                                    ...this.state,
                                                    imagePreviewUrl: reader.result,
                                                    image: file,
                                                });
                                            }
                                            reader.readAsDataURL(file)
                                        }} />
                                        <span className='add-span'>{word.add_picture}</span>
                                        <div className='add-round-img'>{$imagePreview}</div>
                                    </label>
                                    {this.state.form.map((item, index) => {
                                        return this._renderInput(item, index)
                                    })}

                                </div>
                            </Col>
                        </Row>
                        <Row className="d-flex ">
                            <Col xs={12} sm={10} className="d-flex align-items-end">
                                <Button
                                    buttonStyle="blue-button"
                                    onChangeValue={() => this.changeMyData()}
                                    title={word.confirmed}
                                />
                            </Col>
                        </Row>

                    </div>

                </div >
            );
        }
    }
}
export default connect(
    (state) => ({ word: state.word, show: state.showReducer, employee: state.loginReducer }),
    (dispatch) => ({
        getMyInfo: (data) => dispatch(employeeAction(data)),
    })
)(ChangeMyData);