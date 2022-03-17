import '../../assets/css/manager.css';
import React, { Component } from 'react';
import { connect } from "react-redux";
import 'date-fns';
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

// import DateTimePicker from 'react-datetime-picker';
class SubTask extends Component {
    constructor(props) {
        super(props);
        this.state = {
            active: false,
            staff_cont: false,
            selectedDate: new Date(),
            personName:""
        }
    }
    
    render() {
        const { word } = this.props
        return (
            <div className={!this.state.active ? 'sub-task' : 'sub-task sub-task-active'} onClick={() => {
                this.setState({ active: true })
            }}>
                {this.state.staff_cont ? <div className="transparent" onClick={() => this.setState({ staff_cont: false })}></div> : null}
                <input className="sub-task-input" placeholder={word.create} value={this.props.value}
                    autoFocus={this.state.active}
                    // onFocus={() => {
                    //     this.setState({ active: true })
                    // }}
                    onChange={(e) => this.props.onChange(e.target.value)
                    } />
                <div className="icon-button">
                    <div className={this.state.staff_cont ? "icon-round-active icon-round" : "icon-round"}>
                        {/* <i className="fas fa-user" onClick={() => this.setState({ staff_cont: !this.state.staff_cont })}></i>
                        {this.state.staff_cont ? <div className="staff-cont">
                            {this.props.staff.results.map((item, index) => {
                                return <div className={this.state.id === item.id ? "staff-cont-item staff-cont-item-active" : "staff-cont-item"} key={index} onClick={() => this.setState({ staff_cont: false, id: item.id })}>
                                    {item.user.first_name} {item.user.last_name}
                                </div>
                            })}
                        </div> : null}*/}
                    </div> 
                        <FormControl >
                            <InputLabel id="demo-mutiple-name-label">Name</InputLabel>
                            <Select
                                labelId="demo-mutiple-name-label"
                                id="demo-mutiple-name"
                                // multiple
                                value={this.state.personName}
                                //   onChange={handleChange}
                                input={<Input />}
                            //   MenuProps={MenuProps}
                            >
                                {this.props.staff.results.length?this.props.staff.results.map((item) => (
                                    <MenuItem
                                        key={item.id} value={item.url} 
                                    >
                                         {item.user.first_name} {item.user.last_name}
                                    </MenuItem>
                                )):null}
                            </Select>
                        </FormControl>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <Grid container justify="space-around">
                                <KeyboardDatePicker
                                    disableToolbar
                                    variant="inline"
                                    format="MM/dd/yyyy"
                                    margin="normal"
                                    id="date-picker-inline"
                                    label="Date picker inline"
                                    value={this.state.selectedDate}
                                    // onChange={handleDateChange}
                                    KeyboardButtonProps={{
                                        'aria-label': 'change date',
                                    }}
                                />
                            </Grid>
                        </MuiPickersUtilsProvider>
                        {/* <div className="icon-round">

                        <DateTimePicker
                            onChange={this.handleChangeDate}
                            value={this.state.end_date}
                        />
                    </div> */}
                    </div>
                </div>
        );
    }
}


export default connect(
    (state) => ({ staff: state.stuff, word: state.word }),

)(SubTask);