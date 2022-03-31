import React, { Component } from 'react';
import { connect } from "react-redux";
import user from "../assets/img/user.png";
class MyImgRound extends Component {

    render() {
        return (
            <div className='my-img-round'
                style={{
                    backgroundImage: !this.props.image ? `url(` + user + `)` : `url(` + this.props.image + `)`
                }}
            >
            </div>
        );
    }
}


export default connect(
    (state) => ({
        employee: state.loginReducer
    })
)(MyImgRound);