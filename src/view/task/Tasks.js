import React, { Component } from 'react';
import RecommendationsItem from "../../components/RecommendationsItem";
import { Col, Row } from "react-bootstrap";
import Button from 'react-bootstrap/Button'
import Collapse from 'react-bootstrap/Collapse';

// import DatePicker from "react-modern-calendar-datepicker";
// import "react-modern-calendar-datepicker/lib/DatePicker.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import MyButton from "../../components/Button/Button";
import NewRecommendation from "./NewRecommendations/NewRecommendations";
import NewTaskMuchOrgs from "./NewRecommendations/NewTaskMuchOrgs";
import Loader from 'react-loader-spinner';
import { orgAction, stuffAction, get_stuff_limit, get_org_limit, employeeAction } from "../../action";
import { getTaskByFilters, deleteArchive, getMe, getMeById } from "../../api";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Pagination from "react-js-pagination";
import { connect } from 'react-redux';
import "../../assets/css/tasks.css";
import 'moment/locale/hy-am';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import SearchBar from "../../components/SearchBar";
import CheckboxFilter from "../../components/CheckboxFilter";
import * as queryString from "../../utils/query-string";
const profession = localStorage.getItem("profession");
const date = new Date()
date.setMonth(date.getUTCMonth() - 3)
const end_date = new Date()
end_date.setDate(end_date.getUTCDate() + 1);
const customStyles = {
    option: (provided, state) => ({
        ...provided,
        fontSize: window.innerWidth <= 425 ? 10 : 16
    }),
    multiValueLabel: (base, state) => {
        return { ...base, fontSize: window.innerWidth > 425 ? 16 : 10, padding: window.innerWidth > 425 ? 6 : 3 };
    },
    multiValueRemove: (base, state) => {
        return state.data.isFixed ? { ...base, padding: 3 } : base;
    },
}
const colourStyles = {
    // input: styles => ({ ...styles, fontSize: window.innerWidth > 425 ?16:10, }),
    // placeholder: styles => ({ ...styles }),
    singleValue: (styles, { data }) => ({ ...styles, fontSize: window.innerWidth > 425 ? 16 : 10, }),
};

class Tasks extends Component {
    constructor(props) {
        super(props);
        this.state = {
            start_date: {
                year: date.getUTCFullYear(),
                month: date.getUTCMonth(),
                day: date.getUTCDate(),
            },
            end_date: {
                year: end_date.getUTCFullYear(),
                month: end_date.getUTCMonth() + 1,
                day: end_date.getUTCDate(),
            },
            checked: false,
            no_checked: false,
            my_task: false,
            my_append_task: false,
            file_exit: false,
            count: 0,
            activePage: 1,
            show: false,
            is_archive: false,
            taskByStatus: [],
            is_active: false,
            passive: false,
            fliter: {
                is_after_deadline: null,
                status: profession !== "accountant" ? "new" : "approved",
                created_date: this.start_end_filter().start_date,
                created_date_end: this.start_end_filter().end_date,
                company: '',
                accountant: '',
                // localStorage.getItem("profession") === "accountant"?localStorage.getItem("id"):"", 
                is_archive: false,
                order_by: "desc created_date",
                page: 1,
                name: "",
                manager: ""
            },
            start_date: date,
            end_date: end_date,
            activeId: profession === "accountant" ? 2 : 1,
            selected_accountant: null,
            selected_manager: null,
            selected_company: null,
            buttons: [
                {
                    status: "new",
                    title: this.props.word.new_created
                },
                {
                    status: "approved",
                    title: this.props.word.approved
                },
                {
                    status: "process",
                    title: this.props.word.in_the_process
                },
                {
                    status: "end",
                    title: this.props.word.completed
                },
            ]
        }
    }
    params = queryString.parse(location.search);
    componentDidMount() {
        // this.getMe()
        this.initFilter()
    }
    componentWillReceiveProps(next_props) {
        let manager = null
        if (next_props.manager.length !== this.props.manager.length) {
            for (let index = 0; index < next_props.manager.length; index++) {
                const element = next_props.manager[index];
                if (element.value === parseInt(this.params.manager, 10)) {
                    manager = element
                }
            }
            this.setState({ selected_manager: manager })
        }
        if (next_props.limit_data.stuff.length !== this.props.limit_data.stuff.length) {
            this.setState({ selected_accountant: this.getSeletedList(next_props.limit_data.stuff, "stuff") })
        }
        if (next_props.limit_data.orgs.length !== this.props.limit_data.orgs.length) {
            this.setState({ selected_company: this.getSeletedList(next_props.limit_data.orgs, "company") })
        }
    }
    getMe() {
        let token = localStorage.getItem("token") || null
        if (token) {
            getMe(token, profession).then((user) => {
                localStorage.setItem("id", user.id)
                localStorage.setItem("user_id", user.user_id)
                this.initFilter(user.id)
                this.getMeById(user.id)
            })
                .catch((error) => {
                    console.log(error);
                })
        }
    }
    getMeById(id) {
        let token = localStorage.getItem("token")
        getMeById(id, token, profession).then((getme) => {
            this.props.getMyInfo(getme)
        }).catch((error) => console.log(error)
        )
    }
    getSeletedList(array, name) {
        let selected_string = (name === "company") ? this.params.company : this.params.accountant;
        let selected = selected_string ? selected_string.split(",") : '';
        let new_selected_list = [];
        for (let i = 0; i < array.length; i++) {
            for (let j = 0; j < selected.length; j++) {
                if (parseInt(selected[j], 10) === array[i].value) {
                    new_selected_list.push(array[i])
                }
            }
        }
        return new_selected_list
    }
    start_end_filter() {
        switch (this.params.status) {
            case "new":
                return {
                    end_date: this.params.created_date_end ? this.params.created_date_end : `${end_date.getFullYear()}-${end_date.getMonth() + 1}-${end_date.getDate()}`,
                    start_date: this.params.created_date ? this.params.created_date : `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
                };
            case "approved":
                return {
                    end_date: this.params.created_date_end ? this.params.created_date_end : `${end_date.getFullYear()}-${end_date.getMonth() + 1}-${end_date.getDate()}`,
                    start_date: this.params.created_date ? this.params.created_date : `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
                };
            case "process":
                return {
                    end_date: this.params.start_date_end,
                    start_date: this.params.start_date
                };
            case "end":
                return {
                    end_date: this.params.end_date_end,
                    start_date: this.params.end_date
                };
            default:
        }
        return {
            end_date: `${end_date.getFullYear()}-${end_date.getMonth() + 1}-${end_date.getDate()}`,
            start_date: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
        }
    }
    initFilter() {
        let manager = "";
        const params = queryString.parse(location.search);
        const id = localStorage.getItem("id")
        if (profession === "accountant") {
            this.setFilter({ accountant: id, is_archive: false, order_by: "desc created_date" })
        } else {
            this.setFilter({ is_archive: false })
        }
        for (let index = 0; index < this.props.manager.length; index++) {
            const element = this.props.manager[index];
            if (element.value === parseInt(this.params.manager, 10)) {
                manager = element
            }
        }
        this.setState({
            selected_accountant: this.getSeletedList(this.props.limit_data.stuff ? this.props.limit_data.stuff : [], "stuff"),
            selected_company: this.getSeletedList(this.props.limit_data.orgs ? this.props.limit_data.orgs : [], "company"),
            selected_manager: manager,
            my_task: params.manager && localStorage.getItem("id") === params.manager && params.accountant === null ? true : false,
            my_append_task: params.manager && params.accountant === "" ? true : false,
            checked: params.checked === "true" ? true : false,
            no_checked: params.checked === "false" ? true : "",
            file_exit: params.file_exit === "true" ? true : "",
            is_active: params.is_active === "true" ? true : false,
            passive: params.is_active === "false" ? true : false,
            is_after_deadline: params.is_after_deadline === "true" ? true : null,
            fliter: {
                ...this.state.fliter,
                ...params,
            }
        })
    }
    getData(filter) {
        this.setState({ loading: true })
        getTaskByFilters(filter).then((res) => {
            const params = queryString.parse(location.search)
            this.setState({
                loading: false,
                taskByStatus: res.results,
                count: res.count,
                activePage: params.offset ? (params.offset / 10 + 1) : 1,
                fliter: {
                    ...this.state.fliter,
                    status: params.status ? params.status : this.state.fliter.status
                }

            })
        }
        )
    }
    setFilter(newFilter) {
        const params = queryString.parse(location.search);
        const profession = localStorage.getItem("profession");
        const tmp = {
            ...this.state.fliter,
            ...params,
            ...newFilter,
        }
        this.setState({
            fliter: tmp
        })
        const stringified = queryString.stringify({ ...params, ...tmp });
        if (history.pushState) {
            var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?' + stringified;
            window.history.pushState({ path: newurl }, '', newurl);
        }
        if (tmp.accountant && profession === "accountant") {
            this.getData(tmp)
        }
        if (profession === "manager") {
            this.getData(tmp)
        }
    }
    handleChangestartDate = date => {
        this.setState({
            start_date: date
        })
        let data = {};
        let start_date = `${date.year}-${date.month}-${date.day}`;
        switch (this.state.fliter.status) {
            case "new":
                data["created_date"] = start_date;
                break
            case "approved":
                data["created_date"] = start_date;
                break
            case "process":
                data["start_date"] = start_date;
                break
            case "end":
                data["end_date"] = start_date;
                break
            default:
        }
        this.setFilter(data)
    };
    handleChangefinishDate = date => {
        let end_date = `${date.year}-${date.month}-${date.day}`
        let data = {};
        this.setState({
            loading: true,
            end_date: date,
        });
        switch (this.state.fliter.status) {
            case "new":
                data["created_date_end"] = end_date;
                break
            case "approved":
                data["created_date_end"] = end_date;
                break
            case "process":
                data["start_date_end"] = end_date;
                break
            case "end":
                data["end_date_end"] = end_date;
                break
            default:
        }
        this.setFilter(data)
    };

    handlePageChange(pageNumber) {
        this.setState({ loading: true })
        this.setFilter({ offset: pageNumber === 1 ? "" : (pageNumber - 1) * 10 })
    }
    styleByStatus(status) {
        switch (status) {
            case "new":
                return "#707070";
            case "approved":
                return "#707070";
            case "process":
                return "#FF7700";
            case "end":
                return "#63c0ba";
            default:
        }

    }
    onChangeSelectCompany(list) {
        this.setState({ selected_company: list, loading: true, })
        let company_list = [];
        if (list) {
            for (let index = 0; index < list.length; index++) {
                const element = list[index];
                company_list.push(element.value)
            }
        }
        let company = list ? company_list.join(",") : "";
        this.setFilter({ company })
    }
    onChangeSelectEmployee(list) {
        this.setState({ selected_accountant: list })
        let accountant_list = []
        if (list) {
            for (let index = 0; index < list.length; index++) {
                const element = list[index];
                accountant_list.push(element.value)
            }
        }
        let accountant = list ? accountant_list.join(",") : "";
        this.setFilter({ accountant })
    }
    onChangeSelectManager(element) {
        this.setState({ selected_manager: element })
        this.setFilter({ manager: element ? element.value : "" })
    }
    loading(data) {
        data.sort(function (a, b) {
            return b.new_sms_count - a.new_sms_count
        })
        if (data.length > 0 && this.state.loading === false) {
            return data.map((item, index) => {
                return <Col sm={6} key={index} >
                    <RecommendationsItem
                        child_tasks={item.parent_task && item.parent_task.length > 0}
                        toLink={`/main_employee/tasks/${item.id}`}
                        item={item}
                        modalShow={() => this.setState({ deleteVisible: !this.state.deleteVisible, delete_id: item.id })}
                        getTaskData={() => this.setFilter()}
                        {...this.props}
                        color={this.styleByStatus(item.status)}
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
            return <div className="no_tasks">{this.props.word.no_tasks}</div>
        }
    }
    filterStatus(item) {
        this.setState({
            loading: true
        })
        let data = {}
        data.status = item.status
        data.order_by = "";
        let end_date = `${this.state.end_date.getFullYear()}-${this.state.end_date.getMonth() + 1}-${this.state.end_date.getDate()}`;
        let start_date = `${this.state.start_date.getFullYear()}-${this.state.start_date.getMonth() + 1}-${this.state.start_date.getDate()}`;
        switch (item.status) {
            case "approved":
                data.order_by = "desc created_date";
                data.created_date = start_date;
                data.start_date = "";
                data.end_date = "";
                data.created_date_end = end_date;
                data.start_date_end = "";
                data.end_date_end = "";
                break;
            case "new":
                data.order_by = "desc created_date";
                data.created_date = start_date;
                data.start_date = "";
                data.end_date = "";
                data.created_date_end = end_date;
                data.start_date_end = "";
                data.end_date_end = "";
                break;
            case "process":
                data.order_by = "desc start_task_date";
                data.created_date = "";
                data.start_date = start_date;
                data.end_date = "";
                data.created_date_end = "";
                data.start_date_end = end_date;
                data.end_date_end = "";
                break;
            case "end":
                data.order_by = "desc end_task_date";
                data.created_date = "";
                data.start_date = "";
                data.end_date = start_date;
                data.created_date_end = "";
                data.start_date_end = "";
                data.end_date_end = end_date;
                break;
            default:
                break;
        }
        data.offset = ""
        this.setFilter(data)
    }
    render() {
        const animatedComponents = makeAnimated();
        const { word, limit_data, employee, manager, manager_loader } = this.props;
        console.log("in rendeeeer");
        return (
            <div className='tasks'>
                {this.state.deleteVisible
                    ? <div className="popup" onClick={() => this.setState({ deleteVisible: false })}>
                    </div>
                    : null}
                {this.state.show || this.state.showMulti
                    ? <div className='popup' onClick={() => {
                        this.setState({ show: false, showMulti: false })
                    }}></div>
                    : null}
                {this.state.deleteVisible ? <div className="delete-note">
                    <div className="delete-text">Ջնջե՞լ</div>
                    <div className="note-buttons">
                        <MyButton
                            buttonStyle="blue-button"
                            onChangeValue={() => deleteArchive(this.state.delete_id)
                                .then(() => {
                                    this.setState({ deleteVisible: false });
                                    this.setFilter();
                                })}
                            title={word.yes}
                        />
                        <MyButton
                            buttonStyle="blue-button"
                            onChangeValue={() => this.setState({ deleteVisible: false })}
                            title={word.no}
                        />
                    </div>
                </div> : null}
                <div className="plus-cont" onClick={() => {
                    this.setState({ show: true })
                }}><span className='plus'>+</span>
                    <span className="tooltiptext">{word.addItem}</span>
                </div>
                <div className="plus-cont" onClick={() => {
                    this.setState({ showMulti: true })
                }}><span className='plus'>+</span>
                    <span className="tooltiptext">Ավելացնել առաջադրանքներ մի քանի կազմակերպությունների համար</span>
                </div>
                <Button
                    onClick={() => this.setState({ open: !this.state.open })}
                    aria-controls="example-collapse-text"
                    aria-expanded={this.state.open}
                >
                    Ֆիլտրել առաջադրանքները
                </Button>
                <Collapse in={this.state.open}>
                    <div id="example-collapse-text">
                        {profession !== "accountant" ? <CheckboxFilter title="Իմ առաջադրանքները" my_task={this.state.my_task}
                            onChange={() => {
                                this.setState({ my_task: !this.state.my_task, my_append_task: false, selected_manager: null })
                                this.setFilter({ accountant: null, manager: !this.state.my_task ? employee.id : "" })
                            }} /> : null}
                        {profession !== "accountant" ?
                            <CheckboxFilter title="Ինձ կցված առաջադրանքները" my_task={this.state.my_append_task}
                                onChange={() => {
                                    this.setState({
                                        my_append_task: !this.state.my_append_task,
                                        my_task: false, selected_manager: null,
                                        selected_accountant: null
                                    })
                                    this.setFilter({
                                        accountant: "",
                                        manager: !this.state.my_append_task
                                            ? localStorage.getItem("id")
                                            : ""
                                    })
                                }} /> : null}
                        <CheckboxFilter title="Ֆայլերով"
                            my_task={this.state.file_exit}
                            onChange={() => {
                                this.setState({ file_exit: !this.state.file_exit })
                                this.setFilter({ file_exit: !this.state.file_exit === true ? !this.state.file_exit : "" })
                            }}
                        />
                        <CheckboxFilter title="Ստուգված" my_task={this.state.checked}
                            onChange={() => {
                                this.setState({ checked: this.state.checked ? "" : true, no_checked: false })
                                this.setFilter({ checked: this.state.checked ? "" : true })
                            }}
                        />
                        <CheckboxFilter title="Չստուգված" my_task={this.state.no_checked}
                            onChange={() => {
                                this.setState({ no_checked: this.state.no_checked ? "" : true, checked: false })
                                this.setFilter({ checked: this.state.no_checked ? "" : false })
                            }}
                        />
                        <CheckboxFilter title="Ակտիվ" my_task={this.state.is_active}
                            onChange={() => {
                                this.setState({ is_active: this.state.is_active ? "" : true, passive: false })
                                this.setFilter({ is_active: this.state.is_active ? "" : true })
                            }}
                        />
                        <CheckboxFilter title="Պասիվ" my_task={this.state.passive}
                            onChange={() => {
                                this.setState({ passive: this.state.passive ? "" : true, is_active: false })
                                this.setFilter({ is_active: this.state.passive ? "" : false })
                            }}
                        />
                        <CheckboxFilter title="Ժամկետանց" my_task={this.state.is_after_deadline}
                            onChange={() => {
                                this.setState({ is_after_deadline: !this.state.is_after_deadline ? true : null })
                                this.setFilter({ is_after_deadline: this.state.is_after_deadline ? null : true })
                            }}
                        />
                    </div>
                </Collapse>
                <div className={localStorage.getItem("profession") === "manager" ? 'tasks-data tasks-data-manager' : 'tasks-data'}>
                    <span className='tasks-data-item'>
                        {/* <DatePicker
                            value={this.state.start_date}
                            onChange={this.handleChangestartDate}
                            inputPlaceholder="Ընտրել ժամանակահատված"
                            shouldHighlightWeekends
                            calendarClassName=""
                        /> */}
                        <DatePicker
                            dateFormat="dd/MM/yyyy"
                            selected={this.state.start_date}
                            onChange={this.handleChangestartDate}
                        />
                    </span>
                    <div className='middle-line'></div>
                    <span className='tasks-data-item'>
                        {/* <DatePicker
                            value={this.state.end_date}
                            onChange={this.handleChangefinishDate}
                            inputPlaceholder="Ընտրել ժամանակահատված"
                            shouldHighlightWeekends
                            calendarClassName=""
                        /> */}
                        <DatePicker
                            dateFormat="dd/MM/yyyy"
                            selected={this.state.end_date}
                            onChange={this.handleChangefinishDate}
                        />
                    </span>
                    <div className='middle-line'></div>
                    <div className='tasks-data-hidden'>
                        <Select
                            styles={customStyles}
                            isLoading={limit_data.loader_orgs}
                            value={this.state.selected_company}
                            // defaultValue={this.props.limit_data.orgs ? this.getSeletedList(this.props.limit_data.orgs, "company") : []}
                            closeMenuOnSelect={false}
                            components={animatedComponents}
                            options={limit_data.orgs}
                            onChange={(list) => {
                                this.onChangeSelectCompany(list)
                            }}
                            placeholder={word.organizations}
                            isMulti
                        />
                    </div>
                    {profession !== "accountant" && !this.state.my_task ? <div className='middle-line'></div> : null}
                    {profession !== "accountant" && !this.state.my_task ?
                        <div className='tasks-data-hidden'>
                            <Select
                                isLoading={limit_data.loader_stuff}
                                styles={customStyles}
                                value={this.state.selected_accountant}
                                // defaultValue={this.props.limit_data.stuff ? this.getSeletedList(this.props.limit_data.stuff, "stuff") : []}
                                closeMenuOnSelect={false}
                                components={animatedComponents}
                                options={limit_data.stuff}
                                onChange={(option) => {
                                    this.onChangeSelectEmployee(option)
                                }}
                                placeholder={word.employees}
                                isMulti
                            />
                        </div> : null}
                    {profession !== "accountant" && !this.state.my_task ?
                        <div className='tasks-data-hidden'>
                            <Select
                                isLoading={manager_loader}
                                styles={colourStyles}
                                value={this.state.selected_manager}
                                closeMenuOnSelect={false}
                                components={animatedComponents}
                                options={manager}
                                onChange={(option) => {
                                    this.onChangeSelectManager(option)
                                }}
                                isClearable={true}
                                placeholder="Մենեջեր"
                            />
                        </div> : null}

                </div>
                < SearchBar value={this.state.fliter.name} onChange={(value) => this.setFilter({ name: value })} />
                <div className='tasks-buttons'>
                    {this.state.buttons.map((item, index) => {
                        if (item.status === "new" && profession === "accountant") { return null }
                        return <MyButton key={index}
                            buttonStyle={this.state.fliter.status !== item.status ?
                                "middle-button task-button" : "middle-button task-button task-button-active"} title={item.title} onChangeValue={() => {
                                    this.setState({ fliter: { ...this.state.fliter, status: item.status } })
                                    // let data={
                                    //     status:item.status
                                    // }
                                    this.filterStatus(item)
                                    // localStorage.getItem("profession") === "manager" ? this.getMyTasksStatus(item.status) : this.getAccountantTasks(item.status)
                                }
                                } />
                    })}
                </div>
                {this.state.show ? <NewRecommendation
                    close={() => {
                        this.setState({ show: false, activeId: 2 })
                        this.filterStatus({ status: "approved" })
                    }}
                /> : null}
                {this.state.showMulti ? <NewTaskMuchOrgs close={() => {
                    this.setState({ showMulti: false, activeId: 2 })
                    this.filterStatus({ status: "approved" })
                    // this.setFilter({ status: "approved", offset: "" })
                    // this.getAccountantTasks("approved")
                }} /> : null}
                <div className='tasks-cont'>
                    <Row className=" flex-row">
                        {localStorage.getItem("id") ? this.loading(this.state.taskByStatus) : <div className="please-repeat" onClick={() => this.getMe()}>Խնդրում եմ նորից կրկնել</div>}
                    </Row>
                </div>
                {this.state.loading === false && this.state.count > 10 ? <Pagination
                    activePage={this.state.activePage}
                    itemsCountPerPage={10}
                    totalItemsCount={this.state.count}
                    pageRangeDisplayed={5}
                    onChange={(data) => this.handlePageChange(data)}
                />
                    : null}
            </div>
        );
    }
}
export default connect(
    (state) => ({
        word: state.word, show: state.showReducer, tasks: state.tasks, organization: state.organization.results,
        stuffs: state.stuff.results, limit_data: state.limit_data, employee: state.loginReducer, manager: state.manager.multi_manager,
        manager_loader: state.manager.loader
    }),
    (dispatch) => ({
        getOrg: (data) => dispatch(orgAction(data)),
        getStuff: (data) => dispatch(stuffAction(data)),
        getLimitOrg: (data) => dispatch(get_org_limit(data)),
        getLimitStuff: (data) => (dispatch(get_stuff_limit(data))),
        getMyInfo: (data) => dispatch(employeeAction(data)),
    })
)(Tasks);