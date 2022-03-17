import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { connect } from 'react-redux';
import Loader from 'react-loader-spinner';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import StuffItem from "../../components/StuffItem";
import { stuffAction, loading, activePage } from "../../action";
import { getStuff, getManager } from "../../api";
import Add from "./Add";
import Pagination from "react-js-pagination";
import '../../assets/css/manager.css';
class ManagerStuff extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false,
        }
    }
    token = localStorage.getItem("token")
    componentDidMount() {
        this.setState({ loader: true })
        let type = this.props.match.params.type;
        getStuff(this.token, { accountant_type: type, limit: 1000 })
            .then((res) => {
                getManager(this.token, { accountant_type: type })
                    .then((manager_res) => {
                        this.setState({ staff: res, manager: manager_res, loader: false })
                    })
            })
    }
    render() {
        const { word, stuff } = this.props
        return (
            <div className='manager-stuff'>
                {this.state.show ? <div className='manager-popup'>
                    <div onClick={() => { this.setState({ show: false }) }} className='popup'></div>
                    <Add type={this.props.match.params.type} create={word.add_new_employee} close={() => {
                        this.setState({ show: false })
                    }} />
                </div> : null}
                <div className='plus-cont' onClick={() => {
                    this.setState({ show: true })
                }}><span className="plus">+</span>
                    <span className="tooltiptext">{word.addItem}</span>
                </div>
                {!this.state.staff || this.state.loader === true ? < div className="loaderMargin"><Loader
                    type="Oval"
                    color="#101C2A"
                    height={30}
                    width={30}
                /> </ div> : <div >
                    <div className='manager-stuff-list'>
                        {this.state.manager.results.map((item, index) => {
                            return <Link to={`/main_employee/staff/${this.props.match.params.type}/${item.id}/?manager=true`} key={index}>
                                <StuffItem
                                    name={item.user.first_name} surname={item.user.last_name} image={item.image} profession={item.profession !== "null" ? item.profession : ""} /> </Link>
                        })}
                    </div>
                    <hr />
                    <div className='manager-stuff-list'>
                        {this.state.staff.results.map((item, index) => {
                            return <Link to={`/main_employee/staff/${this.props.match.params.type}/${item.id}`} key={index}>
                                <StuffItem
                                    name={item.user.first_name} surname={item.user.last_name} image={item.image} profession={item.profession !== "null" ? item.profession : ""} /> </Link>
                        })}
                    </div>
                </div>}
                {/* {this.state.staff && this.state.staff.results && stuff.loader===false ?
                      <Pagination
                    activePage={stuff.activePage}
                    itemsCountPerPage={10}
                    totalItemsCount={stuff.count}
                    pageRangeDisplayed={5}
                    onChange={(data) => this.handlePageChange(data)}
                />
                :null} */}
            </div>
        );
    }
}
export default connect(
    (state) => ({ word: state.word, show: state.showReducer, stuff: state.stuff }),
    (dispatch) => ({ getStuff: (data) => dispatch(stuffAction(data)), loading: () => dispatch(loading()), activePage: (page) => dispatch(activePage(page)) })
)(ManagerStuff);