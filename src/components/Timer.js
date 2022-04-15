import React, { Component } from 'react';
import { connect } from 'react-redux';
import { set_day_reports } from "../action";
import { todaysTaskSum } from "../api";
import moment from 'moment';
import { ThreeSixtySharp } from '@material-ui/icons';
// let timer_value;
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
    // componentDidUpdate(prevProps, prevState) {
    //     if (prevProps.dayReports.has_ongoing_task !== this.props.dayReports.has_ongoing_task && this.props.dayReports.has_ongoing_task) {
    //         timer_value = setInterval(() => {
    //             this._timerList()
    //         }, 1000)
    //     } else {
    //         clearInterval(timer_value)
    //     }
    // }
    get_day_reports() {
        todaysTaskSum()
            .then((res) => {
                if (res.error) {
                } else {
                    const { all_duration, ...rest } = res
                    this.props.day_reports({ ...rest, all_duration: `0${all_duration}`, get_date: new Date() })
                    // this.setState({ ...this.state, ...res })
                }
            })
    }
    convertHToS(timeInHour) {
        var timeParts = timeInHour.split(":");
        return Number(timeParts[0]) * 3600 + Number(timeParts[1]) * 60 + Number(timeParts[2]);
    }
    secondsToHms(d) {
        d = Number(d);
        var h = Math.floor(d / 3600);
        var m = Math.floor(d % 3600 / 60);
        var s = Math.floor(d % 3600 % 60);
        var hDisplay = h > 0 ? (h < 10 ? `0${h}` : h) : "00";
        var mDisplay = m > 0 ? (m < 10 ? `0${m}` : m) : "00";
        var sDisplay = s > 0 ? (s < 10 ? `0${s}` : s) : "00";
        return `${hDisplay}:${mDisplay}:${sDisplay}`;
    }
    _timerList() {
        let duretion = this.props.dayReports.all_duration;
        let count = this.props.dayReports.ongoing_task_count;
        let get_date = this.props.dayReports.get_date;
        let date = new Date();
        let ms = moment(date).diff(moment(get_date));
        let d = moment.duration(ms);
        let s = Math.floor(d.asHours()) + moment.utc(ms).format(":mm:ss");
        let sum_s = this.convertHToS(s) * count + this.convertHToS(duretion);
        this.setState({ all_duration: this.secondsToHms(sum_s) })
    }
    render() {
        return (
            <div className=''>
                {this.state.all_duration}
                {/* {this.props.dayReports.all_duration ? this.props.dayReports.all_duration : null} */}
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