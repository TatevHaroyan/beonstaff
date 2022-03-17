
import React, { Component } from 'react';
import { connect } from 'react-redux';
import User from "../../components/User";
import { Link } from "react-router-dom";
import Loader from 'react-loader-spinner';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import { getClient } from "../../api";
import { company_service } from "../../action";
import * as queryString from "../../utils/query-string";
import '../../assets/css/manager.css';
import Pagination from "react-js-pagination";
class Users extends Component {
    constructor(props) {
        super(props);
        this.state = {
            client: [],
            count: 0,
            activeIndex: 0,
            resCount: 0
        }
    }
    getClient() {
        this.setState({ loader: true })
        getClient()
            .then((res) => this.setState({ client: res.results, count: res.count, loader: false }))
    }
    setFilter(newFilter) {
        const params = queryString.parse(location.search)
        const tmp = newFilter?{
            ...params,
            ...newFilter,
        }:{}
        this.setState({
            fliter: tmp,
            loader:true
        })
        const stringified = queryString.stringify({ ...params, ...tmp });
        if (history.pushState) {
            var newurl = newFilter ? window.location.protocol + "//" + window.location.host + window.location.pathname + '?' + stringified :
                window.location.protocol + "//" + window.location.host + window.location.pathname;
            window.history.pushState({ path: newurl }, '', newurl);
        }
        getClient(tmp)
            .then((res) => this.setState({
                client: res.results,
                count: res.count,
                loader: false
            }))
    }
    componentDidMount() {
        this.getClient()
    }
    render() {
        const { word } = this.props;
        const params = queryString.parse(location.search);
        return (
            <div className='users'>
                <div className='data-user'>
                    <span>{word.user_name}</span>
                    <span>{word.user_phone}</span>
                    <span>{word.user_email}</span>
                </div>
                {this.state.client.length > 0 && this.state.loader === false ? <div className='user-cont'>
                    {this.state.client.map((item, index) => {
                        return <Link to={`/main_employee/users/${item.id}`} key={index}><User
                            first_name={item.user.first_name}
                            last_name={item.user.last_name}
                            phone={item.phone}
                            email={item.user.email}
                        /></Link>
                    })}
                </div> : <div className="loader-cont"><Loader
                    type="Oval"
                    color="#101C2A"
                    height={30}
                    width={30}
                /></div>}
                {this.state.client.length > 0 && this.state.loader === false ? <Pagination
                    activePage={params.offset ? params.offset / 10 + 1 : 1}
                    itemsCountPerPage={10}
                    totalItemsCount={this.state.count}
                    pageRangeDisplayed={5}
                    onChange={(data) => this.setFilter({ offset: data === 1 ? "" : (data - 1) * 10 })}
                /> : null}
            </div>
        );
    }
}


export default connect(
    (state) => ({ word: state.word, show: state.showReducer, service: state.companyService }),
    (dispatch) => ({ company_service: (data) => (dispatch(company_service(data))) })
)(Users);