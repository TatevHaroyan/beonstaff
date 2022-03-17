import React, { Component } from 'react';
import { connect } from "react-redux";
import moment from 'moment';
import 'moment/locale/hy-am';
import { deleteFile, getTaskById, newFile, seenFiles } from "../../../api";
import Loader from 'react-loader-spinner';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import { task_data } from "../../../action";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ThreeSixty } from '@material-ui/icons';
import add from "../../../assets/img/add.svg";
import LittleButton from "../../../components/BlueButton/LittleButton";
const token = localStorage.getItem("token");
class TaskFiles extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: 0,
            task_file_list: [],
        }
    }
    success_notify = () => toast.success(this.props.word.success_process, {
        position: toast.POSITION.TOP_CENTER
    });
    error_notify = () => toast.error(this.props.word.error_process, {
        position: toast.POSITION.TOP_CENTER
    });
    add_files() {
        let token = localStorage.getItem("token");
        let array = [...this.state.task_file_list]
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
    delete_file(name) {
        let list = [...this.state.task_file_list]
        let new_file_list = list.filter(el => el.name !== name)
        this.setState({ task_file_list: new_file_list })
    }
    raiseInvoiceClicked(url) {
        localStorage.setItem("pageData", "Data Retrieved from axios request")
        window.open(url, "_blank")
    }
    render() {
        const { task } = this.props
        return (
            <div className='module'>
                <div className="file-close"> <div className="tool-tip-cont">
                    <div className="tool-tip">Փակել</div>
                    <i className="fas fa-times" onClick={() => this.props.close()}></i>
                </div>
                </div>
                <label>
                    <img className="icon-new-file" src={add} />
                    {/* <span className='icon-Attachment'></span>
                    Ավելացնել ֆայլ */}
                    <input type="file" className='input-icon' onChange={(e) => {
                        let file = e.target.files[0]
                        let tmp = [...this.state.task_file_list, file]
                        this.setState({ task_file_list: tmp })
                        // newFile(token, formData)
                        //     .then((res) => {
                        //         getTaskById(token, this.props.task.id)
                        //             .then((res) => {
                        //                 this.props.task_data(res)
                        //                 this.create_task_files()
                        //                 this.success_notify()
                        //             }
                        //             )
                        //     })
                    }} />
                </label>
                {this.state.task_file_list.length > 0 ? this.state.task_file_list.map((item, index) => {
                    return <div className="modue-item" key={index}>
                        <div className="item-date">
                            <div className="file-item-name">{item.name}</div>
                            <div className="tool-tip-cont">
                                <div className="tool-tip">Ջնջել</div>
                                <i className="fas fa-trash-alt" onClick={() => this.delete_file(item.name)}></i></div>
                        </div>
                    </div>
                }) : ""}
                {this.state.task_file_list.length > 0 ? < div className="file-button">
                    <LittleButton title="Հաստատել" onChangeValue={() => this.add_files()} />
                </div> : null
                }
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