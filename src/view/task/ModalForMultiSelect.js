import React, { Component } from 'react';
import { connect } from "react-redux";
import Loader from 'react-loader-spinner';
// import MyImgRound from "../../../components/MyImgRound";
// import { searchAction } from "../../../action";
// import "../../../assets/css/add.css";

class ModalForMultiSelect extends Component {

    render() {
        return (
            <div className='multi-select-modal' >
                {!this.props.loading ? this.props.body : <div className="loaderMargin"><Loader
                    type="Oval"
                    color="#101C2A"
                    height={30}
                    width={30}
                /></div>}
            </div>
        );
    }
}


export default connect(
    (state) => ({
        // word: state.word, search: state.search, stuff: state.stuff.results.filter(item => {
        //     let lowerCaseFirstName = item.user.first_name.toLowerCase()
        //     let lowerCaseLirstName = item.user.last_name.toLowerCase()
        //     return (
        //         lowerCaseFirstName.includes(state.search.toLowerCase()) ||
        //         lowerCaseLirstName.includes(state.search.toLowerCase())
        //     );
        // }),
    }),
    dispatch => ({
        // find: text => dispatch(searchAction(text)),
    })
)(ModalForMultiSelect);