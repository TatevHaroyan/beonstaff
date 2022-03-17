import React, { Component } from 'react';
import { Row, Col } from 'react-bootstrap';
import { connect } from 'react-redux';
import Loader from 'react-loader-spinner';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import { getClientByTd } from "../../api";
import userbig from "../../assets/img/userbig.png";
import OrganizationItem from "../../components/OrganizationItem";
import '../../assets/css/mypage.css';
class UserPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false,
            client: {}
        }
    }
    componentDidMount() {
        this.getClientByTd()
    }
    getClientByTd() {
        let id = this.props.match.params.id;
        let token = localStorage.getItem("token");
        getClientByTd(token, id)
            .then((res) => this.setState({ client: res }))
    }
    render() {
        const { word } = this.props
        if (!this.state.client.url) {
            return (<div className='loaderMargin'><Loader
                type="Oval"
                color="#101C2A"
                height={30}
                width={30}
            /></div>)
        }
        else {
            return (
                <div className='my-user-org-page'>
                    <div className='header-line'></div>
                    <div className='modules-header'>
                    </div>
                    <div className='my-page-cont'>
                        <div className='container'>
                            <Row className='img-name'>
                                <div className='image-round'>
                                    <div className='my-personal-image' style={{ backgroundImage: this.state.client.image !== null ? "url(" + this.state.client.image + ")" : "url(" + userbig + ")" }}></div>
                                </div>
                                <h1> {this.state.client.user.first_name}<br /> {this.state.client.user.last_name}</h1>

                            </Row>
                            <div className='data-section'>
                                <div className='container'>
                                    <p className='data-section'>{word.personal_information}</p>
                                    <Row className="my-data">
                                        <Col xs={6} sm={6}>
                                            < p className='data-line'>{word._name}  </p>
                                            <p className='data-line'>{word.surname}</p>
                                            <p className='data-line'>{word.phone}</p>
                                            <p className='data-line'>{word.email}</p>
                                        </Col>
                                        <Col xs={6} sm={6}>
                                            <p className='data-line'><span>{this.state.client.user.first_name}</span></p>
                                            <p className='data-line'>{this.state.client.user.last_name}</p>
                                            <p className='data-line'>{this.state.client.phone}</p>
                                            <p className='data-line'>{this.state.client.user.email}</p>
                                        </Col>
                                    </Row>
                                    <p className='data-section'>{word.my_organizations}</p>
                                    <Row className='org-section'>
                                        {this.state.client.client_company.filter((item) => item.is_deleted_by_manager === false).map((item, index) => {
                                            return <div key={index}><OrganizationItem id={item.id} is_deleted={item.is_deleted}
                                                orgname={item.name} name={item.director_full_name}
                                                HVHH={item.HVHH}
                                                logo={item.logo} /></div>
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
    (state) => ({ word: state.word, show: state.showReducer, stuff: state.stuff }),

)(UserPage);