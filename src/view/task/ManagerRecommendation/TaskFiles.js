import React, { Component } from 'react';
import { connect } from "react-redux";
import moment from 'moment';
import 'moment/locale/hy-am';
import { deleteFile, getTaskById, newFile, seenFiles, getTaskSmsesOnlyFile } from "../../../api";
import Loader from 'react-loader-spinner';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import { task_data } from "../../../action";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import add from "../../../assets/img/add.svg";
import LittleButton from "../../../components/BlueButton/LittleButton";
import { ThreeSixty } from '@material-ui/icons';
const token = localStorage.getItem("token");
class TaskFiles extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: 0,
            task_file_list: [],
            add_task_file_list: []
        }
    }
    add_files() {
        let token = localStorage.getItem("token");
        let array = [...this.state.add_task_file_list]
        let formData = new FormData();
        formData.append("task", this.props.task.url)
        this.props.show_loading()
        for (let index = 0; index < array.length; index++) {
            const element = array[index];
            formData.append("file", element)
            newFile(token, formData)
                .then((res) => {
                    if (index === array.length - 1) {
                        getTaskById(token, this.props.task.id)
                            .then((res) => {
                                this.props.task_data(res)
                                this.success_notify()
                                this.props.close()
                            }
                            )
                    }

                })
        }
    }
    delete_file_brfore_accept(name) {
        let list = [...this.state.task_file_list]
        let new_file_list = list.filter(el => el.name !== name)
        this.setState({ task_file_list: new_file_list })
    }
    raiseInvoiceClicked(url) {
        localStorage.setItem("pageData", "Data Retrieved from axios request")
        window.open(url, "_blank")
    }
    getTaskById() {
        let id = this.props.task.id
        let token = localStorage.getItem("token")
        getTaskById(token, id)
            .then((res) => {
                this.props.task_data(res)
            })
    }
    componentDidMount() {
        let id = this.props.task.id
        let token = localStorage.getItem("token")
        getTaskSmsesOnlyFile(token, id)
            .then((res) => {
                this.create_task_files(res)
            })

        seenFiles(token, this.props.task.id)
            .then(() => {
                this.getTaskById()
            })
    }
    create_task_files(task_sms) {
        let task_file_list = [];
        for (let index = 0; index < this.props.task.task_file.length; index++) {
            const element = this.props.task.task_file[index];
            task_file_list.push(element)
        }
        if (task_sms.length > 0) {
            for (let index = 0; index < task_sms.length; index++) {
                const element = task_sms[index];
                if (element.file !== null) {
                    task_file_list.push({
                        file: element.file,
                        file_name: element.file_name,
                        created_date: element.created_date,
                        url: element.url
                    })
                }
            }
        }
        this.setState({ task_file_list, url: "" })
    }
    delete_file(url) {
        let token = localStorage.getItem("token");
        this.setState({ url })
        deleteFile(url)
            .then((res) => {
                if (res.error) {
                    this.setState({ url: "" })
                    return this.error_notify()
                } else {
                    getTaskSmsesOnlyFile(token, this.props.task.id)
                        .then((res) => {
                            // this.props.task_data(res)
                            this.create_task_files(res)
                            this.success_notify()
                        }
                        )

                }
            })
    }

    raiseInvoiceClicked(url) {
        localStorage.setItem("pageData", "Data Retrieved from axios request")
        window.open(url, "_blank")
    }
    success_notify() {
        toast.success(this.props.word.success_process, {
            position: toast.POSITION.TOP_CENTER
        })
    };
    error_notify() {
        toast.error(this.props.word.error_process, {
            position: toast.POSITION.TOP_CENTER
        })
    };
    render() {
        const { task } = this.props
        return (
            <div className='module'>
                <div className="file-close"> <div className="tool-tip-cont">
                    <div className="tool-tip">Փակել</div>
                    <i className="fas fa-times" onClick={() => this.props.close()}></i>
                </div>
                </div>
                {/* <label onClick={() => { this.props.show_add_files() }}>
                    <span className='icon-Attachment'></span>
                    Ավելացնել ֆայլ 
                </label> */}
                <label>
                    <img className="icon-new-file" src={add} />
                    {/* <span className='icon-Attachment'></span>
                    Ավելացնել ֆայլ */}
                    <input type="file" multiple className='input-icon' onChange={(e) => {
                        let new_list = [];
                        for (let i = 0; i < e.target.files.length; i++) {
                            const element = e.target.files[i];
                            new_list.push(element);
                        }
                        let new_file_list = [...this.state.add_task_file_list, ...new_list];
                        this.setState({ add_task_file_list: new_file_list })
                    }} />
                </label>
                {this.state.add_task_file_list.length > 0 ? this.state.add_task_file_list.map((item, index) => {
                    return <div className="modue-item" key={index}>
                        <div className="item-date">
                            <div className="file-item-name">{item.name}</div>
                            <div className="tool-tip-cont">
                                <div className="tool-tip">Ջնջել</div>
                                <i className="fas fa-trash-alt" onClick={() => this.delete_file_brfore_accept(item.name)}></i></div>
                        </div>
                    </div>
                }) : ""}
                {this.state.add_task_file_list.length > 0 ? < div className="file-button">
                    <LittleButton title="Հաստատել" onChangeValue={() => this.add_files()} />
                </div> : null
                }
                <hr />
                {this.state.task_file_list.length > 0 ? this.state.task_file_list.map((item, index) => {
                    let file_name_list = item.file ? item.file.split("/") : []
                    return <div className="modue-item" key={index}>
                        <span className="model-item-date">{moment(item.created_date ? item.created_date : task.created_date).format('LLL')}</span>
                        <div className="item-date">
                            <div className="file-item-name" onClick={() => this.raiseInvoiceClicked(item.file)}>{item.file_name}</div>
                            {this.state.url !== item.url ? <div className="tool-tip-cont">
                                <div className="tool-tip">Ջնջել</div>
                                <i className="fas fa-trash-alt" onClick={() => {
                                    this.delete_file(item.url)
                                }}></i></div> : <Loader
                                type="Oval"
                                color="#101C2A"
                                height={10}
                                width={10}
                            />}
                        </div>
                    </div>
                }) : ""}

            </div>
        );
    }
}
export default connect(
    (state) => ({
        task: state.taskReducer, word: state.word,
    }),
    (dispatch) => ({
        task_data: (data) => dispatch(task_data(data))
    })
)(TaskFiles);