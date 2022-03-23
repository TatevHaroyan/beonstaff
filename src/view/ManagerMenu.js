import React, { Component } from 'react';
import { NavLink } from "react-router-dom";
import { MANAGER_CONT_SHOW, NAVBAR_SHOW } from "../action/type";
import { connect } from 'react-redux';
import MyImgRound from "../components/MyImgRound";
import Settings from "./Mydata/Settings/Settings";
import Timer from "../components/Timer";

class ManagerMenu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            menuManager: [
                {
                    id: 1,
                    url: "/main_employee/stuff",
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
                    url: "/main_employee/archive",
                    title: this.props.word.archive,
                    active: false,
                },
                {
                    id: 3,
                    url: "/main_employee/repeated_task",
                    title: "Պարբերվող կրկնվող Առաջադրանքներ",
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

            ]
        }
    }
    render() {
        let prof = localStorage.getItem("profession")
        const { employee, notification } = this.props
        return (
            <div className="manager-menu">
                {this.state.showSettingsModal
                    ? <div className='popup'
                        onClick={() => { this.setState({ showSettingsModal: false }) }}>
                    </div>
                    : null}
                {this.state.showSettingsModal
                    ? <Settings close={() => this.setState({ showSettingsModal: false })} />
                    : null}
                <div className='left-item left-item-hidden'>
                    <MyImgRound image={employee.image} />
                    <div className='left-item-name'>
                        <span><a href="/main_employee/mypage" >{employee.user.first_name} {employee.user.last_name}</a></span>
                        <Timer />
                        <div className="menu-line-active"></div>
                    </div>
                </div>
                {(prof === "manager" ? this.state.menuManager : this.state.menuAccountant).map((item, index) => {
                    if (item.id === 5 && prof !== "manager") {
                        return <NavLink key={index} activeClassName="active" to={item.url}>
                            <div className='left-item'
                                onClick={() => { this.setState({ active: true }) }}
                            >
                                <div className="new-notification">
                                    {console.log(notification, "7777777777777notification")}
                                    <span>{item.title}</span>
                                    {notification.results && notification.results.length > 0
                                        ? <div className="tasks-around">{notification.count}</div>
                                        : null}</div>
                                {window.location.href.includes(item.url) ? <div className="menu-line"></div> : null}
                            </div></NavLink>
                    }
                    if ((item.id === 4 && prof === "manager") || (item.id === 1 && prof !== "manager")) {
                        return <NavLink key={index} activeClassName="active" to={item.url}>
                            <div className='left-item' onClick={() => { this.setState({ active: true }) }} >
                                <div className="new-notification new-task-menu">
                                    <span>{item.title}</span>
                                    {notification.new_task
                                        ? <div className="tasks-around">{notification.new_task.count}</div>
                                        : null}</div>
                                {window.location.href.includes(item.url)
                                    ? <div className="menu-line"></div>
                                    : null}
                            </div></NavLink>
                    }
                    return <NavLink key={index}
                        activeClassName="active"
                        to={item.url}>
                        <div className='left-item'
                            onClick={() => { this.props.navbarShow() }} >
                            <span>{item.title}</span>
                            {window.location.href.includes(item.url)
                                ? <div className="menu-line"></div>
                                : null}
                        </div></NavLink>
                })}
                <div className='left-item left-item-hidden'><div onClick={() => {
                    this.setState({ showSettingsModal: true })
                }}>էջի կարգավորումներ</div></div>
                <div className='left-item left-item-hidden'>
                    <div className='' onClick={() => {
                        localStorage.clear()
                        window.location = "/employee"
                    }}>
                        <span>Դուրս գալ</span>
                    </div>
                </div>
            </div>
        );
    }
}
export default connect(
    (state) => ({
        word: state.word,
        show: state.showReducer,
        employee: state.loginReducer,
        showNavbar: state.showNavbar,
        notification: state.notification
    }),
    (dispatch) => ({
        managerContShow: (string) => dispatch({
            type: MANAGER_CONT_SHOW, payload: string
        }),
        navbarShow: () => dispatch({ type: NAVBAR_SHOW })
    })
)(ManagerMenu);