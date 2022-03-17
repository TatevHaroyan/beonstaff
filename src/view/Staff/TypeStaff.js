import React, { Component } from 'react';
import { getStaffType } from "../../api";
import { Link } from "react-router-dom";
import { Row, Col } from 'react-bootstrap';
import { connect } from 'react-redux';
import Loader from 'react-loader-spinner';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import StuffItem from "../../components/StuffItem";
import { stuffAction, loading, activePage } from "../../action";
import Add from "./Add";
// import Pagination from "react-js-pagination";
import '../../assets/css/manager.css';
class TypeStaff extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false,
        }
    }
    componentDidMount() {
        getStaffType()
            .then((res) => {
                this.setState({ type: res.results })
            })
    }
    render() {
        return (
            <Row className='manager-stuff'>
                {this.state.type ? this.state.type.map((item, index) => {
                    return  <Col sm={4} xs={6}><Link to={`/main_employee/staff/${item.id}`}>
                            <img className="staff-type" src={item.image} key={index} ></img>
                    </Link></Col>
                }) : null}
            </Row>
        );
    }
}
export default connect(
    (state) => ({ word: state.word, show: state.showReducer, stuff: state.stuff }),
    (dispatch) => ({ getStuff: (data) => dispatch(stuffAction(data)), loading: () => dispatch(loading()), activePage: (page) => dispatch(activePage(page)) })
)(TypeStaff);