import React, { Component } from 'react';
import { connect } from "react-redux";
import { sendArchive } from "../api";
import { getUser } from "../action";
import { BrowserRouter as Link } from "react-router-dom";
import "../assets/css/button.css";
import {SERVER} from "../config";
class Options extends Component {
    sendArchive() {
        let token = localStorage.getItem("token");
        let id = this.props.id
        sendArchive(id, token)
            .then((res) => {
                this.props.close()
            })
    }
    render() {
        const { word } = this.props;
        return (
            <div className='options'>
                <Link to="/main_employee/archive"
                >
                    {(localStorage.getItem("profession") === "manager" && this.props.status === "end") ?
                        <p className='options-item' onClick={() => { this.sendArchive() }}>{word.add_archive}</p>
                        : null}
                </Link>
                {this.props.creator === `${SERVER}user/${localStorage.getItem("user_id")}/` ?
                    <p className='options-item' onClick={() => {
                        this.props.modalShow()
                    }}>Ջնջել</p> : null}
            </div>
        );
    }
}
export default connect(
    (state) => ({ word: state.word, show: state.showReducer }),
    (dispatch) => ({
        getUserInfo: (data) => dispatch(getUser(data)),
    })
)(Options);