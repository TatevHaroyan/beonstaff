import React, { Component } from 'react';
import { connect } from 'react-redux';
import { deleteNotification, getNotification, deletenotification } from "../../api";
import { getNotificationAction, getSeeNotification } from "../../action";
import { Col, Row } from "react-bootstrap";
import '../../assets/css/manager.css';
import Pagination from "react-js-pagination";
import NewNotification from "./NewNotification";
import NotificationItem from "./NotificationItem";
import Button from "../../components/Button/Button";
import Loader from 'react-loader-spinner';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import * as queryString from "../../utils/query-string";

class Notification extends Component {
    constructor(props) {
        super(props);
        this.state = {
            notification: [],
            count: 0,
            activePage: 1,
            show: false,
            deleteVisible: false,
            activeId: 1,
            filter: {
                // accountant_eq: "",
                // accountant_neq: "",
                // page: "",
                // manager: "",
                // accountants_client_eq: localStorage.getItem("profession") === "accountant" ? localStorage.getItem("id") : ""
            }
        }
    }
    componentDidMount() {
        this.initFilter()
        this.props.history.listen(location => {
            // this.initFilter()
        });
    }
    initFilter() {
        const params = queryString.parse(location.search);
        let accountant_neq = localStorage.getItem("id");
        let manager_neq = localStorage.getItem("id");
        if (localStorage.getItem("profession") === "accountant") {
            this.setFilter({ accountants_client_eq: localStorage.getItem("id"), accountant_neq, accountant_eq: "" })
        } else {
            this.setFilter({ manager_eq: "", manager_neq, managers_client_eq: localStorage.getItem("id") })
        }
        this.setState({
            filter: {
                ...this.state.filter,
                ...params
            }
        })
    }

    setFilter(newFilter) {
        const params = queryString.parse(location.search)
        const tmp = {
            // ...this.state.filter,
            // ...params,
            ...newFilter
        }
        this.setState({
            filter: tmp
        })
        const stringified = queryString.stringify({ ...tmp });
        if (history.pushState) {
            var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?' + stringified;
            window.history.pushState({ path: newurl }, '', newurl);
        }
        this.getNotification(tmp)
    }
    getNotification(tmp) {
        const params = queryString.parse(location.search)
        this.setState({ loading: true })
        getNotification(tmp)
            .then((res) => {
                { this.state.activeId === 1 ? this.props.getNotification(res) : this.props.getSeeNotification(res) }
                this.setState({
                    loading: false,
                    count: res.count,
                    activePage: params.offset ? (params.offset / 10 + 1) : 1,
                    // activeId: params.manager ? 3 : (((localStorage.getItem("profession") !== "manager" && params.accountant_neq !== "")
                    //     || (localStorage.getItem("profession") !== "manager" && params.manager_neq !== "")) ? 1 : 2)
                })
            })
    }
    getNotificationEq() {
        let data_accountant = {
            accountant_eq: localStorage.getItem("id"),
            accountant_neq: "",
            accountants_client_eq: localStorage.getItem("id"),
        }
        let data_manager = {
            manager_eq: localStorage.getItem("id"),
            managers_client_eq: localStorage.getItem("id"),
            manager_neq: "",

        }
        this.setState({ loading: true, activeId: 2 })
        this.setFilter(localStorage.getItem("profession") === "manager" ? data_manager : data_accountant)
    }
    getNotificationNeq() {
        let data_accountant = {
            accountant_neq: localStorage.getItem("id"),
            accountant_eq: "",
            accountants_client_eq: localStorage.getItem("id"),
        }
        let data_manager = {
            manager_eq: "",
            manager_neq: localStorage.getItem("id"),
            managers_client_eq: localStorage.getItem("id"),
        }
        this.setState({ loading: true, activeId: 1 })
        this.setFilter(localStorage.getItem("profession") === "manager" ? data_manager : data_accountant)
    }
    deleteNotification(id) {
        deleteNotification(id)
            .then(() => {
                this.getNote()
            })
    }
    handlePageChange(pageNumber) {
        const params = queryString.parse(location.search)
        this.setState({ loading: true })
        this.setFilter({ ...params, offset: pageNumber === 1 ? "" : (pageNumber - 1) * 10 })
    }
    loading_accountant() {
        let data = this.state.activeId === 1 ? this.props.notification : this.props.see_notification
        if (data.results && this.state.loading === false) {
            return data.results.map((item, index) => {
                return <Col sm={6} key={index} ><NotificationItem
                    getTaskData={() => this.getMyTasksStatus("new")}
                    {...this.props}
                    image_list={item.accountant_list}
                    toLink={`/main_employee/notification/${item.id}`}
                    companyId={`/main_employee/organization/${item.company_id}`}
                    comapanyName={item.company_name}
                    team={item.title}
                    teamText={item.description}
                    imgList={item.notification_file}
                    id={item.id}
                    date={item.date}
                    manager={item.manager}
                    modalShow={() => this.setState({ delete_modal: true, delete_id: item.id })}
                />
                </Col>
            })
        }
        else if (this.state.loading === true) {
            return (<div className="loaderMargin"><Loader
                type="Oval"
                color="#101C2A"
                height={30}
                width={30}
            /></div>)
        } else {
            return <div className="no_tasks"></div>
        }
    }
    render() {
        const { word, notification, see_notification } = this.props
        let data = this.state.activeId === 2 ? see_notification : notification
        return (
            <div className='users'>
                {this.state.delete_modal ? <div className="popup" onClick={() => this.setState({ delete_modal: false })}>
                </div> : null}
                {this.state.delete_modal ? <div className="delete-note">
                    <div className="delete-text">Ջնջե՞լ</div>
                    <div className="note-buttons">
                        <Button
                            buttonStyle="blue-button"
                            onChangeValue={() => deletenotification(this.state.delete_id)
                                .then(() => {
                                    this.setState({ delete_modal: false });
                                    this.initFilter()
                                })}
                            title={word.yes}
                        />
                        <Button
                            buttonStyle="blue-button"
                            onChangeValue={() => this.setState({ delete_modal: false })}
                            title={word.no}
                        />
                    </div>
                </div> : null}
                <div className='tasks-buttons'>
                    <Button buttonStyle={this.state.activeId !== 1 ? "middle-button task-button" : "task-button-active"} title="Չբացված" onChangeValue={() => {
                        this.getNotificationNeq()
                    }
                    } />
                    <Button buttonStyle={this.state.activeId !== 2 ? "middle-button task-button" : "task-button-active"} title="Բացված" onChangeValue={() => {
                        this.getNotificationEq()
                    }
                    } />
                    {localStorage.getItem("profession") === "manager" ?
                        <Button buttonStyle={this.state.activeId !== 3 ? "middle-button task-button" : "task-button-active"} title="Իմ ավելացրած" onChangeValue={() => {
                            this.setFilter({ manager: localStorage.getItem("id") })
                            this.setState({ activeId: 3 })
                        }
                        } /> : null}
                </div>
                {this.state.show ? <div className='popup' onClick={() => { this.setState({ show: false }) }}></div> : null}
                {this.state.deleteVisible ? <div className="popup" onClick={() => this.setState({ deleteVisible: false })}>
                </div> : null}
                {this.state.deleteVisible ? <div className="delete-note">
                    <div className="delete-text"> {word.finish}</div>
                    <div className="note-buttons">
                        <Button
                            buttonStyle="blue-button"
                            onChangeValue={() => this.deleteNotification(this.state.id)}
                            title={word.yes}
                        />
                        <Button
                            buttonStyle="blue-button"
                            onChangeValue={() => this.setState({ deleteVisible: false })}
                            title={word.no}
                        />
                    </div>
                </div> : null}
                {localStorage.getItem("profession") === "manager" ? <div className='plus-cont' onClick={() => {
                    this.setState({ show: true })
                }}><span className="plus">+</span>
                    <span className="tooltiptext">{word.addItem}</span>
                </div> : null}
                {this.state.show ? <NewNotification close={(res) => {
                    if (res) {
                        this.props.getNotification(res)
                        this.setState({
                            count: res.count,
                            show: false
                        })
                    } else {
                        this.setState({ show: false })
                    }
                }} /> : null}
                <div className='tasks-cont'>
                    <Row className=" flex-row">
                        {this.loading_accountant()}
                    </Row>
                </div>
                {(this.state.count > 10) ? <Pagination
                    activePage={this.state.activePage}
                    itemsCountPerPage={10}
                    totalItemsCount={localStorage.getItem("profession") === "manager" ? this.state.count : data.count}
                    pageRangeDisplayed={5}
                    onChange={(data) => this.handlePageChange(data)}
                /> : null}
            </div>
        );
    }
}
export default connect(
    (state) => ({ word: state.word, show: state.showReducer, see_notification: state.see_notification, notification: state.notification }),
    (dispatch) => ({
        getSeeNotification: (data) => dispatch(getSeeNotification(data)),
        getNotification: (data) => dispatch(getNotificationAction(data)),
    })
)(Notification);