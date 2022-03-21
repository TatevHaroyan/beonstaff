import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Form } from 'react-bootstrap';
import Button from "../../components/Button/Button";
import Loader from 'react-loader-spinner';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import '../../assets/css/add.css';
import { changeEmployeeData, getEmployeeData } from "../../api/index";
import { employeeDataAction } from "../../action";

class ChangeStuffData extends Component {
    constructor(props) {
        super(props);
        this.state = {
            imagePreviewUrl: "",
            show: false,
            image: "",
            form: [
                {
                    key: 'user.first_name',
                    value: this._getValue(props.information, 'user.first_name'),
                    errorMessage: "name_error",
                    type: "text",
                    label: "",
                    valid: this._getValue(props.information, 'user.first_name').length > 0
                },
                {
                    key: 'user.last_name',
                    value: this._getValue(props.information, 'user.last_name'),
                    errorMessage: "name_error",
                    type: "text",
                    label: "",
                    valid: this._getValue(props.information, 'user.last_name').length > 0
                },
                {
                    key: 'profession',
                    value: this._getValue(props.information, 'profession'),
                    errorMessage: "name_error",
                    type: "text",
                    label: "",
                    valid: this._getValue(props.information, 'profession').length > 0
                },
                {
                    key: 'phone',
                    value: this._getValue(props.information, 'phone'),
                    errorMessage: "phone_error",
                    type: "phone",
                    label: "",
                    valid: this._getValue(props.information, 'phone').length > 0
                },
                // {
                //     key: 'user.email',
                //     value: this._getValue(props.information, 'user.email'),
                //     errorMessage: "phone_error",
                //     type: "email",
                //     label: "",
                //     valid: true
                // }
            ],


        }
    }
    changeEmployeeData() {
        this.setState({ submited: true })
        let profession_list = this.props.information.url.split("/");
        let profession = profession_list[profession_list.length - 3];
        console.log(profession_list, "profession_list");
        console.log(profession, 'profession');
        let token = localStorage.getItem("token");
        let id = this.props.information.id;
        let formData = new FormData();
        let image = this.state.image;
        if (image) formData.append("image", image, image.name)
        for (let index = 0; index < this.state.form.length; index++) {
            const element = this.state.form[index];
            console.log(element, "element");
            if ((!element.valid || element.value.length === 0) && element.key !== "profession") {
                return
            }
            formData.append(element.key, element.value);
        }
        formData.append("user.email", this.props.information.user.email);
        changeEmployeeData(formData, token, id, profession)
            .then(() => this.props.close())
            .then((res) => {
                getEmployeeData(id, token, profession)
                    .then((res) => {
                        this.props.getEmployeeData(res)
                    })
            }).catch((error) => {
                console.log(error);
            })
    }
    keyPress(e) {
        if (e.key === "Enter") {
            this.changeEmployeeData()
        }
    }
    _valid(item) {
        switch (item.type) {
            case "text":
                item.valid = (item.value.length === 0 || (item.value.length < 3 && item.value.length > 0)) ? false : true
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
        console.log(item, "itemmmmmm");
        console.log(!item.valid && this.state.submited, "!item.valid && this.state.submited");
        // console.log(item.value.length ? item.value : "");
        return <Form.Group className='justify-content-center' controlid="exampleForm.ControlInput1" key={index}>
            <Form.Control type={item.type} onKeyDown={(e) => this.keyPress(e)}
                className={(!item.valid && this.state.submited) ? "form-control is-invalid" : "form-control"}
                autoComplete="off"
                onChange={(e) => {
                    item.value = e.target.value
                    // item.valid = item.value.length > 0
                    item.valid = this._valid(item);
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
                placeholder={this.props.word[item.key]}
                name={item.key}
                value={item.value && item.value !== "null" ? item.value : ""}
            />
            {(!item.valid && this.state.submited)
                ? <div className='validation'>{this.props.word[item.errorMessage]}</div>
                : null}
        </Form.Group>
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
    render() {
        console.log(this.state.submited, "this.state.submited");
        let { imagePreviewUrl } = this.state;
        let $imagePreview = null;
        const { word, } = this.props
        if (imagePreviewUrl !== "") {
            $imagePreview = (<div className='change-my-img' style={{ backgroundImage: "url(" + imagePreviewUrl + ")" }} />);
        } else {
            if (this.props.information.image) { $imagePreview = (<div className='change-my-img' style={{ backgroundImage: "url(" + this.props.information.image + ")" }} />); }
            else { $imagePreview = (<i className="fas fa-camera" ></i>); }
        }
        if (!this.props.information.user) {
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
                                            // let value = e.target.files[0]
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
                                    onChangeValue={() => this.changeEmployeeData()}
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
    (state) => ({ word: state.word, show: state.showReducer, employee: state.loginReducer, accountant: state.accountant }),
    (dispatch) => ({
        getEmployeeData: (data) => dispatch(employeeDataAction(data))
    })
)(ChangeStuffData);