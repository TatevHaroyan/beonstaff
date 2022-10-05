import {
    EMPLOYEE_DATA, GET_TASKS, GET_STUFF, GET_ORG, GET_ARCHIVE, GET_ORG_LIST,
    SEARCH, GET_EMPLOYEE_DATA, GET_MANAGER, GET_ORG_LIMIT, GET_STUFF_LIMIT, GET_REPEATED_TASKS, DELETE_SEARCH, LOADING, ACTIVEPAGE,
    LOADING_ORG, ACTIVEPAGE_ORG, DELETE_EMPLOYEE_DATA, GET_SEE_NOTIFICATION, GET_NOTIFICATION, TASK_DATA, ACTIVE_PAGE_ORG,
    DELETE_TASK_DATA, CHANGE_STATUS, TAXATION_SYSTEM, TYPEACTIVITY, GET_CARD, GET_COMPANY_FILE, COMPANY_SERVICE, LOADER_FILTER,
    LOADER_COMPANY_FILE, GET_TASKS_TEMPLATE, NEW_TASK_SMS, GET_TASK_SMS, CLEAN_TASKSMS, SET_DAY_REPORTS, EDIT_TASK
} from "./type";
const clean_tasksms = () => ({ type: CLEAN_TASKSMS });
const new_task_sms = (data) => ({ type: NEW_TASK_SMS, payload: data });
const task_sms = (data) => ({ type: GET_TASK_SMS, payload: data });
const set_day_reports = (data) => ({
    type: SET_DAY_REPORTS,
    payload: data
})
const get_task_template = (data) => ({
    type: GET_TASKS_TEMPLATE,
    payload: data
})
const loader_company_file = (data) => ({
    type: LOADER_COMPANY_FILE,
    payload: data
})
const loader_filter = (data) => ({
    type: LOADER_FILTER,
    payload: data
})
const company_service = (data) => ({
    type: COMPANY_SERVICE,
    payload: data
})
const get_company_file = (data) => ({
    type: GET_COMPANY_FILE,
    payload: data
})
const change_status = (data) => ({
    type: CHANGE_STATUS,
    payload: data
})
const active_page_org = (data) => ({
    type: ACTIVE_PAGE_ORG,
    payload: data
})
const task_data = (data) => ({
    type: TASK_DATA,
    payload: data
})
const getSeeNotification = (data) => ({
    type: GET_SEE_NOTIFICATION,
    payload: data
})
const getNotificationAction = (data) => ({
    type: GET_NOTIFICATION,
    payload: data
})
const activePageOrg = (page) => ({
    type: ACTIVEPAGE_ORG,
    payload: page
})
const loadingOrg = (data) => ({
    type: LOADING_ORG,
    payload: data
})
const activePage = (page) => ({
    type: ACTIVEPAGE,
    payload: page
})
const loading = () => ({
    type: LOADING,
})
const employeeAction = (empData) => ({
    type: EMPLOYEE_DATA,
    payload: empData
})
const tasksAction = (data) => ({
    type: GET_TASKS,
    payload: data
})
const stuffAction = (data) => ({
    type: GET_STUFF,
    payload: data
})
const orgAction = (data) => ({
    type: GET_ORG,
    payload: data
})
const archiveAction = (data) => ({
    type: GET_ARCHIVE,
    payload: data
})
const searchAction = (text) => ({
    type: SEARCH,
    payload: text
})
const employeeDataAction = (data) => ({
    type: GET_EMPLOYEE_DATA,
    payload: data
})
const employeeManagerAction = (data) => ({
    type: GET_MANAGER,
    payload: data
})
const get_stuff_limit = (data) => ({
    type: GET_STUFF_LIMIT,
    payload: data
})
const get_org_limit = (data) => ({
    type: GET_ORG_LIMIT,
    payload: data
})
const get_repeated_tasks = (data) => ({
    type: GET_REPEATED_TASKS,
    payload: data
})
// DELETE_SEARCH
const delete_search = () => ({
    type: DELETE_SEARCH,
})
const delete_emaployee_data = () => ({
    type: DELETE_EMPLOYEE_DATA,
})
const delete_task_data = () => ({
    type: DELETE_TASK_DATA,
})
const CardAction = (data) => ({
    type: GET_CARD,
    payload: data
})
const TypeactivityAction = (data) => ({
    type: TYPEACTIVITY,
    payload: data
})
const TaxationSystemAction = (data) => ({
    type: TAXATION_SYSTEM,
    payload: data
})
const get_org_list = (data) => ({
    type: GET_ORG_LIST,
    payload: data
})
const edit_task = (data) => {
    return { type: EDIT_TASK, payload: data }
}
export {
    employeeAction, tasksAction, stuffAction, orgAction, archiveAction, searchAction, employeeDataAction, employeeManagerAction,
    get_stuff_limit, get_org_limit, get_repeated_tasks, delete_search, loading, activePage, loadingOrg, activePageOrg, delete_emaployee_data,
    getSeeNotification, getNotificationAction, task_data, active_page_org, delete_task_data, change_status, CardAction, TypeactivityAction,
    TaxationSystemAction, get_org_list, get_company_file, company_service, loader_filter, loader_company_file, get_task_template,
    new_task_sms, task_sms, clean_tasksms, set_day_reports, edit_task
}