import React, { Component } from 'react';
import { Row, Col } from 'react-bootstrap';
import { connect } from 'react-redux';
import AddOrgAccountant from "./AddOrgAccountant";
import { getOrgData, delete_company, AddAccountantCompany, getOrg, get_deleted_companies_count } from "../../api";
import { get_org_list } from "../../action";
import company from "../../assets/img/images.jpg";
import '../../assets/css/mypage.css';
import moment, { locale } from 'moment';
import 'moment/locale/hy-am';
import BlueButton from "../../components/BlueButton/BlueButton";
import MyButton from "../../components/Button/Button";
import Loader from 'react-loader-spinner';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import EditOrg from "./EditOrg";

class ManagerOrg extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false,
            delete_show: false,
            org: {

            },
            list: [
                {
                    id: 1,
                    name: "Գործող",
                },
                {
                    id: 2,
                    name: "Չգործող"
                }

            ],

        }
    }
    ellipsis_string(string, max_char) {
        let new_string = ""
        if (max_char < string.length) {
            for (let index = 0; index < string.length; index++) {
                let el = string[index]
                if (index < max_char) {
                    new_string += `${el}`
                }
            }
            return new_string += "..."
        }
        else {
            return string
        }
    }
    delete_company() {
        let id = this.props.match.params.id
        let data = {
            id
        }
        delete_company(data)
            .then((res) => {
                if (res.status === "ok") {
                    this.props.history.goBack();
                    get_deleted_companies_count()
                        .then((res) => {
                            //     getOrg()
                            //         .then((response) => {
                            this.props.getOrg({ deleted_company_count: res.count })
                            //         })
                            //     // this.props.getOrg({ deleted_company_count: res.count })
                            //     // this.setState({ company_cont: res })
                        })
                    // this.getCompanyData()
                }
                // window.location = "/main_employee/organization"
            })
    }
    componentDidMount() {
        this.getOrgData()
    }
    getOrgData() {
        let token = localStorage.getItem("token");
        let id = this.props.match.params.id
        getOrgData(token, id)
            .then((res) => {
                this.setState({ org: res })
            })
    }
    _return_string(array) {
        let str = ""
        for (let index = 0; index < array.length; index++) {
            const element = array[index];
            str += `${element.name}, `
        }
        return str
    }
    _deleteAccountant() {
        let list = [];
        let url = this.state.url
        let array = [...this.state.org.accountant];
        for (let index = 0; index < array.length; index++) {
            const element = array[index].url;
            list.push(element)

        }
        let new_accountant_list = list.filter(el => el !== url)
        let data = this.state.org;
        let token = localStorage.getItem("token")
        let company = {
            "name": data.name,
            "client": data.client.url,
            "subscribe": data.subscribe,
            "accountant": new_accountant_list,
            "HVHH": data.HVHH,
            "address": data.address,
            "url": data.url
        }
        if (array.length > 0) {
            AddAccountantCompany(data.id, token, company)
                .then((res) => {
                    getOrgData(token, data.id)
                        .then((res) => { this.setState({ org: res, deleteVisible: false }) })
                }
                )
        }
    }
    render() {
        const { word } = this.props
        let data = this.state.org
        if (!data.url) {
            return < div className="loaderMargin"><Loader
                type="Oval"
                color="#101C2A"
                height={30}
                width={30}
            /></div>
        }
        else {
            return (
                <div className='my-user-org-page'>
                    <div className='header-line'></div>
                    <div className='modules-header'>
                    </div>
                    {this.state.deleteVisible ? <div className="popup" onClick={() => this.setState({ deleteVisible: false })}>
                    </div> : null}
                    {this.state.show || this.state.showMulti ? <div className='popup' onClick={() => { this.setState({ show: false, showMulti: false }) }}></div> : null}
                    {this.state.deleteVisible ? <div className="delete-note">
                        <div className="delete-text">Ջնջե՞լ</div>
                        <div className="note-buttons">
                            <MyButton
                                buttonStyle="blue-button"
                                onChangeValue={() => this._deleteAccountant()}
                                title={word.yes}
                            />
                            <MyButton
                                buttonStyle="blue-button"
                                onChangeValue={() => this.setState({ deleteVisible: false })}
                                title={word.no}
                            />
                        </div>
                    </div> : null}
                    <div className='my-page-cont'>
                        <div className='container'>
                            <Row className='img-name'>
                                <div className='image-round'>
                                    <div className='my-image' style={{ backgroundImage: data.logo !== null ? "url(" + data.logo + ")" : "url(" + company + ")" }}></div>
                                </div>
                                <h1>{data.name !== "undefined" ? this.ellipsis_string(data.name, 20) : ""} </h1>
                            </Row>
                            <div className='data-section'>
                                {this.state.delete_show ? <div className="delete-company">
                                    <div className="delete-company-title">{word.delete_company}</div>
                                    <div className='delete-commpany-button'>
                                        <BlueButton disabled={data.is_deleted_by_manager} title={word.yes} onChangeValue={() => { this.delete_company(); this.setState({ delete_show: false }) }} />
                                        <BlueButton disabled={data.is_deleted_by_manager} title={word.no} onChangeValue={() => this.setState({ delete_show: false })} />
                                    </div>
                                </div> : null}
                                {this.state.edit_show ? <EditOrg data={data}
                                    close={(res) => { this.setState({ edit_show: false, org: res ? res : data }) }} /> : null}
                                {this.state.show || this.state.delete_show || this.state.edit_show ?
                                    <div className='popup' onClick={() => { this.setState({ show: false, delete_show: false, edit_show: false }) }}></div> : null}
                                {console.log("in contttttttttttttttt")}
                                {this.state.show ? <AddOrgAccountant
                                    data={data}
                                    update={(res) => this.setState({ org: res })}
                                    close={() => this.setState({ show: false, accountant: this.state.accountant })}
                                /> : null}
                                <div className='container'>
                                    <p className='data-section'>{word.org_name}</p>
                                    <div className="edit-delete-cont">
                                        <div className="tool-tip-cont">
                                            <div className="tool-tip">Խմբագրել</div>
                                            {localStorage.getItem("profession") === "manager" ?
                                                <span onClick={() => { this.setState({ edit_show: true }) }} className='icon-Compose'></span> : null}
                                        </div>
                                        {data.is_deleted ? <div className="tool-tip-cont">
                                            <div className="tool-tip">Ջնջել</div><i className="fas fa-trash-alt" onClick={() => this.setState({ delete_show: true })}></i> </div> : null}
                                    </div>
                                    <Row className="my-data ">
                                        <Col xs={6} sm={6}>
                                            <p className='data-line'>{word._name} </p>
                                            <p className='data-line'>{word.phone}</p>
                                            <p className='data-line'>{word.email}</p>
                                            <p className='data-line'>{word.address}</p>
                                            <p className='data-line'>{word.HVHH}</p>
                                            {/* <p className='data-line'>{word.registMonth}</p>
                                            <p className='data-line'>{word.registNumber}</p> */}
                                            <p className='data-line'>{word.directorLastName}</p>
                                            <p className='data-line'>{word.category}</p>
                                            <p className='data-line'>Պայմանագրի սկիզբ</p>
                                            <p className='data-line'>{word.activityType}</p>
                                            <p className='data-line'>{word.type_of_service}</p>
                                            <p className='data-line'>{word.taxationSystem}</p>
                                            <p className='data-line'>{word.numberEmployees}</p>
                                            <p className='data-line'>{word.change_data}</p>
                                        </Col>
                                        <Col xs={6} sm={6}>
                                            <p className='data-line'><span>{data.name !== "undefined" ? this.ellipsis_string(data.name, 38) : ""}</span>
                                            </p>
                                            <p className='data-line'>{data.client.phone}</p>
                                            <p className='data-line'>{data.client.user.email}</p>
                                            <p className='data-line'>{data.address}</p>
                                            <p className='data-line'>{data.HVHH}</p>
                                            {/* <p className='data-line'>{moment(data.client.created_date).format('LL')}</p>
                                            <p className='data-line'>{data.created_number}</p> */}
                                            <p className='data-line'>{data.director_full_name}</p>
                                            {data.category === null ? <p></p> : <p className='data-line'>{this.state.list[data.category].name}</p>}
                                            <p className='data-line'>{data.agreement_date ? moment(data.agreement_date).format('LL') : null}</p>
                                            <p className='data-line'>{this._return_string(data.type_of_activity)}</p>
                                            <p className='data-line'>{this._return_string(data.service)}</p>
                                            <p className='data-line'>{data.taxation_system ? data.taxation_system.name : ""}</p>
                                            <p className='data-line'>{data.count_employees}</p>
                                            <p className='data-line'>{data.change_data !== "null" ? data.change_data : ""}</p>
                                        </Col>
                                    </Row>
                                    <a className="company-task" href={`/main_employee/tasks?company=${data.id}`}>
                                        <div className="blue-button">{word.company_tasks}</div>
                                    </a>
                                    <p className='data-section'>{word.stuffs}</p>
                                    {localStorage.getItem("profession") !== "accountant" ? <div className='plus' onClick={() => {
                                        this.setState({ show: true })
                                    }}>+</div> : null}
                                    <Row className='org-section flex-wrap'>
                                        {data.accountant.map((item, index) => {
                                            return <div className='org-item' key={index}>
                                                <div
                                                    className='organizations-logo' style={{ backgroundImage: "url(" + item.image + ")" }}>
                                                    {localStorage.getItem("profession") !== "accountant" ? <div className="tool-tip-cont">
                                                        <div className="tool-tip">Ջնջել</div>
                                                        <i className="fas fa-times" onClick={() => this.setState({ deleteVisible: true, url: item.url })}></i>
                                                    </div> : null}
                                                </div>
                                                {item.name !== "undefined" ? <div className='logo-name'>{item.user.first_name} {item.user.last_name}</div> : <div></div>}
                                            </div>
                                        })}
                                    </Row>
                                </div>

                            </div>
                        </div>
                    </div>

                </div>
            );
        }
    }
}


export default connect(
    (state) => ({ word: state.word, show: state.showReducer, organization: state.organization }),
    (dispatch) => ({
        getOrg: (data) => dispatch(get_org_list(data)),
    })
)(ManagerOrg);