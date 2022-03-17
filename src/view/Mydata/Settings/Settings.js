import React, { Component } from 'react';
import { connect } from 'react-redux';
import Name from "./Name";
import Phone from "./Phone";
import Email from "./Email";
import Password from "./Password";
class Settings extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }

    }
    // showModal() {
    //     switch (this.state.show) {
    //         case "name":
    //             return <Name close={() => this.setState({ show: "" })} />
    //         case "surname":
    //             return <Name close={() => this.setState({ show: "" })} showSettings="surname" />
    //         case "phone":
    //             return <Phone close={() => this.setState({ show: "" })} />
    //         case "email":
    //             return <Email close={() => this.setState({ show: "" })} />
    //         case "password":
    //             return <Password close={() => this.setState({ show: "" })} />
    //         default:
    //             break;
    //     }
    // }
    render() {
        const { word, login } = this.props;
        return (
            <div className="settings-cont">
                {this.state.show === "password" ? <div className='popup' onClick={() => { this.setState({ show: "" }) }}></div> : null}
                {this.state.show === "password" ? <Password close={() => this.setState({ show: "" })} /> : null}
                {/* {this.showModal()} */}
                <div className='settings'>
                    <i className="fa fa-times" aria-hidden="true" onClick={() => this.props.close()}></i>
                    <div className=''>
                        <div className="settings-elem">
                            <span className="label">Անուն</span>
                            <span className="data">{login.user.first_name}</span>
                            <div className="tool-tip-cont">
                                <div className="tool-tip">Խմբագրել</div>
                                <span onClick={() => { this.setState({ show: "name" }) }} className='icon-Compose'></span>
                            </div>
                        </div>
                        {this.state.show === "name" ? <div>
                            <Name close={() => this.setState({ show: "" })} />
                        </div> : null}
                    </div>
                    <div>
                        <div className="settings-elem">
                            <span className="label">{word.surname}</span>
                            <span className="data">{login.user.last_name}</span>
                            <div className="tool-tip-cont">
                                <div className="tool-tip">Խմբագրել</div>
                                <span onClick={() => { this.setState({ show: "surname" }) }} className='icon-Compose'></span>
                            </div>
                        </div>
                        {this.state.show === "surname" ? <div>
                            <Name close={() => this.setState({ show: "" })} showSettings="surname" />
                        </div> : null}
                    </div>
                    <div>
                        <div className="settings-elem">
                            <span className="label">{word.phone}</span>
                            <span className="data">{login.phone}</span>
                            <div className="tool-tip-cont">
                                <div className="tool-tip">Խմբագրել</div>
                                <span onClick={() => { this.setState({ show: "phone" }) }} className='icon-Compose'></span>
                            </div>
                        </div>
                        <div>
                            {this.state.show === "phone" ? <Phone close={() => this.setState({ show: "" })} /> : null}
                        </div>
                    </div>
                    <div>
                        <div className="settings-elem">
                            <span className="label">{word.email}</span>
                            <span className="data">{login.user.email}</span>
                            <div className="tool-tip-cont">
                                <div className="tool-tip">Խմբագրել</div>
                                <span onClick={() => { this.setState({ show: "email" }) }} className='icon-Compose'></span>
                            </div>
                        </div>
                        <div>
                            {this.state.show === "email" ? <Email close={() => this.setState({ show: "" })} /> : null}
                        </div>
                    </div>
                    <div className="settings-elem">
                        <span>{word.password}</span>
                        <div className="tool-tip-cont">
                            <div className="tool-tip">Խմբագրել</div>
                            <span onClick={() => { this.setState({ show: "password" }) }} className='icon-Compose'></span>
                        </div>
                    </div>
                </div>
            </div>
        );

    }
}


export default connect(
    (state) => ({ word: state.word, login: state.loginReducer, show: state.showReducer }),
    // { getMeById }
    // (dispatch) => ({
    //     getUserInfo: (data) => dispatch(getUser(data)),
    // })
)(Settings);