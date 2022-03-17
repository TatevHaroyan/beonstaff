import { combineReducers } from 'redux';
import wordReducer from './wordReducer';
import showReducer from "./showReducer";
import loginReducer from "./loginReducer";
import tasks from "./tasksReducer";
import stuff from "./stuffReducer";
import organization from "./orgReducer";
import archive from "./archiveReducer";
import search from "./searchReducer";
import accountant from "./employeeReducer";
import manager from "./managerReducer";
import limit_data from "./stuffOrgLimit";
import repeatedTaskReducer from "./repeatedTaskReducer";
import notification from "./notification";
import see_notification from "./see_notification";
import changeStatus from "./changeStatus";
import taskReducer from "./taskReducer";
import orglist from "./orgListReducer";
import card from "./cardReducer";
import companyFile from "./companyFileReducer";
import companyService from "./companyService";
import { typeActivity, taxationSystem } from "./companyItemReducer";
import taskTemplate from "./taskTemplate";
import tasksSms from './tasksSms';
import dayReports from './dayReportsReducer';
import {
    // managerReducer, 
    showNavbar
}
    from "./showComponentsReducer";

export default combineReducers(
    {
        companyFile,
        typeActivity,
        taxationSystem,
        word: wordReducer,
        taskReducer,
        showReducer,
        loginReducer,
        repeatedTaskReducer,
        // managerReducer,
        showNavbar,
        tasks,
        stuff,
        organization,
        archive,
        search,
        accountant,
        manager,
        limit_data,
        see_notification,
        notification,
        changeStatus,
        card,
        orglist,
        companyService,
        taskTemplate,
        tasksSms,
        dayReports
        // profession
    }
)

