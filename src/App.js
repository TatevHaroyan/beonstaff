import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
// import Manager from "./components/Manager/Manager";
import MainManager from "./view/MainManager";
import ManagerLogin from "./view/ManagerLogin";
import { ToastContainer } from 'react-toastify';
import { connect } from "react-redux";
import Loader from 'react-loader-spinner';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import './App.css';
class App extends Component {
  render() {
    return (
      <Router>
        <div className='App'>
          {this.props.changeStatus ?
            <div className="change-status-popup">
              <Loader
                type="Oval"
                color="#07608d"
                height={30}
                width={30}
              />
            </div>
            : null}
          <ToastContainer autoClose={1000} />
          <Switch>
            <Route path="/main_employee" component={MainManager} />
            {!localStorage.getItem("token") ? <Route path="/employee" component={ManagerLogin} /> : null}
            {localStorage.getItem("token") ? <Redirect from='/*' to='/main_employee' /> : <Redirect from='/*' to='/employee' />}
          </Switch>
        </div>
      </Router>
    );
  }
}
export default connect(
  (state) => ({
    word: state.word, show: state.showReducer, profession: state.profession,
    organization: state.organization, changeStatus: state.changeStatus
  }),
  (dispatch) => ({

  })
)(App);

