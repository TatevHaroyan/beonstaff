import React, { Component } from 'react';
import { connect } from 'react-redux';
import sendFile from "../../assets/img/sendFile.png";
import upload from "../../assets/img/upload.png";
import { companyFilePost } from "../../api";
import * as queryString from "../../utils/query-string";
import { toast } from 'react-toastify';
import { TextField } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Loader from 'react-loader-spinner';
import { SERVER } from "../../config";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import 'react-toastify/dist/ReactToastify.css';
import "react-datepicker/dist/react-datepicker.css";
import '../../assets/css/manager.css';
const profession = localStorage.getItem("profession");
class NewCompanyFile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
        }
    }
    success_notify = () => toast.success(this.props.word.success_process, {
        position: toast.POSITION.TOP_CENTER
    });
    error_notify = () => toast.error(this.props.word.error_process, {
        position: toast.POSITION.TOP_CENTER
    });
    submit() {
        this.setState({ submit: true, disabled: true })
        const params = queryString.parse(location.search)
        let formData = new FormData();
        let company = this.state.company && profession === "manager" ? this.state.company : `${SERVER}manager-company/${params.company}/`;
        if (this.state.name.length === 0 || this.state.file.length === 0) {
            this.setState({ disabled: false })
            return
        }
        formData.append("name", this.state.name);
        formData.append("company", company);
        formData.append("file", this.state.file)
        companyFilePost(formData)
            .then((res) => {
                if (res.error) {
                    this.error_notify()
                    this.setState({ disabled: false })
                } else {
                    this.success_notify()
                    this.props.close()
                }
            })
            .catch((error) => {
                console.log(error);
            })

    }
    keyPress(e) {
        if (e.key === "Enter") {
            this.submit()
        }
    }
    render() {
        const { word, organization } = this.props
        return (
            <div className="add add-new-file">
                <div className="close-line">
                    <div className="tool-tip-cont">
                        <div className="tool-tip">Փակել</div>
                        <i className="fas fa-times" onClick={() => this.props.close()}></i>
                    </div>
                </div>
                <div className="add-new-file-inside">
                    <div className={this.state.submit === true && !this.state.file ? "upload-file-item-error upload-file-item" : "upload-file-item"}>
                        <label>
                            <input className="fileInput"
                                type="file"
                                onChange={(e) => {
                                    let value = e.target.files[0];
                                    let reader = new FileReader();
                                    reader.onloadend = () => {
                                        this.setState({
                                            file: value
                                        });
                                    }
                                    reader.readAsDataURL(value)
                                }} />
                            <img src={upload} alt="img"></img>
                            <span>{this.state.file ? this.state.file.name : word.upload_file}</span>
                        </label>
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
                            this.setState({ company: value.url })
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
                    <TextField error={this.state.name.length === 0 && this.state.submit === true}
                        id={this.state.name.length === 0 && this.state.submit === true ? "validation-outlined-input" : "outlined-helperText"}
                        onChange={(e) => this.setState({ name: e.target.value })}
                        label={word.name_file}
                        fullWidth
                        onKeyDown={(e) => { this.keyPress(e) }} />
                    {/* <input className="company-file-input" value={this.state.name}
                    onKeyDown={(e) => { this.keyPress(e) }}
                    onChange={(e) => this.setState({ name: e.target.value })} placeholder={word.name_file} /> */}
                    {this.state.disabled ? <div className="loader-margin-small"><Loader
                        type="Oval"
                        color="#101C2A"
                        height={20}
                        width={20}
                    /></div> : <img alt="img" src={sendFile} onClick={() => this.submit()} />}
                </div>
            </div>
        );
    }
}
export default connect(
    (state) => ({
        word: state.word,
        task: state.taskReducer,
        organization: state.organization.results ? state.organization.results.filter(item => item.is_deleted_by_manager === false) : [],
    }),
)(NewCompanyFile);