import React, { Component } from 'react';
import { connect } from 'react-redux';
import Loader from 'react-loader-spinner';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import { Dropdown } from 'react-bootstrap';
import BlueButton from "../../components/BlueButton/BlueButton";
import { TaxationSystemAction, TypeactivityAction, CardAction, company_service } from "../../action";
import '../../assets/css/add.css';
import { changeOrg, getCompanyData, getPackages, taxationSystemGet, typeActivity, companyService } from "../../api";
import Select from 'react-select';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import moment from 'moment';
import 'moment/locale/hy-am';
import Datetime from 'react-datetime';
import "react-datetime/css/react-datetime.css";

var yesterday = moment().subtract(1, 'day');
var valid = function (current) {
    return current.isAfter(yesterday);
};

class EditOrg extends Component {
    constructor(props) {
        super(props);
        this.state = {
            image: "",
            imagePreviewUrl: "",
            disabled: false,
            form: [{
                key: 'name',
                value: this._getValue(this.props.data, "name"),
                errorMessage: "empty_error",
                type: "text",
                label: "",
                valid: true
            },
            {
                key: 'HVHH',
                value: this._getValue(this.props.data, "HVHH"),
                errorMessage: "empty_error",
                type: "text",
                label: "",
                valid: true
            },
            {
                key: 'address',
                value: this._getValue(this.props.data, "address"),
                errorMessage: "empty_error",
                type: "text",
                label: "",
                valid: true
            },
            {
                key: 'created_number',
                value: this._getValue(this.props.data, "created_number"),
                errorMessage: "empty_error",
                type: "number",
                label: "",
                valid: true
            },
            {
                key: 'count_employees',
                value: this._getValue(this.props.data, "count_employees"),
                errorMessage: "empty_error",
                type: "number",
                label: "",
                valid: true
            },
            {
                key: 'director_full_name',
                value: this._getValue(this.props.data, "director_full_name"),
                errorMessage: "empty_error",
                type: "text",
                label: "",
                valid: true
            },
            {
                key: 'type_of_activity',
                value: this._getValue(this.props.data, "type_of_activity").map((el) => {
                    return { value: el.url, label: el.name }
                })
                ,
                option: "typeActivity",
                errorMessage: "empty_error",
                type: "multiSelect",
                label: "type_of_activity",
                valid: true
            },
            {
                key: 'service',
                value: this._getValue(this.props.data, "service").map((el) => {
                    return { value: el.url, label: el.name }
                }),
                option: "service",
                errorMessage: "empty_error",
                type: "multiSelect",
                label: 'type_of_service',
                valid: this._getValue(this.props.data, "service").length > 0 ? true : false
            },
            {
                key: 'taxation_system',
                value: this._getValue(this.props.data, "taxation_system").url,
                option: "taxationSystem",
                errorMessage: "select",
                type: "dropDown",
                label: "",
                valid: true
            },
            {
                key: 'packages',
                value: this._getValue(this.props.data, "packages").url,
                option: "card",
                errorMessage: "select",
                type: "dropDown",
                label: "",
                valid: true
            },
            {
                key: 'category',
                value: this._getValue(this.props.data, "category"),
                option: [
                    {
                        id: 1,
                        name: "Գործող",
                    },
                    {
                        id: 2,
                        name: "Չգործող",
                    }
                ],
                errorMessage: "select",
                type: "dropDown",
                label: "",
                valid: true
            },
            {
                key: 'agreement_date',
                value: this._getValue(this.props.data, "agreement_date"),
                option: [],
                errorMessage: "empty_error",
                type: "date",
                label: "",
                valid: this._getValue(this.props.data, "agreement_date") !== null ? true : false
            },
            {
                key: 'change_data',
                value: this._getValue(this.props.data, "change_data"),
                errorMessage: "empty_error",
                type: "text",
                label: "change_data",
                valid: true
            }
            ],
            show: false,

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
    componentDidMount() {
        let token = localStorage.getItem("token");
        typeActivity(token)
            .then((res) => {
                this.props.TypeactivityAction(res)
            })
        taxationSystemGet(token)
            .then((res) => {
                this.props.TaxationSystemAction(res)
            })
        getPackages()
            .then((res) => {
                this.props.cardData(res)
            })
        companyService()
            .then((res) => {
                this.props.company_service(res.results)
            })
    }
    typeActivity() {
        let token = localStorage.getItem("token")
        if (token) {
            this.props.typeActivity(token)
        }
    }
    taxationSystem() {
        let token = localStorage.getItem("token")
        if (token) {
            this.props.taxationSystemGet(token)
        }
    }
    changeOrg() {
        let orgId = this.props.data.id
        let token = localStorage.getItem("token");
        let logo = this.state.image;
        let client = this.props.data.client.url;
        let formData = new FormData();
        if (logo) {
            formData.append("logo", logo)
        }
        this.setState({
            submited: true,
            disabled: true
        })
        formData.append("client", client)
        for (let index = 0; index < this.state.form.length - 1; index++) {
            const element = this.state.form[index];
            if (!element.valid && element !== "change_data") {
                this.setState({ disabled: false })
                return
            }
            if (element.type === "multiSelect") {
                for (let i = 0; i < element.value.length; i++) {
                    formData.append(element.key, element.value[i].value)
                }
            } else {
                if (element.type === "date") {
                    formData.append("agreement_date", moment(element.value).format("YYYY-MM-DD"))
                } else {
                    formData.append(element.key, element.value)

                }
            }
        }
        for (let index = 0; index < this.props.data.accountant.length; index++) {
            const element = this.props.data.accountant[index];
            formData.append("accountant", element.url)
        }
        formData.append("change_data", this.state.form[this.state.form.length - 1].value)
        changeOrg(formData, token, orgId)
            .then((res) => {
                let id = this.props.data.id;
                if (res.error) {
                    this.error_notify()
                    this.setState({ disabled: false })
                } else {
                    this.success_notify()
                    this.setState({ disabled: false })
                }
                getCompanyData(token, id)
                    .then((res) => {
                        this.props.close(res)
                    })
            })
            .catch((error) => {
                console.log(error);
            })
    }
    multiSelectdata(item) {
        let activity = this.props[item.option] ? this.props[item.option] : []
        let multiSelect = []
        for (let i = 0; i < activity.length; i++) {
            multiSelect.push({ label: activity[i].name, value: activity[i].url })
        }
        return multiSelect
    }
    getOption(option, item) {
        item.active = false
        item.value = option !== null ? option : []
        item.valid = option !== null ? true : false
        this.setState({ form: this.state.form })
    }
    _renderSelect(item, index) {
        return <div key={index} className={(!item.valid && this.state.submited) ? "company-dropdown invalid-dropdown" : "company-dropdown"}>
            <Select
                value={item.value}
                closeMenuOnSelect={false}
                options={this.multiSelectdata(item)}
                onChange={(option) => this.getOption(option, item)}
                placeholder={this.props.word[item.label]}
                isMulti
            />
            {(!item.valid && this.state.submited) ? <div className='validation valid-center'>{this.props.word[item.errorMessage]}</div> : null}
        </div>
    }
    _renderDropDown(item, index) {
        return <div key={index} className={item.value || item.value === 0 || item.value === 1 ? "company-dropdown-selected company-dropdown" : "company-dropdown"}>
            <Dropdown >
                {item.key !== "category" ? <Dropdown.Toggle id="dropdown-basic">
                    {item.label !== "" ?
                        item.label : this._getValue(this.props.data, item.key).name
                    }
                </Dropdown.Toggle> : <Dropdown.Toggle>
                    {item.label !== "" ?
                        item.label : item.label = this.state.form[10].option[this.props.data.category].name}
                </Dropdown.Toggle>}
                <Dropdown.Menu>
                    {(item.key === "category") ? item.option.map((el, ind) => {
                        return <Dropdown.Item key={ind} onSelect={() => this.setState(() => {
                            item.label = el.name;
                            item.active = false;
                            item.value = ind;
                            item.valid = item.value !== "";
                            this.setState({ form: this.state.form })
                        })}> {el.name}</Dropdown.Item>
                    }) : this.props[item.option] ? this.props[item.option].map((el, ind) => {
                        return <Dropdown.Item key={ind} onSelect={() => this.setState(() => {
                            item.label = el.name
                            item.active = false
                            item.value = el.url
                            item.valid = item.value.length > 0
                            this.setState({ form: this.state.form })
                        })}> {el.name}</Dropdown.Item>
                    }) : null}
                </Dropdown.Menu>
            </Dropdown>
            {(!item.valid && (this.state.submited || item.active)) ? <div className='validation valid-center'>{this.props.word[item.errorMessage]}</div> : null}
        </div>
    }
    _renderInput(item, index) {
        return <div className='input-section' key={index}>
            <input className={!item.valid && this.state.submited ? 'orgInput invalid-input' : 'orgInput'} type={item.type} onKeyDown={(e) => this.keyPress(e)}
                onChange={(e) => {
                    item.value = e.target.value
                    item.valid = item.type === "number" ? (parseInt(item.value, 10) > 0 && parseFloat(item.value, 10) === Math.floor(item.value)) : item.value.length > 0
                    item.valid = item.key === "change_data"
                    this.setState({ form: this.state.form })
                }}
                onBlur={() => {
                    item.active = true;
                    this.setState({ form: this.state.form })
                }}
                placeholder={this.props.word[item.key]} name={item.key} value={item.value !== "null" ? item.value : ""} />
            {(!item.valid && (this.state.submited || item.active)) ? <div className='validation valid-center'>{this.props.word[item.errorMessage]}</div> : null}
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
    keyPress(e) {
        if (e.key === "Enter") {
            this.changeOrg()
        }
    }
    render() {
        const { word } = this.props;
        let { imagePreviewUrl } = this.state;
        let $imagePreview = null;
        if (imagePreviewUrl !== "") {
            $imagePreview = (<div className='change-my-img' style={{ backgroundImage: "url(" + imagePreviewUrl + ")" }} />);
        } else {
            if (this.props.logo) { $imagePreview = (<div className='change-my-img' style={{ backgroundImage: "url(" + this.props.logo + ")" }} />); }
            else { $imagePreview = (<i className="fas fa-camera" ></i>); }
        }
        return (
            <div className='add addOrg'>
                <div className='container flex-column align-items-center'>
                    <div className="close-line">
                        <div className="tool-tip-cont">
                            <div className="tool-tip">Փակել</div>
                            <i className="fas fa-times" onClick={() => this.props.close()}></i>
                        </div>
                    </div>
                    <div className="add-org-image">
                        <label >
                            <input className="fileInput" onKeyDown={(e) => this.keyPress(e)}
                                multiple
                                type="file"
                                onChange={(e) => {
                                    let reader = new FileReader();
                                    let file = e.target.files[0] ? e.target.files[0] : this.state.image;
                                    reader.onloadend = () => {
                                        this.setState({

                                            image: file,
                                            imagePreviewUrl: reader.result
                                        });
                                    }
                                    reader.readAsDataURL(file)
                                }} />
                            <span className='add-span'>{word.add_picture}</span>
                            <div className='add-round-img'>{$imagePreview}</div>
                        </label>
                    </div>
                    {this.state.form.map((item, index) => {
                        if (item.type === "multiSelect") {
                            return this._renderSelect(item, index)
                        }
                        if (item.type === "dropDown") {
                            return this._renderDropDown(item, index)
                        }
                        if (item.type === "date") {
                            return <div className="input-section" key={index}>
                                <div className={!item.valid && this.state.submited ? 'invalid-date' : 'orgInput'}>
                                    <Datetime
                                        value={item.value ? new Date(item.value) : item.value}
                                        // isValidDate={valid}
                                        timeFormat={false}
                                        onChange={(date) => {
                                            item.value = date
                                            item.valid = date ? true : false
                                            this.setState({ form: this.state.form })
                                        }}
                                        inputProps={{ placeholder: "Պայմանագրի սկիզբ" }}
                                    />
                                    {(!item.valid && this.state.submited) ? <div className='validation valid-center'>{this.props.word[item.errorMessage]}</div> : null}
                                </div>
                            </div>
                        }
                        return this._renderInput(item, index);
                    })}
                </div>
                {this.state.disabled ? <div className='loaderMargin'>
                    <Loader
                        type="Oval"
                        color="#101C2A"
                        height={30}
                        width={30}
                    /></div> : null}
                <div className="button-cont">
                    <BlueButton title={word.save}
                        disabled={this.state.disabled}
                        buttonStyle={!this.state.disabled ? "blue-button" : "blue-button blue-button-disabled"}
                        onChangeValue={() => this.changeOrg()} />
                </div>
            </div >
        );
    }
}
export default connect(
    (state) => ({
        word: state.word, login: state.loginReducer, show: state.showReducer, user: state.loginReducer, typeActivity: state.typeActivity.results,
        taxationSystem: state.taxationSystem.results,
        card: state.card.results, service: state.companyService
    }),
    (dispatch) => ({
        cardData: (data) => dispatch(CardAction(data)),
        TypeactivityAction: (data) => dispatch(TypeactivityAction(data)),
        TaxationSystemAction: (data) => dispatch(TaxationSystemAction(data)),
        company_service: (data) => dispatch(company_service(data))
    })

)(EditOrg);