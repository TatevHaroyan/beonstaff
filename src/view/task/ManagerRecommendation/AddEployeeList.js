import React, { Component } from 'react';
import { connect } from "react-redux";
import MyImgRound from "../../../components/MyImgRound";
import { searchAction } from "../../../action";
import "../../../assets/css/add.css";

class AddEployeeList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            find: "",
        }
    }
    render() {
        return (
            <div className='add-employee-list' >
                <input type="text" value={this.props.search}
                    onChange={(e) => {
                        let value = e.target.value
                        this.props.find(value)
                    }} />
                <div className='employee-name-cont'>
                    {this.props.stuff ? this.props.stuff.map((item, index) => {
                        return <div key={index}
                            className={item.url === this.props.accountant_url
                                ? 'employee-name backgroundSame'
                                : "employee-name "}
                            onClick={() => {
                                this.props.save(item)
                                this.props.show()
                            }}>
                            <MyImgRound image={item.image ? item.image : null} />
                            <span>{item.user.first_name} {item.user.last_name}</span>
                        </div>
                    }) : null}
                </div>
            </div>
        );
    }
}


export default connect(
    (state) => ({
        word: state.word, search: state.search, stuff: state.stuff.results.filter(item => {
            let lowerCaseFirstName = item.user.first_name.toLowerCase()
            let lowerCaseLirstName = item.user.last_name.toLowerCase()
            return (
                lowerCaseFirstName.includes(state.search.toLowerCase()) ||
                lowerCaseLirstName.includes(state.search.toLowerCase())
            );
        }),
    }),
    dispatch => ({
        find: text => dispatch(searchAction(text)),
    })
)(AddEployeeList);