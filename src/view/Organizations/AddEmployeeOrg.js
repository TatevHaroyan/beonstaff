import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col } from 'react-bootstrap';
import Button from "../../components/Button/Button";
import { addEmployee } from "../../api";
import '../../assets/css/add.css';
class AddEmployeeOrg extends Component {
    constructor(props) {
        super(props);
        this.state = {
            image: "",
            image_file: {},
            input:{
                email: "",
                first_name: "",
                last_name: "",
                phone: "",
            },
            formErrors: {
                first_name: "",
                last_name: "",
                phone: "",
                email: "",
                password: "",
                login_error:""
            }
        }
    }
    formValid = (formErrors, input) => {
        let valid = true;
        Object.values(formErrors).forEach(element => { if (element.length > 0) { valid = false } });
        this.setState({ formErrors: { ...this.state.formErrors, login_error: "Մուտքագրված տվյալներում սխալ կա" } })
        Object.values(input).forEach(element => {
            if (element.length === 0) { valid = false }
            this.setState({ formErrors: { ...this.state.formErrors, login_error: "Մուտքագրեք տվյալներ" } })

        });
        return valid
    }
    onChange(e) {
        e.preventDefault();
        const { name, value } = e.target;
        let formErrors = this.state.formErrors;
        let b = false;
        switch (name) {
            case "phone":
                b = true
                let re = /^[0-9]/;
                formErrors.phone =
                    !(re.test(String(value).toLowerCase()) && value[0] === '0' && value.length === 9) ? "Պետք է լինի օրինակ xxxxxxxxx" : "";
                break;
            case "first_name":
                    b = true
                formErrors.first_name =
                    value.length < 3 && value.length > 0 ? "պետք է լինի ամենաքիչը 2 սիմվոլ" : "";
                break;
            case "last_name":
                    b = true
                formErrors.last_name =
                    value.length < 3 && value.length > 0 ? "պետք է լինի ամենաքիչը 2 սիմվոլ" : "";
                break;
            case "email":
                    b = true
                formErrors.email =
                    !value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i) && value.length > 0 ? "պետք է լինի օրինակ mail@mail.ru" : "";
                break;
            default:
                b = true
                break;
        }
        if (b) {
            this.setState({
                formErrors,
                input: {
                    ...this.state.input,
                    [name]: value
                }
            })
        } else
            this.setState({
                input: {
                    ...this.state.input,
                    [name]: value
                }
            })
    }
    addEmployee() {
        let token = localStorage.getItem("managertoken")
        let bodyData = {
            first_name: this.state.input.first_name,
            last_name: this.state.input.last_name,
            email: this.state.input.email,
            phone: this.state.input.phone,
            password: this.state.input.password
        }
      if(this.formValid(this.state.formErrors,this.state.input)){ 
          addEmployee(bodyData, token).then((addme) => {
        }).catch((error) => {
        })}
    }
    render() {
        const { word } = this.props
        let { imagePreviewUrl } = this.state;
        let $imagePreview = null;
        if (imagePreviewUrl) {
            $imagePreview = (<img alt="profile iamge" className='change-my-img' src={imagePreviewUrl} />);
        } else {
            $imagePreview = (<div className="previewText"><span className="icon-photo"></span></div>);
        }        
        return (
            <div className='add-employee-org'>
                <div className='green-top'>
                    <Col xs={12} sm={10}> {this.props.create}</Col>
                </div>
                <div className='container'>
                    <Row className="d-flex justify-content-around">
                        <Col xs={12} sm={10}>
                            <div className='add-img'>
                                <label className='input-iamge-label'>
                                <input className="fileInput"
                                    type="file"
                                    onChange={(e) => {
                                        let value = e.target.files[0]
                                        let reader = new FileReader();
                                        let file = e.target.files[0];
                                        reader.onloadend = () => {
                                            this.setState({
                                                image: file,
                                                imagePreviewUrl: reader.result,
                                                image_file: value
                                            });
                                        }
                                        // this.uploadImage(value)
                                        reader.readAsDataURL(file)
                                    }} />
                                <span className='add-span'>{word.add_picture}</span>
                                <div className='add-round-img'>{$imagePreview}</div>
                                </label>
                                <input type='text' placeholder='Կազմակերպության Անուն' name="first_name"
                                    value={this.state.input.first_name}
                                    onChange={(e) => this.onChange(e)} />
                                <div className="validation">{this.state.formErrors.first_name}</div>
                                <div className="validation">{this.state.formErrors.last_name}</div>
                                <input type='text' placeholder='Հեռախոսի համար' name="phone"
                                    value={this.state.input.phone}
                                    onChange={(e) => this.onChange(e)} />
                                <div className="validation">{this.state.formErrors.phone}</div>
                                <input type='text' placeholder='էլեկտրանային հասցե' name="email"
                                    value={this.state.input.email}
                                    onChange={(e) => this.onChange(e)} />
                                <div className="validation">{this.state.formErrors.email}</div>
                                <input type='text' placeholder='Գաղտնաբառ' name="password"
                                    value={this.state.input.password}
                                    onChange={(e) => this.onChange(e)} />
                                <div className="validation">{this.state.formErrors.password}</div>
                                <div className='validation'>{this.state.formErrors.login_error}</div>
                            </div>
                        </Col>
                    </Row>
                    <Row className="d-flex justify-content-center">
                        <Col xs={12} sm={10} className="d-flex align-items-end">
                            <Button
                                buttonStyle="blue-button"
                                title={word.confirmed}
                                showFunction={() => this.addEmployee()}
                            // width="287px"

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

)(AddEmployeeOrg);