import React, { Component } from 'react';
import { connect } from 'react-redux';
import SearchBar from "../../components/SearchBar";
import DatePicker from "react-datepicker";
import FileItem from "../../components/FileItem";
import { TextField } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import NewCompanyFile from "./NewCompanyFile";
import Pagination from "react-js-pagination";
// import moment from 'moment';
import { get_company_file, loader_company_file } from "../../action/index";
import { getCompanyFile, deleteFileCompany } from "../../api";
import * as queryString from "../../utils/query-string";
import Loader from 'react-loader-spinner';
import Button from "../../components/Button/Button";
import "react-datepicker/dist/react-datepicker.css";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import '../../assets/css/manager.css';
const profession = localStorage.getItem("profession");
class Files extends Component {
    constructor(props) {
        super(props);
        this.state = {
           
        }
    }
    componentDidMount() {
        this.setFilter()
    }
    getCompanyFile() {
        // this.setState({ loading: true })
        getCompanyFile(location.search)
            .then((res) => {
                this.props.get_company_file(res)
            })

    }
    setFilter(newFilter) {
        const params = queryString.parse(location.search)
        const tmp = {
            ...this.state.filter,
            ...params,
            ...newFilter,
        }
        // this.setState({
        //     fliter: tmp
        // })
        this.props.loader_company_file(tmp)
        const stringified = queryString.stringify({ ...params, ...tmp, });
        if (history.pushState) {
            var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?' + stringified;
            window.history.pushState({ path: newurl }, '', newurl);
        }
        this.getCompanyFile()
    }
    handleChangeDate = date => {
        let created_at = date?`${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`:null;
        this.setFilter({ created_at })
    };
    handlePageChange(pageNumber) {
        this.setFilter({ offset: pageNumber === 1 ? "" : (pageNumber - 1) * 10 })
    }
    _deleteFile() {
        let url = this.state.deleteUrl
        deleteFileCompany(url)
            .then(() => {
                this.setFilter()
                this.setState({ deleteVisible: false })
            })
    }
    render() {
        const { word, companyFile, organization } = this.props;
        const params = queryString.parse(location.search)
        return (
            <div className="compnay-files">
                {this.state.deleteVisible ? <div className="popup" onClick={() => this.setState({ deleteVisible: false })}>
                </div> : null}
                {this.state.deleteVisible ? <div className="delete-note">
                    <div className="delete-text">Ջնջե՞լ</div>
                    <div className="note-buttons">
                        <Button
                            buttonStyle="blue-button"
                            onChangeValue={() => this._deleteFile()}
                            title={word.yes}
                        />
                        <Button
                            buttonStyle="blue-button"
                            onChangeValue={() => this.setState({ deleteVisible: false })}
                            title={word.no}
                        />
                    </div>
                </div> : null}
                {this.state.show ? <div className='popup' onClick={() => this.setState({ show: false })}></div> : null}
                {this.state.show ? <NewCompanyFile close={() => {
                    this.getCompanyFile()
                    this.setState({ show: false })
                }} /> : null}
                <div className="plus-cont" onClick={() => {
                    this.setState({ show: true })
                }}><span className='plus'>+</span>
                    <span className="tooltiptext">{word.add_file}</span>
                </div>
                <div className="files-filters">
                    <div className="search-date">
                        <SearchBar value={companyFile.filter.name} onChange={(value) => this.setFilter({ name: value })} />
                        <DatePicker
                            dateFormat="dd/MM/yyyy"
                            selected={companyFile.filter.created_at?new Date(companyFile.filter.created_at):null}
                            popperPlacement="bottom-end"
                            onChange={this.handleChangeDate}
                        />
                    </div>
                    {profession === "manager" ? <Autocomplete
                        loading={organization.length > 0 ? false : true}
                        loadingText={<div className="auto-complete-loader"><Loader
                            type="Oval"
                            color="#101C2A"
                            height={20}
                            width={20}
                        /></div>}
                        id="combo-box-demo"
                        options={organization}
                        onChange={(e, value) => {
                            this.setFilter({ company: value ? value.id : "" })
                        }}
                        getOptionLabel={option => {
                            return option.name
                        }}
                        renderInput={params => (
                            <TextField {...params} error={!this.state.company && this.state.submit === true}
                                id={!this.state.company && this.state.submit === true ? "validation-outlined-input" : "outlined-helperText"}
                                label="Կազմակերպություններ"
                                fullWidth
                                onKeyDown={(e) => { this.keyPress(e) }} />
                        )}
                    /> : null}
                </div>
                <div className="files-cont">
                    {!companyFile.loader_file ? companyFile.results.map((item, index) => {
                        return <div key={index}><FileItem
                            delete={() => {
                                this.setState({ deleteVisible: true, deleteUrl: item.url })
                            }}
                            company={item.company_files.name}
                            file_url={item.file}
                            name={item.name}
                            date={item.created_at}
                            url={item.company_files.accountant[0]}
                        /></div>
                    }) : <div className="loaderMargin"><Loader
                        type="Oval"
                        color="#101C2A"
                        height={30}
                        width={30}
                    /></div>}
                    {companyFile.count && companyFile.count > 10 && companyFile.loader_file === false ? <Pagination
                        activePage={params.offset ? params.offset / 10 + 1 : 1}
                        itemsCountPerPage={10}
                        totalItemsCount={companyFile.count}
                        pageRangeDisplayed={5}
                        onChange={(data) => this.handlePageChange(data)}
                    />
                        : null}
                </div>
            </div>
        );
    }
}
export default connect(
    (state) => ({
        word: state.word,
        companyFile: state.companyFile,
        organization: state.organization.results ? state.organization.results.filter(item => item.is_deleted_by_manager === false) : [],
    }),
    (dispatch) => ({
        get_company_file: (data) => dispatch(get_company_file(data)),
        loader_company_file: (data) => dispatch(loader_company_file(data))
    }),
)(Files);