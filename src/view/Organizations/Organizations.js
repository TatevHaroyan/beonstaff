import React, { Component } from 'react';
import { connect } from 'react-redux';
import OrganizationItem from "../../components/OrganizationItem";
import AddEmployeeOrg from "./AddEmployeeOrg";
import { get_org_list, loadingOrg, activePageOrg, company_service } from "../../action";
import { getOrg, companyService, deleteFile } from "../../api";
import '../../assets/css/manager.css';
import Pagination from "react-js-pagination";
import Loader from 'react-loader-spinner';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import SearchBar from '../../components/SearchBar';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import CheckboxFilter from "../../components/CheckboxFilter";
import * as queryString from "../../utils/query-string";
const profession = localStorage.getItem("profession")
class Organizations extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false,
            // deleted_by_user: false,
            // count: [1],
            // activeIndex: 0,
            // count: 0,
            filter: {
                is_deleted: false
            }
        }
    }
    componentDidMount() {
        this.companyService()
        if (profession === "accountant") {
            if (localStorage.getItem("id")) {
                this.setFilter({ accountant: localStorage.getItem("id") })
            } else {
                this.setState({ repeat: true })
            }
        } else {
            this.setFilter()
        }

    }
    companyService() {
        companyService()
            .then((res) => {
                this.props.company_service(res.results)
            })
    }
    setFilter(newFilter) {
        const params = queryString.parse(location.search)
        const tmp = newFilter ? {
            ...params,
            ...newFilter,
        } : { ...params }
        this.setState({
            filter: {
                ...this.state.filter,
                ...tmp
            }
        })
        this.props.loadingOrg(tmp)
        if (!tmp.is_deleted) {
            delete tmp.is_deleted
        }
        const stringified = queryString.stringify({ ...tmp });
        if (history.pushState) {
            var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?' + stringified;
            window.history.pushState({ path: newurl }, '', newurl);
        }
        getOrg(tmp)
            .then((res) => {
                this.props.getOrg(res)
            })
    }
    handlePageChange(pageNumber) {
        this.props.activePageOrg(pageNumber)
        let page = pageNumber === 1 ? "" : (pageNumber - 1) * 10;
        this.setFilter({ offset: page })
    }
    _return_multiselect_list() {
        let array = this.props.service;
        let new_array = [];
        for (let index = 0; index < array.length; index++) {
            const element = array[index];
            new_array.push({ label: element.name, value: element.id })
        }
        new_array.push({ label: "Ընտրել բոլորը", value: "" });
        return new_array
    }
    loading() {
        return (!this.props.organization.results || this.props.organization.loader) ? < div className="loaderMargin"><Loader
            type="Oval"
            color="#101C2A"
            height={30}
            width={30}
        /></div> : this.props.organization.results.filter((item) => item.is_deleted_by_manager === false).map((item, index) => {
            return <div key={index} className="company-card"><OrganizationItem id={item.id} is_deleted={item.is_deleted}
                orgname={item.name} name={item.client.user.first_name}
                surname={item.client.user.last_name} HVHH={item.HVHH}
                phone={item.client.phone} logo={item.logo}
                accountant_list={item.accountant ? item.accountant : []}
            /></div>
        })
    }
    render() {
        const { word, organization, employee } = this.props;
        const animatedComponents = makeAnimated();
        return (
            <div className='organizations'>
                {this.state.show ? <div className='popup' onClick={() => this.setState({ show: false })}></div> : null}
                {this.state.show ? <AddEmployeeOrg create={word.add_new_org} /> : null}
                {profession === "accountant" ? <div className="page-heading">Ինձ կցված կազմակերպությունները</div> : null}
                <SearchBar value={this.state.value} onChange={(value) => {
                    this.setFilter({ name: value })
                }} />
                <Select
                    closeMenuOnSelect={true}
                    components={animatedComponents}
                    options={this._return_multiselect_list()}
                    onChange={(data) => {
                        if (data.value === "") {
                            this.setFilter()
                        } else {
                            this.setFilter({ service: data.value, offset: "" })
                        }
                    }}
                    placeholder="Ծառայություն"
                />
                <CheckboxFilter title="Օգտատիրոջ կողմից ջնջված կազմակերպությունները"
                    my_task={this.state.filter.is_deleted}
                    onChange={() => {
                        this.setFilter({ is_deleted: !this.state.filter.is_deleted, offset: "" })
                        // this.setState({ is_deleted: !this.state.filter.is_deleted })
                    }} />
                <div className='organizations-list'>
                    {this.state.repeat ? <span className="repeat-text" onClick={() => {
                        this.setFilter({ accountant: employee.id })
                        localStorage.setItem("id", employee.id)
                        localStorage.setItem("user_id", employee.user_id)
                        this.setState({ repeat: false })
                    }}>Խնդրոմ ենք նորից կրկնել</span>
                        : this.loading()}
                </div>
                {this.props.organization.count > 10 && !this.props.organization.loader ? <Pagination
                    activePage={organization.activePage}
                    itemsCountPerPage={10}
                    totalItemsCount={organization.count}
                    pageRangeDisplayed={5}
                    onChange={(data) => this.handlePageChange(data)}
                /> : null}
            </div>
        );
    }
}
export default connect(
    (state) => ({
        word: state.word, show: state.showReducer,
        organization: state.orglist, employee: state.loginReducer,
        service: state.companyService
    }),
    (dispatch) => ({
        getOrg: (data) => dispatch(get_org_list(data)),
        loadingOrg: () => dispatch(loadingOrg()),
        activePageOrg: (page) => dispatch(activePageOrg(page)),
        company_service: (data) => (dispatch(company_service(data)))
    })
)(Organizations);