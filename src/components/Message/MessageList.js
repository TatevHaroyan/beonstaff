import React, { Component } from 'react';
import { seenSms, getTaskSms } from "../../api";
import Message from '../Message/Message';
import { task_data, task_sms, clean_tasksms, edit_task } from "../../action";
import { connect } from "react-redux";
class MessageList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      see_more_sms: true
    }
  }
  componentDidMount() {
    let token = localStorage.getItem("token")
    if (this.props.task.new_sms_count > 0) {
      seenSms(token, this.props.task.id)
        .then(() => {
          this.getTaskSms(0)
          this.props.edit_task({ new_sms_count: 0 })
        })
    } else {
      this.getTaskSms(0)
    }
  }
  componentWillUnmount() {
    this.props.clean_tasksms()
  }
  getTaskSms(start_index) {
    getTaskSms(this.props.task.id, {
      "start_index": start_index,
      "for_all": null
    })
      .then((res) => {
        this.props.task_sms(res)
        if (res.length === 0) {
          this.setState({ see_more_sms: false })
        }
      })
  }
  handleScroll(e) {
    if (parseInt(e.target.clientHeight - e.target.scrollTop) !== e.target.scrollHeight) return;
    if (this.props.tasksSms.length % 10 >= 0) {
      this.getTaskSms(this.props.tasksSms.length)
    }
  };
  render() {
    let isMine = false;
    return (
      <div className="message-list" onScroll={(e) => this.handleScroll(e)}>
        {this.props.tasksSms.map((item, index) => {
          isMine = ((localStorage.getItem("profession") === "manager" && item.manager)
            || (localStorage.getItem("profession") === "accountant" && item.accountant)) ? true : false
          return <Message key={index} data={item} isMine={isMine} />
        })}
        {this.props.tasksSms.length % 10 === 0 && this.state.see_more_sms ?
          <div className='see-more-sms'
            onClick={() => this.getTaskSms(this.props.tasksSms.length)}>Տեսնել ավելին</div>
          : null
        }
      </div>
    );
  }
}
export default connect(
  (state) => ({ word: state.word, show: state.showReducer, user: state.loginReducer, task: state.taskReducer, tasksSms: state.tasksSms }),
  (dispatch) => ({
    task_data: (data) => dispatch(task_data(data)),
    task_sms: (data) => dispatch(task_sms(data)),
    clean_tasksms: () => dispatch(clean_tasksms()),
    edit_task: (data) => dispatch(edit_task(data))
  })
)(MessageList);