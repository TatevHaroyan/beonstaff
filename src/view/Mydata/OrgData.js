import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col } from 'react-bootstrap';
import ChangeMyData from "./ChangeMyData";
import { getAccountantCompany } from "../../api";
class OrgData extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false,
            org: [],
        }
    }
    componentDidMount() {
        this.getAccountantCompany()
    }
    getAccountantCompany() {
        let id = localStorage.getItem("id");
        let token = localStorage.getItem("token")
        let prof = localStorage.getItem("profession")
        let limit = 1000
        getAccountantCompany(id, token, prof, limit)
            .then((res) => {
                this.setState({ org: res.results })
            }
            )
    }
    render() {
        const { word, myData } = this.props
        return (
            <div className='data-section'>
                {this.state.show ? <div className='popup' onClick={() => { this.setState({ show: false }) }}></div> : null}
                {this.state.show ? <ChangeMyData close={() => this.setState({ show: false })} /> : null}
                <div className='container'>
                    <p className='data-section my-data-section'>{word.personal_information}</p>
                    {/* <div className="edit-delete-cont">
                        <div className="tool-tip-cont">
                            <div className="tool-tip">Խմբագրել</div>
                            <span onClick={() => { this.setState({ show: true }) }} className='icon-Compose'></span>
                        </div>
                    </div> */}
                    <Row className="my-data">
                        <Col xs={12} sm={6}>
                            < p className='data-line'>{word._name}  </p>
                            <p className='data-line'>{word.phone}</p>
                            <p className='data-line'>{word.email}</p>
                        </Col>

                        <Col xs={12} sm={6}>
                            <p className='data-line'>{myData.user.first_name !== "undefined" ? <span>{myData.user.first_name} {myData.user.last_name}</span> : null} </p>
                            <p className='data-line'>{myData.phone}</p>
                            <p className='data-line'>{myData.user.email}</p>
                        </Col>
                    </Row>
                </div>
            </div>
        );
    }
}
export default connect(
    (state) => ({ word: state.word, show: state.showReducer, myData: state.loginReducer }),
)(OrgData);