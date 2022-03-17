import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row } from "react-bootstrap";
import { Route, Switch, Redirect } from "react-router-dom";
import Left from "./Left";
import Staff from "./Staff/Staff";
import Organizations from "./Organizations/Organizations";
import Files from "./Organizations/Files";
import ManagerRecommendations from "./task/ManagerRecommendation/ManagerRecommendation";
import EmployeePage from "./Staff/EmployeePage";
import ManagerOrg from "./Organizations/ManagerOrg";
import Users from "./Users/Users";
import Tasks from "../view/task/Tasks";
import Archive from "../view/task/Archive";
import MyPage from "./Mydata/MyPage";
import UserPage from "./Users/UserPage";
import TypeStaff from './Staff/TypeStaff';
import Note from "./Note/Note";
import RepeatedTask from "./task/RepeatedTask";
import RepeatedTaskPage from "./task/RepeatedTaskPage";
import NotificationPage from "./Notification/NotificationPage";
import Notification from "./Notification/Notification";
import Reports from "./Reports";
import '../assets/css/manager.css';
class ManagerContant extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activItem: "stuff"
        }
    }
    render() {
        return (
            <div className='manager-main'>
                <div className='container'>
                    <Row className="flex-nowrap">
                        <Left />
                        <div className='right'>
                            <Switch>
                                <Route path="/main_employee/reports" component={Reports} />
                                <Route path="/main_employee/staff/:type/:id" component={EmployeePage} />
                                <Route path="/main_employee/staff/:type" component={Staff} />
                                <Route path="/main_employee/organization/:id" component={ManagerOrg} />
                                <Route path="/main_employee/staff" component={TypeStaff} />
                                <Route path="/main_employee/organization" component={Organizations} />
                                <Route path="/main_employee/organization_file" component={Files} />
                                <Route path="/main_employee/users/:id" component={UserPage} />
                                <Route path="/main_employee/users" component={Users} />
                                <Route path="/main_employee/tasks/:id" component={ManagerRecommendations} />
                                <Route path="/main_employee/tasks" component={Tasks} />
                                <Route path="/main_employee/tasks/:name/:id" component={Tasks} />
                                <Route path="/main_employee/mypage" component={MyPage} />
                                <Route path="/main_employee/archive/:id" component={ManagerRecommendations} />
                                <Route path="/main_employee/archive" component={Archive} />
                                <Route path="/main_employee/note" component={Note} />
                                <Route path="/main_employee/repeated_task/:id" component={RepeatedTaskPage} />
                                <Route path="/main_employee/repeated_task" component={RepeatedTask} />
                                <Route path="/main_employee/notification/:id" component={NotificationPage} />
                                <Route path="/main_employee/notification" component={Notification} />
                                <Redirect from="/*" to={localStorage.getItem("profession") === "manager" ? '/main_employee/staff' : "/main_employee/tasks"} />
                            </Switch>
                        </div>
                    </Row>
                </div>
            </div>
        );
    }
}
export default connect(
    (state) => ({ word: state.word, activItem: state.managerReducer }),
)(ManagerContant);