import React, { Component } from 'react';
import RecommendationsItem from "../../components/RecommendationsItem";
import { Col, Row } from "react-bootstrap";
import "react-datepicker/dist/react-datepicker.css";
import NewRepeatedtask from "./NewRepeatedtask/NewRepeatedtask";
import NewRepeatedTaskMuchOrgs from "./NewRepeatedtask/NewRepeatedTaskMuchOrgs.js";
import Loader from 'react-loader-spinner';
import { get_repeated_tasks, loader_filter } from "../../action";
import { getMyRepeatedTasks, deleteRepeatedTask } from "../../api";
import Button from "../../components/Button/Button";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Pagination from "react-js-pagination";
import * as queryString from "../../utils/query-string";
import { connect } from 'react-redux';
import "../../assets/css/tasks.css";
import 'moment/locale/hy-am';
class RepeatedTask extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    componentDidMount() {
        if (localStorage.getItem("profession") === "accountant") {
            this.setFilter({ accountant: localStorage.getItem("id") })
        } else {
            this.setFilter()
        }
    }
    setFilter(newFilter) {
        const params = queryString.parse(location.search)
        const tmp = {
            ...this.state.fliter,
            ...params,
            ...newFilter,
        }
        this.props.loader_filter(tmp)
        const stringified = queryString.stringify({ ...params, ...tmp });
        if (history.pushState) {
            var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?' + stringified;
            window.history.pushState({ path: newurl }, '', newurl);
        }
        getMyRepeatedTasks(tmp)
            .then((res) => {
                return this.props.get_repeated_tasks(res)
            })
            .catch(() => {
                this.props.loader_filter(tmp)
            })
    }
    loading() {
        let data = this.props.tasksData;
        if (data.loader_task === false) {
            return data.task.map((item, index) => {
                return <Col sm={6} key={index} ><RecommendationsItem
                    modalShow={() => this.setState({ deleteVisible: !this.state.deleteVisible, delete_id: item.id })}
                    {...this.props}
                    item={item}
                    toLink={`/main_employee/repeated_task/${item.id}`}
                    companyId={`/main_employee/organization/${item.company_id}`}
                    comapanyName={item.company_name}
                    color="rgb(112, 112, 112)"
                    team={item.name}
                    teamText={item.text}
                    imgList={item.task_file}
                    status={item.status}
                    accountant_image={item.accountant_image}
                    id={item.id}
                    date={item.created_date}
                />
                </Col>
            })
        }
        else if (data.loader_task === true) {
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
        const { word, tasksData } = this.props;
        return (
            <div className='tasks'>
                {this.state.show || this.state.showMulti || this.state.deleteVisible ? <div className='popup' onClick={() => { this.setState({ show: false, showMulti: false }) }}></div> : null}
                {this.state.deleteVisible ? <div className="delete-note">
                    <div className="delete-text">Ջնջե՞լ</div>
                    <div className="note-buttons">
                        <Button
                            buttonStyle="blue-button"
                            onChangeValue={() => deleteRepeatedTask(this.state.delete_id)
                                .then(() => {
                                    this.setState({ deleteVisible: false });
                                    this.setFilter();
                                })}
                            title={word.yes}
                        />
                        <Button
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
                {localStorage.getItem("profession") === "manager" ? <div className="plus-cont" onClick={() => {
                    this.setState({ showMulti: true })
                }}><span className='plus'>+</span>
                    <span className="tooltiptext">Ավելացնել առաջադրանքներ մի քանի կազմակերպությունների համար</span>
                </div> : null}
                {this.state.show || this.state.showMulti ? <div className='popup' onClick={() => { this.setState({ show: false, showMulti: false }) }}></div> : null}
                {this.state.show ? <NewRepeatedtask close={() => this.setState({ show: false })} getRepeatedtask={() => {
                    if (localStorage.getItem("profession") === "accountant") {
                        this.setFilter({ accountant: localStorage.getItem("id") })
                    } else {
                        this.setFilter()
                    }
                }} /> : null}
                {this.state.showMulti ? <NewRepeatedTaskMuchOrgs close={() => {
                    this.setState({ showMulti: false })
                }} getRepeatedtask={() => this.setFilter()} /> : null}
                <div className='tasks-cont'>
                    <Row className=" flex-row">
                        {this.loading()}
                    </Row>
                </div>
                {tasksData.count && tasksData.loader_task === false ? <Pagination
                    activePage={tasksData.filter.offset ? (tasksData.filter.offset / 10) + 1 : 1}
                    itemsCountPerPage={10}
                    totalItemsCount={tasksData.count}
                    pageRangeDisplayed={5}
                    onChange={(data) => { this.setFilter({ offset: (data - 1) * 10 }) }}
                /> : null}
            </div>
        );
    }
}
export default connect(
    (state) => ({
        word: state.word, show: state.showReducer, tasksData: state.repeatedTaskReducer
    }),
    (dispatch) => ({
        get_repeated_tasks: (data) => dispatch(get_repeated_tasks(data)),
        loader_filter: (data) => dispatch(loader_filter(data))
    })
)(RepeatedTask);