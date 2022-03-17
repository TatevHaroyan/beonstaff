import React, { Component } from 'react';
import moment from 'moment';
import user from "../../assets/img/usermiddle.png"
import '../../assets/css/message.css';
export default class Message extends Component {
    getEmployee(data) {
        if (data.client) {
            return data.client
        }
        if (data.manager) {
            return data.manager
        }
        if (data.accountant) {
            return data.accountant
        }
    }
    raiseInvoiceClicked(url) {
        localStorage.setItem("pageData", "Data Retrieved from axios request")
        window.open(url, "_blank")
    }
    fileName(file){
        let nameList=file?file.split("/"):[]
        let name=nameList[nameList.length-1]
        return name
    }
    render() {        
        return (
            <div>
                <div className="conversation-info">
                </div>
                <div className={[
                    'conversation-list-item',
                    `${this.props.isMine ? 'my-message' : ''}`,
                ].join(' ')}>
                    <div className='created_date'>{moment(this.props.data.created_date).format('lll')}</div>
                    <h1 className="conversation-title">{this.getEmployee(this.props.data).user.first_name}</h1>
                    <div className='photo-name'>
                        <img className="conversation-photo" src={this.getEmployee(this.props.data).image?this.getEmployee(this.props.data).image:user} alt="img" />
                        <div className={[
                            'message',
                            `${this.props.isMine ? 'mine' : ""}`,
                        ].join(' ')}>
                            <div className="bubble-container">
                                {this.props.data.text ? <div className="bubble" >
                                    {this.props.data.text}
                                </div> : null}
                                {this.props.data.file && this.props.data.file.includes(".jpg" || ".png" || ".jpeg") ?
                                    <div className='sms-img'
                                        onClick={() => this.raiseInvoiceClicked(this.props.data.file)}
                                        style={{ backgroundImage: "url(" + this.props.data.file + ")" }}></div>
                                    : <div onClick={() => this.raiseInvoiceClicked(this.props.data.file)}>{this.props.data.file_name}</div>}

                            </div>
                        </div>
                    </div>
                </div>
                <div className={[
                    'message',
                    `${this.props.isMine ? 'mine' : ''}`,
                    // `${startsSequence ? 'start' : ''}`,
                    // `${endsSequence ? 'end' : ''}`
                ].join(' ')}>
                    {/* {
          showTimestamp &&
            <div className="timestamp">
              { friendlyTimestamp }
            </div>
        } */}

                    <div className="bubble-container">


                    </div>
                </div>
            </div>
        );
    }
}