import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col } from 'react-bootstrap';
import Button from "../../components/Button/Button";
import '../../assets/css/add.css';
import DateTimePicker from 'react-datetime-picker';
import "react-datepicker/dist/react-datepicker.css";
import { newNote, getNote } from "../../api/index";
import { stuffAction } from "../../action";
import moment from 'moment';
import 'moment/locale/hy-am';
import Loader from 'react-loader-spinner';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
// import { tr } from 'date-fns/esm/locale';
class NewNote extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: "",
            end_date: new Date(),
            empty_error: ""
        }
    }
    success_notify = () => toast.success(this.props.word.success_process, {
        position: toast.POSITION.TOP_CENTER
    });
    error_notify = () => toast.error(this.props.word.error_process, {
        position: toast.POSITION.TOP_CENTER
    });
    keyPress(e) {
        if (e.key === "Enter") {
            this.newNote()
        }
    }
    handleChangeDate = date => {
        this.setState({ end_date: date })
    }
    newNote() {
        let token = localStorage.getItem("token")
        let id = localStorage.getItem("id")
        let data = {
            "title": this.state.title,
            "end_date": moment(this.state.end_date).format('YYYY-MM-DD'),
            "accountant": this.props.employee.url
        }
        this.setState({
            disabled: true,
            submited: true
        })
        if (this.state.title.length > 0) {
            newNote(token, data)
                .then((res) => {
                    if (res.error) {
                        this.error_notify()
                        this.setState({
                            disabled: false
                        })
                    } else {
                        this.success_notify()
                        getNote(token, id)
                            .then((res) => {
                                this.props.close(res)
                            })
                    }
                })
        }
        else {
            this.setState({ disabled: false })
        }
    }

    render() {
        const { word } = this.props
        return (
            <div className='add'>
                <div className="tool-tip-cont">
                    <div className="tool-tip">Փակել</div>
                    <i className="fas fa-times" onClick={() => this.props.close()}></i>
                </div>
                <div className='green-top'>
                    <Col xs={12} sm={10}> {this.props.create}</Col>
                </div>
                <div className='container'>
                    <Row className="d-flex justify-content-around">
                        <Col xs={12} sm={10} className="align-items-sm-center">
                            <DateTimePicker
                                onChange={this.handleChangeDate}
                                value={this.state.end_date}
                            />
                            <div className={this.state.title.length === 0 && this.state.submited ? "input-validation input-validation-valid" : "input-validation"}>
                                <textarea className="note-input" type='text' onKeyDown={(e) => this.keyPress(e)}
                                    onChange={(e) => {
                                        const { name, value } = e.target;
                                        let empty_error = this.state.empty_error
                                        if (value.length === 0) {
                                            empty_error = "Կատարել նշումներ"
                                        }
                                        this.setState({ [name]: value, empty_error })
                                    }}
                                    placeholder='Կատարել նշումներ' name="title" value={this.state.title} />
                                {this.state.title.length === 0 ? <div className='validation'>{this.state.empty_error}</div> : null}
                            </div>
                            {this.state.disabled ? <div className="disable-loader"><Loader
                                type="Oval"
                                color="#101C2A"
                                height={30}
                                width={30}
                            /></div> : null}
                            <Button
                                disabled={this.state.disabled}
                                buttonStyle="blue-button"
                                onChangeValue={() => this.newNote()}
                                title={word.save}
                            />
                        </Col>
                    </Row>
                </div>
            </div >
        );
    }
}
export default connect(
    (state) => ({ word: state.word, show: state.showReducer, employee: state.loginReducer }),
    (dispatch) => ({ getStuff: (data) => dispatch(stuffAction(data)) })
)(NewNote);