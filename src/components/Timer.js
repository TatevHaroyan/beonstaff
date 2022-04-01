import React, { Component } from 'react';
import { connect } from 'react-redux';
import { set_day_reports } from "../action";
import { todaysTaskSum } from "../api";

class Timer extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    componentDidMount() {
        this.get_day_reports();
        let timer_value = setInterval(() => {
            this._timerList()
        }, 1000)
        return () => clearInterval(timer_value)
    }
    get_day_reports() {
        todaysTaskSum()
            .then((res) => {
                if (res.error) {
                } else {
                    console.log(res, "resresresresresresresres");
                    this.props.day_reports({ ...res })
                    // this.setState({ ...this.state, ...res })
                }
            })
    }
    _timerList() {
        let duretion = this.props.dayReports.all_duration;
        let count = this.props.dayReports.ongoing_task_count;
        let duretion_list = duretion.split(":");
        let h = parseInt(duretion_list[0]);
        let m = parseInt(duretion_list[1]);
        let s = parseInt(duretion_list[2]);
        if (s < 59) {
            s += count;
        } else {
            s = 0;
            if (m < 59) {
                m += 1
            } else {
                m = 0;
                h += 1;
            }
        }
        h = (h.toString().length === 1) ? `0${h}` : h;
        m = (m.toString().length === 1) ? `0${m}` : m;
        s = (s.toString().length === 1) ? `0${s}` : s;
        this.props.day_reports({ all_duration: `${h}:${m}:${s}` })
    }
    render() {
        return (
            <div className=''>
                {this.props.dayReports.all_duration ? this.props.dayReports.all_duration : null}
            </div>
        );
    }
}
export default connect(
    (state) => ({ dayReports: state.dayReports }),
    (dispatch) => ({
        day_reports: (data) => dispatch(set_day_reports(data)),
    })
)(Timer);