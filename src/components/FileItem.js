import React, { Component } from 'react';
import download from "../assets/img/download.png";
import '../assets/css/manager.css';
import { connect } from "react-redux";
import 'moment-timezone'
import moment from 'moment';
import 'moment/locale/hy-am';
class FileItem extends Component {
    raiseInvoiceClicked(url) {
        localStorage.setItem("pageData", "Data Retrieved from axios request")
        window.open(url, "_blank")
    }
    find_employee() {
        let array = this.props.stuffs ? this.props.stuffs : [];
        let name = "";
        for (let index = 0; index < array.length; index++) {
            const element = array[index];
            if (element.url === this.props.url) {
                name = `${element.user.first_name} ${element.user.last_name}`
            }

        }
        return name
    }
    render() {
        return (
            <div className='file-item'>
                <span className='file-item-data-name'>{this.props.name} {this.props.last_name}</span>
                <img alt="img" src={download} onClick={() => this.raiseInvoiceClicked(this.props.file_url)}></img>
                <span className='file-item-data'>{moment(this.props.date).tz('Asia/Yerevan').format('LLL')}</span>
                <span className='file-item-data'>{this.props.company}</span>
                <span className='file-item-data'>{this.find_employee()}</span>
                <div className="tool-tip-cont">
                    <div className="tool-tip">Ջնջել</div>
                    <i className="fas fa-times" onClick={() => this.props.delete()}></i>
                </div>
            </div>
        );
    }
}
export default connect(
    (state) => ({
        word: state.word,
        stuffs: state.stuff.results,
    }),
)(FileItem);