import React, { Component } from 'react';
import { Row, Col } from 'react-bootstrap';
import BlueButton from "../../../components/BlueButton/BlueButton";
import LittleButton from "../../../components/BlueButton/LittleButton";
import Button from 'react-bootstrap/Button';
import Collapse from 'react-bootstrap/Collapse'
import AddEployeeList from "./AddEployeeList";
import Path from "../../../assets/img/Path 286.svg";
import MyImgRound from "../../../components/MyImgRound";
import Plus from "../../../components/Plus";
import { connect } from 'react-redux';
import { addStuff, editStatus, taskSms, getMyTasks, getTaskById, timer, changeTimerById, EditTask, getTaskSms, todaysTaskSum } from "../../../api";
import NewRecommendation from "../NewRecommendations/NewRecommendations";
import DateTimePicker from 'react-datetime-picker';
import "react-datepicker/dist/react-datepicker.css";
import moment from 'moment';
import 'moment/locale/hy-am';
import { tasksAction, employeeAction, task_data, delete_task_data, change_status, new_task_sms, set_day_reports } from "../../../action/index";
import Loader from 'react-loader-spinner';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import MessageList from "../../../components/Message/MessageList";
import ChangeRecommendation from "../NewRecommendations/ChangeRecommendation";
import RecommendationsItem from "../../../components/RecommendationsItem";
import TaskFiles from "./TaskFiles";
import TaskAddFiles from "./TaskAddFiles";
import CustomizedRatings from "../../../components/ResetRating";
import CheckboxFilter from "../../../components/CheckboxFilter";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { SERVER } from "../../../config";
import send from "../../../assets/img/send.png";
import image from "../../../assets/img/image.png"
import "../../../assets/css/managerrecommendation.css";
import { SignalCellularNull } from '@material-ui/icons';
const date_now = new Date();
const year = date_now.getFullYear();
const month = date_now.getMonth() + 1;
const day = date_now.getDate();
class ManagerRecommendations extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            show: false,
            showTaskModal: false,
            showPicker: false,
            accountant: {},
            file: "",
            filePreviewUrl: "",
            text: "",
            // data: {},
            visibleMessage: false,
            add_new_file: false,
            edit: false,
            copy: false,
            visibleFile: false,
            timer_loading: false,
            for_all: false,
            s: 0,
        }
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
    componentDidUpdate(prevProps) {
        if (prevProps.match.params.id !== this.props.match.params.id) {
            this.getTaskById()
            this.sum_parent_timer()
        }
        if (prevProps.task.id !== this.props.task.id) {
            this.timerFunction()
        }
    }
    handleChangeEndDate = (date) => {
        let new_date = new Date(date);
        console.log(new_date.getFullYear(), "new_date.getFullYear()");
        console.log(year + 2, "year + 2");
        if (new_date.getFullYear() < year + 2) {
            this.setState({ showPicker: true })
            let data = {
                ...this.props.task,
                end_date: date
            }
            this.props.task_data(data)
        } else {
            alert("Չի թույլատրվում")
            return
        }

    }
    componentDidMount() {
        this.getTaskById()
    }
    getTaskById() {
        let id = this.props.match.params.id
        let token = localStorage.getItem("token")
        getTaskById(token, id)
            .then((res) => {
                if (res.parent_task_details && res.parent_task_details.id && res.parent_task_details.id !== res.id) {
                    getTaskById(token, res.parent_task_details.id)
                        .then((parent) => {
                            this.props.task_data({ ...res, parent_child_tasks: parent.child_tasks })
                        })
                } else {
                    this.props.task_data({ ...res })
                }
                this._timerList(res.task_timer)
                this.sum_parent_timer()
            })
    }
    changeStatus(status) {
        switch (status) {
            case "new":
                return "approved"
            case "approved":
                return "process"
            case "process":
                return "end"
            case "end":
                return "process"
            default:
        }
    }
    timer_end(status) {
        let data = this.props.task;
        if (!status) {
            this.setState({ timer_loading: true })
        }
        let token = localStorage.getItem("token")
        let timer_data = {
            task: data.url,
        }
        let id = data.id
        let array = data.task_timer
        for (let index = 0; index < array.length; index++) {
            const element = array[index];
            if (element.end === null) {
                changeTimerById(token, timer_data, element.id)
                    .then(() =>
                        getTaskById(token, data.id)
                            .then((res) => {
                                this.get_day_reports();
                                this.props.task_data(res)
                                this.setState({ disabled: false, timer_loading: false })
                                // this.props.change_status()
                            }
                            )
                    )
            }
        }
        getTaskById(token, data.id)
            .then((res) => {
                this.props.task_data(res);
                this.setState({ disabled: false })
            })
    }
    _start_timer() {
        this.setState({ timer_loading: true })
        let data = this.props.task
        let token = localStorage.getItem("token")
        let id = data.id
        let timer_data = {
            task: data.url,
        }
        timer(token, timer_data)
            .then(() =>
                getTaskById(token, id)
                    .then((res) => {
                        this.get_day_reports();
                        this.props.task_data(res)
                        this.setState({ disabled: false, timer_loading: false })
                    }
                    )
            )
    }
    get_day_reports() {
        todaysTaskSum()
            .then((res) => {
                if (res.error) {
                } else {
                    this.props.day_reports({ ...res })
                    // this.setState({ ...this.state, ...res })
                }
            })
    }
    // new Date().toLocaleString("en-US", {timeZone: "Asia/Yerevan"
    changeStatusPut(url, data) {
        this.setState({ disabled: true })
        let token = localStorage.getItem("token")
        let id = data.id
        let start_date = new Date().toLocaleString("en-US", { timeZone: "Asia/Yerevan" })
        let end_date = new Date().toLocaleString("en-US", { timeZone: "Asia/Yerevan" })
        let timer_data = {
            task: data.url,
            start: this.changeStatus(data.status) === "process" ? moment(start_date).format("YYYY-MM-DD HH:mm:ss") : data.start_task_date,
            end: null
            // this.changeStatus(data.status) === "end" ? moment(end_date).format("YYYY-MM-DD HH:mm:ss") : data.end_task_date
        }
        this.props.change_status();
        let start_or_end = data.status === "process" ? "end-task" : "start-task"
        editStatus(token, id, start_or_end)
            .then(
                () => {
                    if (this.changeStatus(data.status) !== "end") {
                        timer(token, timer_data)
                            .then(() => {
                                getTaskById(token, id)
                                    .then((res) => {
                                        this.get_day_reports();
                                        this.props.task_data(res);
                                        this.setState({ disabled: false });
                                        this.props.change_status();
                                    }
                                    )
                            }
                            )
                    }
                    else {
                        this.timer_end({ status: "end" })
                        this.props.change_status()
                    }
                }
            )
    }
    addStuff(url, data) {
        this.setState({ change_task: true })
        let token = localStorage.getItem("token")
        let id = data.id
        let idUser = localStorage.getItem("id")
        let prof = localStorage.getItem("profession")
        // if (this.props.task.end_date <= new Date()) {
        //     return
        // }
        let end_date = this.props.task.end_date !== null ? moment(this.props.task.end_date).format('YYYY-MM-DD HH:mm:ss') : null
        let datapost = {
            name: data.name,
            id: data.id,
            client: data.client,
            text: data.text,
            title: data.title,
            accountant: url,
            status: data.status === "new" ? "approved" : data.status,
            end_date
        }
        addStuff(token, datapost, id)
            .then(() => getTaskById(token, id)
                .then((res) => {
                    this.props.task_data(res)
                    this.success_notify()
                    this.setState({ accountant: {}, showPicker: false, change_task: false })
                })
                .catch((e) => {
                    return this.error_notify()
                })
            )
            .then(() => {
                getMyTasks(idUser, token, prof)
                    .then((res) => {
                        this.props.getTasks(res)

                    })
            })
    }
    raiseInvoiceClicked(url) {
        localStorage.setItem("pageData", "Data Retrieved from axios request")
        window.open(url, "_blank")
    }
    setHeigthByStatus(status) {
        switch (status) {
            case "new":
                return "150px"
            case "process":
                return "395px"
            case "end":
                return "655px"
            default:
        }
    }
    save(item) {
        this.setState({
            accountant: item, data: {
                ...this.state.data,
                accountant: item.url
            }
        })
    }
    // create_task_files() {
    //     let task_file_list = [];
    //     for (let index = 0; index < this.props.task.task_file.length; index++) {
    //         const element = this.props.task.task_file[index];
    //         task_file_list.push(element)
    //     }
    //     for (let index = 0; index < this.props.task.sms_task.length; index++) {
    //         const element = this.props.task.sms_task[index];
    //         if (element.file !== null) {
    //             task_file_list.push({
    //                 file: element.file,
    //                 file_name: element.file_name,
    //                 created_date: element.created_date,
    //                 url: element.url
    //             })
    //         }
    //     }
    //     this.setState({ task_file_list, url: "" })
    // }
    taskSms() {
        let data = this.props.task
        let text = this.state.text;
        let file = this.state.file;
        let manager = this.props.manager.url;
        let task = data.url;
        let token = localStorage.getItem("token")
        let formData = new FormData();
        formData.append("text", text)
        formData.append("file", file)
        formData.append(`${localStorage.getItem("profession")}`, manager)
        formData.append("task", task)
        formData.append("for_all", this.state.for_all)
        if (this.state.text !== "" || this.state.file !== "") {
            this.setState({ send_message: true })
            taskSms(data.id, token, formData)
                .then((res) => {
                    this.setState({ text: "", file: "", send_message: false })
                    getTaskSms(data.id, {
                        "start_index": 0,
                        "for_all": null
                    })
                        .then((res) => {
                            this.props.new_task_sms(res)
                            // this.create_task_files()
                        })
                })
                .catch((error) => {
                    console.log(error);
                })
        }
    }
    sum_parent_timer() {
        let sum = 0;
        let time = 0
        let array = this.props.task.child_tasks ? this.props.task.child_tasks : [];

        for (let index = 0; index < array.length; index++) {
            const element = array[index];
            let element_timer_sum = this._timer_sum(element.task_timer)
            sum += element_timer_sum
        }
        var d = moment.duration(sum);
        time = Math.floor(d.asHours()) + moment.utc(sum).format(":mm:ss");
        this.setState({ time })
    }

    _timer_sum(array) {
        let sum = 0;
        let ms = 0;
        // var newDate = new Date();
        var then = new Date();
        // newDate.getTime();
        for (let index = 0; index < array.length; index++) {
            const element = array[index];
            if (element.end == null) {
                // let start = new Date(element.start).getTime()
                // ms = then - start
                let st = element.start
                let st_toStr = st.toLocaleString("en-US", { timeZone: "Asia/Yerevan" });
                ms = moment(then).diff(moment(st_toStr));
            }
            if (element.end !== null) {
                // let end = new Date(element.end).getTime();
                // let start = new Date(element.start).getTime()
                // ms = end - start
                let end = element.end;
                let end_toLocaleStr = end.toLocaleString("en-US", { timeZone: "Asia/Yerevan" });
                let st = element.start;
                let start_end_toLocaleStr = st.toLocaleString("en-US", { timeZone: "Asia/Yerevan" });
                ms = moment(end_toLocaleStr).diff(moment(start_end_toLocaleStr));
            }
            sum += ms
        }
        return sum
    }
    _timerList(list) {
        // let seconds = sum/1000 
        // let minutes = sum/(1000 * 60);
        // let hours = sum/(1000 * 60 * 60);
        // let time=`${Math.floor(hours)}:${Math.floor(minutes)-Math.floor(hours)*60}:${Math.floor(seconds)-Math.floor(minutes)*60}`
        // this.setState({ hours:hours, minutes:minutes-hours*60,seconds:seconds-minutes*60, sum:sum, s:time})
        var d = moment.duration(this._timer_sum(list));
        var s = Math.floor(d.asHours()) + moment.utc(this._timer_sum(list)).format(":mm:ss");
        this.setState({ s })
        return s
    }
    keyPress(e) {
        if (e.key === "Enter") {
            this.taskSms()
        }
    }
    componentWillUnmount() {
        this.props.delete_task_data()
    }
    checked() {
        let array = this.props.task.task_file
        this.setState({ checked: !this.props.task.checked })
        let formData = new FormData();
        formData.append("checked", !this.props.task.checked)
        // for (let index = 0; index < array.length; index++) {
        //     const element = array[index];
        //     formData.append("file", element.url)
        //     formData.append("task", this.props.task.url)
        // }
        EditTask(localStorage.getItem("token"), formData, this.props.task.id)
            .then(() => {
                this.getTaskById()
            })
    }
    timerFunction() {
        let data = this.props.task;
        let task_timer = data.task_timer;
        let timer_value = null;
        if (task_timer && task_timer.length > 0 && task_timer[task_timer.length - 1].end == null && data.status !== "end") {
            timer_value = setInterval(() => {
                this._timerList(this.props.task.task_timer)
            }, 1000)
            return () => clearInterval(timer_value)
        }
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
    get_task_rate() {
        let array = this.props.task.ratings;
        for (let index = 0; index < array.length; index++) {
            const element = array[index];
            if (element.manager) {
                return element.score
            }
        }
    }
    get_task_rate_client() {
        let array = this.props.task.ratings;
        for (let index = 0; index < array.length; index++) {
            const element = array[index];
            if (element.client) {
                return element.score
            }
        }
    }
    render() {
        const { word } = this.props;
        let data = this.props.task;
        let { filePreviewUrl, file } = this.state;
        let $filePreview = null;
        let timer_title = data.task_timer && data.task_timer.length > 0 && data.task_timer[this.props.task.task_timer.length - 1].end == null ? word.stop : word.start
        // this.timerFunction()
        if (filePreviewUrl !== "") {
            try {
                $filePreview = (<div className='my-sms'>
                    <i className="far fa-times-circle" onClick={() => { this.setState({ file: "", filePreviewUrl: "" }) }}></i>
                    {file.type.includes('image/') ? <div className='my-sms-img' style={{ backgroundImage: "url(" + filePreviewUrl + ")" }}></div> : null}
                    <span className='my-sms-img-name'>{file.name}</span>
                </div>);
            } catch (error) {
                console.log('-----');
            }
        }
        if (data.url) {
            return (
                <div className='recommendation-page'>
                    {this.state.add_new_file ? <div className="transparent-loader">
                        <Loader
                            type="Oval"
                            color="#07608d"
                            height={15}
                            width={15}
                        />
                    </div> : null}
                    {this.state.edit || this.state.copy || this.state.visibleFile || this.state.visibleAddFile || this.state.showTaskModal ?
                        <div className="popup"
                            onClick={() => this.setState({
                                edit: false, copy: false, visibleFile: false,
                                visibleAddFile: false, showTaskModal: false
                            })}></div>
                        : null}
                    {this.state.show && data.status !== "end" ? <div className='popup'
                        onClick={() => this.setState({ show: false })}></div> : null}
                    {this.state.showPicker && data.status !== "end" ? <div className='transparent'
                        onClick={() => this.setState({ showPicker: false })}></div> : null}
                    {this.state.showTaskModal ? <NewRecommendation subTask="subTask" close={() => {
                        this.setState({ showTaskModal: false })
                        this.getTaskById()
                    }
                    } /> : null}
                    <Row >
                        <Col xs={12} sm={8}>
                            <a onClick={() => this.props.history.goBack()} className="link-Backward-arrow">
                                <span className="icon-Backward-arrow" ></span>
                            </a>
                            {localStorage.getItem("profession") === "manager" ?
                                <div className="employee-name-button">
                                    <div className='employee-name' onClick={() => this.setState({ show: true })}>
                                        {!this.state.accountant.image && !data.accountant_image ?
                                            <Plus /> :
                                            <MyImgRound image={this.state.accountant.user ? this.state.accountant.image : data.accountant_image} />}
                                        {!this.state.accountant.user && !data.accountant_first_name ?
                                            <span>{word.add_new_employee}</span> :
                                            <span>{this.state.accountant.user ?
                                                this.state.accountant.user.first_name :
                                                data.accountant_first_name} <br />
                                                {this.state.accountant.user ? this.state.accountant.user.last_name : data.accountant_last_name}</span>}
                                    </div>
                                    <div className="timePicker-cont-change">
                                        <div className="timePicker-cont"
                                        //  onClick={() => this.setState({ showPicker: true })}
                                        >
                                            <p className="end-date">{word.end_date}</p>
                                            <DateTimePicker
                                                minDate={new Date()}
                                                maxDate={new Date(9999, 12, 31)}
                                                onChange={data.status !== "end" ? this.handleChangeEndDate : console.log()
                                                }
                                                value={data.end_date ? new Date(data.end_date) : null}
                                            />
                                        </div>
                                        <div className="icons-copy-edit">
                                            <div className="tool-tip-cont">
                                                <div className="tool-tip">Պատճենել</div>
                                                <i className="fas fa-copy"
                                                    onClick={() => { this.setState({ copy: true }) }}></i>
                                            </div>
                                            {this.props.manager.url && (data.creator === this.props.manager.user.url) ? <div className="tool-tip-cont">
                                                <div className="tool-tip">Խմբագրել</div>
                                                <span onClick={() => { this.setState({ edit: true }) }}
                                                    className='icon-Compose'></span>
                                            </div> : null}
                                        </div>
                                    </div>
                                </div> :
                                <div className="copy-accountant-tasks">
                                    {this.props.manager.url && (data.creator === this.props.manager.user.url) ? <div className="tool-tip-cont">
                                        <div className="tool-tip">Խմբագրել</div>
                                        <span onClick={() => { this.setState({ edit: true }) }} className='icon-Compose'></span>
                                    </div> : null}
                                    <div className="tool-tip-cont">
                                        <div className="tool-tip">Պատճենել</div>
                                        <i className="fas fa-copy" onClick={() => { this.setState({ copy: true }) }}></i>
                                    </div>
                                </div>}
                            {/* <span onClick={() => { this.setState({ edit: true }) }} className='icon-Compose'></span> */}
                            {(localStorage.getItem("profession") === "manager") ||
                                ((localStorage.getItem("profession") === "accountant" && data.status === "end") ||
                                    (localStorage.getItem("profession") === "accountant" && data.accountant !== `${SERVER}accountant/${localStorage.getItem("id")}/`)) ?
                                null : <BlueButton disabled={this.state.disabled} title={data.status === "approved" ? word.start : word.complet}
                                    onChangeValue={() => this.changeStatusPut(this.state.accountant.url, data)}
                                />}
                            <div className="plus-cont" onClick={() => {
                                this.setState({ showTaskModal: true })
                            }}><span className='plus'>+</span>
                                <span className="tooltiptext">Կցել ենթաառաջադրանք</span>
                            </div>
                            {this.state.show && data.status !== "end" ?
                                <AddEployeeList accountant_url={data.accountant}
                                    save={(item) => this.save(item)}
                                    show={() => this.setState({ show: false })} />
                                : null}
                            {(((this.state.accountant.user || this.state.showPicker) && data.status !== "end") || data.status === "new") ?
                                <BlueButton title={this.state.change_task ? <Loader
                                    type="Oval"
                                    color="#fff"
                                    height={15}
                                    width={15}
                                /> : word.confirmed} disabled={this.state.change_task} onChangeValue={() => this.addStuff(this.state.accountant.url, data)} /> : null}
                            {localStorage.getItem("profession") === "manager" && data.status === "end" ?
                                <BlueButton title={word.change_status}
                                    onChangeValue={() => this.changeStatusPut(this.state.accountant.url, data)}
                                /> : null}
                            {localStorage.getItem("profession") === "manager" && data.accountant === null && data.status !== "end" && data.manager
                                && data.manager_id === parseInt(localStorage.getItem("id")) ?
                                <BlueButton disabled={this.state.disabled} title={data.status === "approved" ? word.start : word.complet}
                                    onChangeValue={() => this.changeStatusPut(this.state.accountant.url, data)}
                                /> : null}
                            {this.state.visibleFile ? <TaskFiles
                                getTaskById={() => this.getTaskById()}
                                show_loading={() => this.setState({ add_new_file: true })}
                                close={() => this.setState({ visibleFile: !this.state.visibleFile, add_new_file: false })}
                                show_add_files={() => this.setState({ visibleAddFile: true, visibleFile: false })} /> : null}
                            {/* {this.state.visibleAddFile ? <TaskAddFiles show_loading={() => this.setState({ add_new_file: true })}
                                close={() => this.setState({ visibleAddFile: !this.state.visibleAddFile, visibleFile: true, add_new_file: false })} /> : null} */}
                            {this.state.edit ? <ChangeRecommendation
                                close={() => {
                                    this.setState({ edit: false })
                                    this.getTaskById("approved")
                                }} /> : null}
                            {this.state.copy ? <ChangeRecommendation
                                copy={this.state.copy}
                                close={() => {
                                    this.setState({ copy: false })
                                    // this.getAccountantTasks("approved")
                                }} /> : null}
                            {/* _start_timer */}
                            {data.status === "process" && (localStorage.getItem("profession") === "accountant" ||
                                (localStorage.getItem("profession") === "manager" && !data.accountant && data.manager && data.manager_id == parseInt(localStorage.getItem("id")))) ? <div>
                                <LittleButton title={this.state.timer_loading ? <Loader
                                    type="Oval"
                                    color="#fff"
                                    height={15}
                                    width={15}
                                /> : timer_title}
                                    onChangeValue={() => data.task_timer && data.task_timer.length > 0 &&
                                        data.task_timer[this.props.task.task_timer.length - 1].end == null ? this.timer_end() : this._start_timer()} />
                                {/* <LittleButton title={word.start} onChangeValue={() => this._start_timer()} /> */}
                            </div> : null}

                            <div className="timer">
                                <span>Ժամանակ {this.state.s}</span>
                                <span>{data.child_tasks.length > 0 ? `Ենթաառաջադրանքների ժամանակը ${this.state.time}` : null}</span>
                                {/* {this._timerList()} */}
                            </div>
                            <a href={`/main_employee/organization/${data.company_id}`} className='company-name'
                            >{data.company_name}</a>
                            <div className="task-heading-file">
                                <h1>{data.name}</h1>
                            </div>
                            <p>{data.text}</p>
                            {localStorage.getItem("profession") === "manager" ? null
                                : <div>
                                    {data.end_date ? <p className="end-date">{word.end_date}՝</p> : null}
                                    <p className="end-date">{data.end_date ? moment(data.end_date).format('LLL') : ""}</p></div>}
                            {localStorage.getItem("profession") === "manager" && (data.status === "process" || data.status === "end")
                                ? <CheckboxFilter title="Ստուգված է" my_task={this.state.checked ? this.state.checked : data.checked}
                                    onChange={() => {
                                        this.checked()
                                    }} /> : null}
                            <CheckboxFilter title="Տեսանելի է բոլորի համար" my_task={data.visible_for_client}
                            />
                            {data.status === "end" ? <div className="title-rate">
                                <div className="title">Մենեջեր</div>
                                <CustomizedRatings
                                    disabled={localStorage.getItem("profession") === "manager" ? false : true}
                                    status={data.status}
                                    defaultValue={this.get_task_rate() ? this.get_task_rate() : null}
                                    task={data.url}
                                    manager={this.props.manager.url}
                                    taskManager={data.manager}
                                    id={data.id}
                                    getTask={() => this.getTaskById()}
                                />
                            </div> : null}
                            {data.status === "end" ? <div className="title-rate">
                                <div className="title">Հաճախորդ</div>
                                <CustomizedRatings
                                    disabled={true}
                                    status={data.status}
                                    defaultValue={this.get_task_rate_client() ? this.get_task_rate_client() : null}
                                    task={data.url}
                                    manager={this.props.manager.url}
                                    taskManager={data.manager}
                                    id={data.id}
                                    getTask={() => this.getTaskById()}
                                />
                            </div> : null}
                            {data.status !== "new" ? <div className="task-timer">
                                <Button
                                    onClick={() => this.setState({ open: !this.state.open })}
                                    aria-controls="example-collapse-text"
                                    aria-expanded={this.state.open}
                                >
                                    Ժամանակաչափի աշխատանքը
                                </Button>
                                <Collapse in={this.state.open}>
                                    <div id="example-collapse-text">
                                        <table>
                                            <tbody>
                                                <tr>
                                                    <th>Վերսկսել</th>
                                                    <th>Դադար</th>
                                                </tr>
                                                {data.task_timer.map((item, index) => {
                                                    return <tr className='task-timer-item' key={index}>
                                                        <td className='timer-start-end'>{item.start ? <div>
                                                            <span className="task-timer-item-date">{moment(item.start).tz('Asia/Yerevan').format('L')}</span><span>{moment(item.start).tz('Asia/Yerevan').format('LTS')}</span></div> : ""}</td>
                                                        <td className='timer-start-end'>{item.end ? <div>
                                                            <span className="task-timer-item-date">{moment(item.start).tz('Asia/Yerevan').format('L')}</span><span>{moment(item.end).tz('Asia/Yerevan').format('LTS')}</span></div> : ""}</td>
                                                    </tr>
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                </Collapse>
                            </div> : null}
                            <div className="">Ստեղծող- <span className="creator-name">{data.creator_name}</span></div>
                            <div className="task-date-cont">
                                <span className='moment'>Ստղ. {data.created_date ? moment(data.created_date).tz('Asia/Yerevan').format('LLL') : null}</span>
                                {data.status !== "new" ? <span className='moment'>Սկզ. {data.start_task_date ? moment(data.start_task_date).tz('Asia/Yerevan').format('LLL') : null}</span> : null}
                                {data.status === "end" ? <span className='moment'>Ավտ. {data.end_task_date ? moment(data.end_task_date).tz('Asia/Yerevan').format('LLL') : null}</span> : null}
                            </div>
                            <div className='line-blue'></div>
                            <span className="message-heading">{word.message}</span>
                            <div className="icon-button-cont">
                                <div className="tool-tip-cont">
                                    <div className="tool-tip">Հաղորդագրություններ</div>
                                    <div className="icon-button"
                                        onClick={() => this.setState({ visibleMessage: !this.state.visibleMessage })}>
                                        <div className="add-file">
                                            <i className="fas fa-envelope"/>
                                            {!this.state.visibleMessage && (data.new_sms_count !== 0) ? <div className="tasks-around">{data.new_sms_count}</div> : null}
                                        </div>
                                    </div>
                                </div>
                                <div className="tool-tip-cont">
                                    <div className="icon-button"
                                        onClick={() => {
                                            this.setState({ visibleFile: !this.state.visibleFile })
                                        }
                                        }>
                                        <div className="tool-tip">Ֆայլերի ցանկ</div>
                                        <div className="add-file">
                                            <i className="fas fa-file"></i>
                                            {data.new_file_count !== 0 ? <div className="tasks-around">{data.new_file_count}</div> : null}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="message-list-inputs">
                                {this.state.visibleMessage ? <MessageList /> : null}
                                {this.state.visibleMessage ? <div className="send-message"> <div className='input-image' >
                                    <div>{$filePreview}</div>
                                    <div className="send-file">
                                        <textarea className='area' type="text"
                                            readOnly={this.state.send_message}
                                            onKeyDown={(e) => { this.keyPress(e) }}
                                            name="text"
                                            autoFocus={true}
                                            placeholder={word.enter_message}
                                            value={this.state.text} onChange={(e) => {
                                                let value = e.target.value
                                                this.setState({ text: value })
                                            }}></textarea>
                                        <div className='message-icons'>
                                            <label className="checkbox-cont">
                                                <div className="title">բոլորի համար</div>
                                                <div className="cont">
                                                    <input
                                                        checked={this.state.for_all}
                                                        onChange={
                                                            () => this.setState({ for_all: !this.state.for_all })
                                                        } type="checkbox" />
                                                    <span className="checkmark"></span>
                                                </div>
                                            </label>
                                            <label>
                                                <i className="fas fa-image"></i>
                                                {/* <i className="fas fa-paperclip"></i> */}
                                                <input type="file" className='input-icon' onChange={(e) => {
                                                    let reader = new FileReader();
                                                    let file = e.target.files[0]
                                                    if (file.size === 0) {
                                                        alert("Ֆայլը դատարկ է")
                                                    }
                                                    reader.onloadend = () => {
                                                        this.setState({
                                                            file,
                                                            filePreviewUrl: reader.result
                                                        });
                                                    }
                                                    reader.readAsDataURL(file)
                                                }} />
                                            </label>
                                            <i onClick={() => {
                                                if (!this.state.send_message) {
                                                    this.taskSms()
                                                }
                                            }} className="fa fa-paper-plane" aria-hidden="true"></i>
                                        </div>

                                    </div>
                                </div>
                                </div> : null}
                            </div>
                            {data.parent_task_details ? <div>
                                <div className='line-blue'></div>
                                <span className="message-heading">Գլխավոր առաջադրանքներ</span>
                                <div className="child-tasks">
                                    <RecommendationsItem
                                        toLink={`/main_employee/tasks/${data.parent_task_details.id}`}
                                        item={data.parent_task_details}
                                        modalShow={() => this.setState({ deleteVisible: !this.state.deleteVisible, delete_id: data.parent_task_details.id })}
                                        getTaskData={() => this.setFilter()}
                                        {...this.props}
                                        color={this.styleByStatus(data.parent_task_details.status)}
                                    />
                                </div>
                            </div> : null}
                            {data.child_tasks.length > 0 ? <div>
                                <div className='line-blue'></div>
                                <span className="message-heading">Ենթաառաջադրանքներ</span>
                                <div className="child-tasks">
                                    {data.child_tasks ? data.child_tasks.map((item, index) => {
                                        return <RecommendationsItem key={index}
                                            child_tasks={true}
                                            toLink={`/main_employee/tasks/${item.id}`}
                                            item={item}
                                            modalShow={() => this.setState({ deleteVisible: !this.state.deleteVisible, delete_id: item.id })}
                                            getTaskData={() => this.setFilter()}
                                            {...this.props}
                                            color={this.styleByStatus(item.status)}
                                        />
                                    }) : null}
                                </div>
                            </div> : null}
                            {data.parent_child_tasks && data.parent_child_tasks.length > 1 ? <div>
                                <div className='line-blue'></div>
                                <span className="message-heading">Գլխավոր առաջադրանքի այլ ենթաառաջադրանքները</span>
                                <div className="child-tasks">
                                    {data.parent_child_tasks.map((item, index) => {
                                        if (item.id === data.id) return
                                        return <RecommendationsItem key={index}
                                            toLink={`/main_employee/tasks/${item.id}`}
                                            item={item}
                                            modalShow={() => this.setState({ deleteVisible: !this.state.deleteVisible, delete_id: item.id })}
                                            getTaskData={() => this.setFilter()}
                                            {...this.props}
                                            color={this.styleByStatus(item.status)}
                                        />
                                    })}
                                </div>
                            </div> : null}
                        </Col >
                        <Col xs={12} sm={4}>
                            <div className='recommendations-line'>
                                <div className='green-line'>
                                    <div className='inside-green' style={{ height: this.setHeigthByStatus(data.status) }}></div>
                                    <div className='task-rounds task-rounds1'>
                                        <div className='tasks-date'>
                                            <span>
                                                {word.new_created}
                                            </span>
                                            <img src={Path} alt="img" />
                                        </div>
                                        <div className='rounds'>
                                            <div className='point'></div>
                                            {data.status === "new" ? <div className='icon-point'><span className='icon-Yes'></span></div> : null}
                                        </div>
                                    </div>
                                    <div className='task-rounds task-rounds2'>
                                        <div className='tasks-date'>
                                            <span>
                                                {word.in_the_process}
                                            </span>
                                            <img src={Path} alt="img" />
                                        </div>
                                        <div className='rounds'>
                                            <div className='point'></div>
                                            {data.status === "process" ? <div className='icon-point'><span className='icon-Yes'></span></div> : null}
                                        </div>
                                    </div>
                                    <div className='task-rounds task-rounds3'>
                                        <div className='tasks-date'>
                                            <span>
                                                {word.completed}
                                            </span>
                                            <img src={Path} alt="img" />

                                        </div>
                                        <div className='rounds'>
                                            <div className='point'></div>
                                            {data.status === "end" ? <div className='icon-point'><span className='icon-Yes'></span></div> : null}
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </Col>
                    </Row>
                </div>
            );
        }
        else {
            return <div className="loader-cont"><Loader
                type="Oval"
                color="#101C2A"
                height={30}
                width={30}
            /></div>
        }
    }
}
export default connect(
    (state) => ({
        word: state.word, show: state.showReducer, tasks: state.tasks, manager: state.loginReducer,
        task: state.taskReducer, changeStatus: state.changeStatus
    }),
    (dispatch) => ({
        getTasks: (data) => dispatch(tasksAction(data)),
        getMyInfo: (data) => dispatch(employeeAction(data)),
        task_data: (data) => dispatch(task_data(data)),
        delete_task_data: () => dispatch(delete_task_data()),
        change_status: () => dispatch(change_status()),
        new_task_sms: (data) => dispatch(new_task_sms(data)),
        day_reports: (data) => dispatch(set_day_reports(data))
    })
)(ManagerRecommendations);