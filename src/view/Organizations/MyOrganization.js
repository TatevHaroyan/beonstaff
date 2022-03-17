import React, { Component } from 'react';
import { connect } from 'react-redux';
import OrganizationItem from "../../components/OrganizationItem";
import AddEmployeeOrg from "./AddEmployeeOrg";
import { Link } from "react-router-dom";
import { orgAction, loadingOrg, activePageOrg } from "../../action";
import { getOrg, getOrgbyName, getOrgNextPage } from "../../api";
import '../../assets/css/manager.css';
import Pagination from "react-js-pagination";
import Loader from 'react-loader-spinner';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import SearchBar from '../../components/SearchBar';
class MyOrganization extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false,
            activeIndex: 0,
            org: [],
            count: 0
        }
    }
    componentDidMount() {
        this.getOrg()
    }
    componentWillUnmount() {
        let token = localStorage.getItem("token")
        getOrg(token, 1000)
            .then((res) => {
                this.props.getOrg(res)
            })
    }
    getOrg() {
        this.props.loadingOrg()
        getOrg({ accountant: this.props.employee.id })
            .then((res) => {
                this.props.getOrg(res)
            })
    }
    handlePageChange(pageNumber) {
        this.props.activePageOrg(pageNumber)
        let page = pageNumber === 1 ? "" : (pageNumber - 1);
        let token = localStorage.getItem("token")
        getOrgNextPage(token, page)
            .then((res) => {
                this.props.getOrg(res)
                this.setState({
                    count: res.count,
                })
            })
        // .then((res) => this.setState({
        //     org: res.results,
        //     count: res.count,
        //     loader: false,
        //     activePage: pageNumber
        // }))
    }
    render() {
        const { word, organization } = this.props
        return (
            (!organization.results || organization.loader) ? < div className="loaderMargin"><Loader
                type="Oval"
                color="#101C2A"
                height={30}
                width={30}
            /></div> : <div className='organizations'>
                    {this.state.show ? <div className='popup' onClick={() => this.setState({ show: false })}></div> : null}
                    {this.state.show ? <AddEmployeeOrg create={word.add_new_org} /> : null}
                    <SearchBar value={this.state.value} onChange={(value) => {
                        let token = localStorage.getItem("token")
                        getOrgbyName(token, value)
                            .then((res) => {
                                this.props.getOrg(res)
                            })
                    }} />
                    <div className='organizations-list'>
                        {organization.results.filter((item) => item.is_deleted_by_manager === false).map((item, index) => {
                            return <Link to={`/main_employee/organization/${item.id}`} key={index}>
                                <OrganizationItem id={item.id} is_deleted={item.is_deleted}
                                    orgname={item.name} name={item.client.user.first_name}
                                    surname={item.client.user.last_name} HVHH={item.HVHH}
                                    phone={item.client.phone} logo={item.logo}
                                    accountant_list={item.accountant ? item.accountant : []}
                                />
                            </Link>
                        })}
                    </div>
                    <Pagination
                        activePage={organization.activePage}
                        itemsCountPerPage={10}
                        totalItemsCount={organization.count}
                        pageRangeDisplayed={5}
                        onChange={(data) => this.handlePageChange(data)}
                    />
                </div>
        );
    }
}
export default connect(
    (state) => ({
        word: state.word, show: state.showReducer,
        organization: state.organization, employee: state.loginReducer
    }
    ),
    (dispatch) => ({
        getOrg: (data) => dispatch(orgAction(data)),
        loadingOrg: () => dispatch(loadingOrg()),
        activePageOrg: (page) => dispatch(activePageOrg(page)),
    })
)(MyOrganization);