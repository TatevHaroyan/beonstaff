import React, { Component } from 'react';
import Button from "../../components/Button/Button";
// import { Link } from "react-router-dom";
import { connect } from 'react-redux';
import TaskItem from "../../components/TaskItem";
import { archiveAction } from "../../action/index";
// import { getAccountantTasks } from "../../api";
import Loader from 'react-loader-spinner';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import { getTaskByFilters, deleteArchive } from "../../api";
import { orgAction, stuffAction, } from "../../action";
import '../../assets/css/manager.css';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from 'moment';
import 'moment/locale/hy-am';
import Pagination from "react-js-pagination";
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import * as queryString from "../../utils/query-string";
import SearchBar from '../../components/SearchBar';

const date = new Date()
date.setMonth(date.getUTCMonth() - 3)
const end_date = new Date()
end_date.setDate(end_date.getUTCDate() + 1)
class Archive extends Component {
    // fliter = {
    //     status: "new",
    //     page: 1,
    //     start_date: "",
    //     end_date: "",
    //     org: 1,
    //     employeer: 1,
    // }
    constructor(props) {
        super(props);
        this.state = {
            count: 0,
            activePage: 1,
            show: false,
            orgname: "",
            employeename: "",
            is_archive: false,
            taskByStatus: [],
            fliter: {
                status: "end",
                start_date: "",
                end_date: "",
                company: '',
                accountant: "",
                page: 1,
                name: ""
            },
            // status: localStorage.getItem("profession") !== "accountant" ? "new" : "approved",
            start_date: this.params.start_date ? new Date(this.params.start_date) : date,
            end_date: this.params.end_date ? new Date(this.params.end_date) : end_date,
            // selectedOrg: [],
            // selectedEmp: []
        }
    }
    params = queryString.parse(location.search);
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
    componentDidMount() {
        this.initFilter()
    }
    initFilter() {
        const params = queryString.parse(location.search);
        if (localStorage.getItem("profession") === "accountant") {
            this.setFilter({ accountant: localStorage.getItem("id"), is_archive: true })
        } else {
            this.setFilter({ is_archive: true })
        }
        this.setState({
            fliter: {
                ...this.state.fliter,
                ...params
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
                    status: "end"
                }
            })
        }
        )
    }
    setFilter(newFilter) {
        const params = queryString.parse(location.search)
        const tmp = {
            ...this.state.fliter,
            ...params,
            ...newFilter
        }
        this.setState({
            fliter: tmp
        })
        const stringified = queryString.stringify({ ...params, ...tmp });
        if (history.pushState) {
            var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?' + stringified;
            window.history.pushState({ path: newurl }, '', newurl);
        }
        this.getData(tmp)

    }
    handleChangestartDate = date => {
        this.setState({
            start_date: date
        })
        let start_date = `${date.getUTCFullYear()}-${date.getUTCMonth() + 1}-${date.getUTCDate()}`;
        this.setFilter({ start_date })
    };
    handleChangefinishDate = date => {
        let end_date = `${date.getUTCFullYear()}-${date.getUTCMonth() + 1}-${date.getUTCDate()}`
        this.setState({
            loading: true,
            end_date: date,
        });
        this.setFilter({ end_date })
    };
    handlePageChange(pageNumber) {
        this.setState({ loading: true, })
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
        this.setState({ selectedOrg: list, loading: true, })
        let company_list = [];
        for (let index = 0; index < (list !== null ? list.length : []); index++) {
            const element = list[index];
            company_list.push(element.value)
        }
        let company = company_list.join(",")
        this.setFilter({ company })
    }
    onChangeSelectEmployee(list) {
        // this.setState({ selectedEmp: list, loading: true, })
        let accountant_list = []
        if (list) {
            for (let index = 0; index < list.length; index++) {
                const element = list[index];
                accountant_list.push(element.value)
            }
        }
        let accountant = accountant_list.join(",")
        this.setFilter({ accountant })
    }
    _deleteArchive() {
        let id = this.state.deleteId
        deleteArchive(id)
            .then(() => {
                this.setFilter()
                this.setState({ deleteVisible: false })
            })
    }
    loading(data) {
        if (data.length > 0 && this.state.loading === false) {
            return data.map((item, index) => {
                return <TaskItem key={index}
                    link={`/main_employee/archive/${item.id}`}
                    delete_archive={() => this.setState({ deleteVisible: true, deleteId: item.id })}
                    name={item.name}
                    organizationName={item.company_name}
                    performerName={item.accountant_first_name}
                    performerLastName={item.accountant_last_name}
                    endDate={item.end_task_date ? moment(item.end_task_date).format('LLL') : ""}
                    endDateManager={item.end_date ? moment(item.end_date).format('LLL') : ""}
                />
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
            return <div></div>
        }
    }

    render() {
        const { word, limit_data } = this.props
        const animatedComponents = makeAnimated();
        return (
            <div className='archive'>
                {this.state.show2 || this.state.show1 ? <div className='transparent' onClick={() => this.setState({ show1: false, show2: false })}></div> : null}
                {this.state.deleteVisible ? <div className="popup" onClick={() => this.setState({ deleteVisible: false })}>
                </div> : null}
                {this.state.deleteVisible ? <div className="delete-note">
                    <div className="delete-text">Ջնջե՞լ</div>
                    <div className="note-buttons">
                        <Button
                            buttonStyle="blue-button"
                            onChangeValue={() => this._deleteArchive()}
                            title={word.yes}
                        />
                        <Button
                            buttonStyle="blue-button"
                            onChangeValue={() => this.setState({ deleteVisible: false })}
                            title={word.no}
                        />
                    </div>
                </div> : null}
                <div className={localStorage.getItem("profession") === "manager" ? 'tasks-data tasks-data-manager' : 'tasks-data'}>
                    <span className='tasks-data-item'> <DatePicker
                        dateFormat="dd/MM/yyyy"
                        selected={this.state.start_date}
                        onChange={this.handleChangestartDate}
                    /></span>
                    <div className='middle-line'></div>
                    <span className='tasks-data-item'> <DatePicker
                        dateFormat="dd/MM/yyyy"
                        selected={this.state.end_date}
                        onChange={this.handleChangefinishDate}
                    /></span>
                    <div className='middle-line'></div>
                    <div className='tasks-data-hidden'>
                        <Select
                            defaultValue={this.props.limit_data.orgs ? this.getSeletedList(this.props.limit_data.orgs, "company") : []}
                            isLoading={limit_data.loader_orgs}
                            value={this.state.selectedOrg}
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
                    {localStorage.getItem("profession") === "manager" ? <div className='middle-line'></div> : null}
                    {localStorage.getItem("profession") === "manager" ? <div className='tasks-data-hidden'>
                        <Select
                             isLoading={limit_data.loader_stuff}
                            defaultValue={this.props.limit_data.stuff ? this.getSeletedList(this.props.limit_data.stuff, "stuff") : []}
                            value={this.state.selectedEmp}
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
                </div>
                <SearchBar value={this.state.fliter.name} onChange={(value) => this.setFilter({ name: value })} />
                <div className='data-user'>
                    <span>{word.task_name}</span>
                    <span>{word.name_organization}</span>
                    <span>{word.performer_name}</span>
                    <span>{word.tasks_date}</span>
                    <span>{word.deadline}</span>
                </div>
                {this.loading(this.state.taskByStatus)}
                {this.state.taskByStatus.length > 0 ? <Pagination
                    activePage={this.state.activePage}
                    itemsCountPerPage={10}
                    totalItemsCount={this.state.count}
                    pageangeDisplayed={5}
                    onChange={(data) => this.handlePageChange(data)}
                /> : null}
            </div>
        );
    }
}
export default connect(
    (state) => ({ word: state.word, show: state.showReducer, archive: state.archive, org: state.organization.results, stuffs: state.stuff.results, limit_data: state.limit_data }),
    (dispatch) => ({
        getArchive: (data) => dispatch(archiveAction(data)),
        getOrg: (data) => dispatch(orgAction(data)),
        getStuff: (data) => dispatch(stuffAction(data)),
    })
)(Archive);