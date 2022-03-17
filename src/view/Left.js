import React, { Component } from 'react';
import { MANAGER_CONT_SHOW } from "../action/type";
import { connect } from 'react-redux';
import MyImgRound from "../components/MyImgRound";
import { NavLink } from "react-router-dom";
import { get_deleted_companies_count } from "../api";
import { get_org_list } from "../action";

class Left extends Component {
    constructor(props) {
        super(props);
        this.state = {
            menuManager: [
                {
                    id: 1,
                    url: "/main_employee/staff",
                    title: this.props.word.stuff,
                    active: false,
                },
                {
                    id: 2,
                    url: "/main_employee/organization",
                    title: this.props.word.organizations,
                    active: false,
                },
                {
                    id: 3,
                    url: "/main_employee/users",
                    title: this.props.word.users,
                    active: false,
                },
                {
                    id: 4,
                    url: "/main_employee/tasks",
                    title: this.props.word.tasks,
                    active: false,
                },
                {
                    id: 5,
                    url: "/main_employee/archive",
                    title: this.props.word.archive,
                    active: false,
                },
                {
                    id: 6,
                    url: "/main_employee/repeated_task",
                    title: this.props.word.periodically_repetitive_tasks,
                    active: false,
                },
                {
                    id: 7,
                    url: "/main_employee/notification",
                    title: this.props.word.notification,
                    active: false,
                },
                {
                    id: 8,
                    url: "/main_employee/reports",
                    title: this.props.word.reports,
                    active: false,
                },
                {
                    id: 9,
                    url: "/main_employee/organization_file",
                    title: this.props.word.accountant_file,
                    active: false,
                },
            ],
            menuAccountant: [
                {
                    id: 1,
                    url: "/main_employee/tasks",
                    title: this.props.word.tasks,
                    active: false,
                },
                {
                    id: 2,
                    url: "/main_employee/repeated_task",
                    title: this.props.word.periodically_repetitive_tasks,
                    active: false,
                },
                {
                    id: 3,
                    url: "/main_employee/archive",
                    title: this.props.word.archive,
                    active: false,
                },
                {
                    id: 4,
                    url: "/main_employee/note",
                    title: this.props.word.note,
                    active: false,
                },
                {
                    id: 5,
                    url: "/main_employee/notification",
                    title: this.props.word.notification,
                    active: false,
                },
                {
                    id: 6,
                    url: "/main_employee/organization",
                    title: this.props.word.accountant_file,
                    active: false,
                },
                // {
                //     id: 6,
                //     url: "/main_employee/organization_file",
                //     title: this.props.word.company,
                //     active: false,
                // }
            ]
        }
    }
    componentDidMount() {
        get_deleted_companies_count()
            .then((res) => {
                this.props.getOrg({ deleted_company_count: res.count })
                // this.setState({ company_cont: res })
            })
    }
    render() {
        let prof = localStorage.getItem("profession")
        const { showNavbar, notification, organization } = this.props;
        const menu_list = (prof === "manager" ? this.state.menuManager : this.state.menuAccountant);
        return (
            <div className={!showNavbar ? 'left' : "left left-navbar"}>
                <div className='left-item left-item-hidden'>
                    <MyImgRound />
                    <div className='left-item-name'>
                        <span>Անուն Ազգանուն</span>
                        <div className="menu-line-active"></div>
                    </div>
                </div>
                <div className='manager-left-menu'>
                    {menu_list.map((item, index) => {
                        if (item.id === 2 && prof === "manager") {
                            return <NavLink key={index} activeClassName="active" to={item.url}> <div className='left-item' onClick={() => { this.setState({ active: item.url }) }} >
                                <div className="new-notification"><span>{item.title}</span> {organization.deleted_company_count ? <div className="tasks-around">{organization.deleted_company_count}</div> : null}</div>
                                {window.location.href.includes(item.url) ? <div className="menu-line"></div> : null}
                            </div></NavLink>
                        }
                        if ((item.id === 5 && prof === "accountant") || (item.id === 7 && prof === "manager")) {
                            return <NavLink key={index} activeClassName="active" to={item.url}> <div className='left-item' onClick={() => { this.setState({ active: item.url }) }} >
                                <div className="new-notification"><span>{item.title}</span> {notification.results && notification.results.length > 0 ? <div className="tasks-around">{notification.count}</div> : null}</div>
                                {window.location.href.includes(item.url) ? <div className="menu-line"></div> : null}
                            </div></NavLink>
                        }
                        if ((item.id === 1 && prof === "accountant") || (item.id === 4 && prof === "manager")) {
                            return <NavLink key={index} activeClassName="active" to={item.url}> <div className='left-item' onClick={() => { this.setState({ active: item.url }) }} >
                                <div className="new-notification new-task-menu"><span>{item.title}</span> {notification.new_task && notification.new_task.count > 0 ? <div className="tasks-around">{notification.new_task.count}</div> : null}</div>
                                {window.location.href.includes(item.url) ? <div className="menu-line"></div> : null}
                            </div></NavLink>
                        }
                        return <NavLink key={index} activeClassName="active" to={item.url}> <div className='left-item' onClick={() => { this.setState({ active: item.url }) }} >
                            <span>{item.title}</span>
                            {window.location.href.includes(item.url) ? <div className="menu-line"></div> : null}
                        </div></NavLink>
                    })}
                </div>

            </div>
        );
    }
}


export default connect(
    (state) => ({
        word: state.word, show: state.showReducer,
        managerReducer: state.managerReducer, organization: state.orglist,
        showNavbar: state.showNavbar, notification: state.notification
    }),
    (dispatch) => ({
        managerContShow: (string) => dispatch({
            type: MANAGER_CONT_SHOW, payload: string
        }),
        navbarShow: () => dispatch({ type: "navbar-show" }),
        getOrg: (data) => dispatch(get_org_list(data)),
    })
)(Left);