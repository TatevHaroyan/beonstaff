import React, { Component } from 'react';
import { Row, Col } from 'react-bootstrap';
import { connect } from 'react-redux';
import { getAccountantCompany, getEmployeeData } from "../../api";
import { employeeDataAction, delete_emaployee_data } from "../../action";
import ChangeStuffData from "./ChangeStuffData";
import userbig from "../../assets/img/userbig.png";
import '../../assets/css/mypage.css';
import OrganizationItem from "../../components/OrganizationItem";
import Loader from 'react-loader-spinner';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
class EmployeePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false,
            org: [],
            information: {}
        }
    }
    componentWillUnmount() {
        this.props.delete_emaployee_data()
    }
    componentDidMount() {
        this.getAccountantCompany()
        this.getEmployeeData()
    }
    getEmployeeData() {
        let id = this.props.match.params.id;
        let token = localStorage.getItem("token")
        getEmployeeData(id, token, this.props.location.search ? "manager" : "accountant")
            .then((res) => {
                this.props.getEmployeeData(res)
            })
    }
    getAccountantCompany() {
        let id = this.props.match.params.id;
        let token = localStorage.getItem("token");
        let prof = "accountant"
        getAccountantCompany(id, token, prof, 1000)
            .then((res) => this.setState({ org: res.results }))
    }
    // getDataById(id) {
    //     let stuff = this.props.stuff;
    //     let index = 0
    //     for (let i = 0; i < stuff.length; i++) {
    //         if (id == stuff[i].id) {
    //             index = i
    //         }
    //     }
    //     return index
    // }
    render() {
        const { word } = this.props
        let data = this.props.accountant
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
                    <div className='my-page-cont'>
                        {this.state.show ? <div className='popup' onClick={() => { this.setState({ show: false }) }}></div> : null}
                        {this.state.show ? <ChangeStuffData information={data} close={() => this.setState({ show: false })} /> : null}
                        <div className='container'>
                            <Row className='img-name'>
                                <div className='image-round'>
                                    <div className='my-personal-image' style={{ backgroundImage: data.image !== null ? "url(" + data.image + ")" : "url(" + userbig + ")" }}></div>
                                </div>
                                <h1> {data.user.first_name}<br /> {data.user.last_name}</h1>
                            </Row>
                            <div className='data-section'>
                                <div className='container'>
                                    <p className='data-section'>{word.personal_information}</p>
                                    <div className="edit-delete-cont">
                                        <div className="tool-tip-cont">
                                            <div className="tool-tip">Խմբագրել</div>
                                            <span onClick={() => { this.setState({ show: true }) }} className='icon-Compose'></span>
                                        </div>
                                    </div>
                                    <Row className="my-data flex-nowrap">
                                        <Col xs={6} sm={6}>
                                            < p className='data-line'>{word._name}  </p>
                                            <p className='data-line'>{word.surname}</p>
                                            <p className='data-line'>{word.profession}</p>
                                            <p className='data-line'>{word.phone}</p>
                                            <p className='data-line'>{word.email}</p>
                                        </Col>
                                        <Col xs={6} sm={6}>
                                            <p className='data-line'><span>{data.user.first_name}</span></p>
                                            <p className='data-line'>{data.user.last_name}</p>
                                            <p className='data-line'>{data.profession !== "null" ? data.profession : ""}</p>
                                            <p className='data-line'>{data.phone}</p>
                                            <p className='data-line'>{data.user.email}</p>
                                        </Col>
                                    </Row>
                                    <p className='data-section'>{word.my_organizations}</p>
                                    <Row className='org-section'>
                                        {this.state.org.map((item, index) => {
                                            return <div key={index}>
                                                <OrganizationItem id={item.id} is_deleted={item.is_deleted}
                                                    orgname={item.name} name={item.director_full_name}
                                                    HVHH={item.HVHH}
                                                    logo={item.logo}
                                                    accountant_list={item.accountant}
                                                />
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
    (state) => ({ word: state.word, show: state.showReducer, stuff: state.stuff, accountant: state.accountant }),
    (dispatch) => ({
        getEmployeeData: (data) => dispatch(employeeDataAction(data)),
        delete_emaployee_data: (data) => dispatch(delete_emaployee_data(data)),
    })
)(EmployeePage);