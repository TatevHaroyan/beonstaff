import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route } from "react-router-dom";
import { NAVBAR_SHOW, LAODER_ORG, LOADER_STUFF } from "../action/type";
import { employeeAction, stuffAction, orgAction, tasksAction, employeeManagerAction, getNotificationAction, get_org_limit, get_stuff_limit } from "../action/index";
import { getMeById, getStuff, getOrg, getManager, getNotification, getNewTaskCount } from "../api";
import Settings from "./Mydata/Settings/Settings";
import MyImgRound from "../components/MyImgRound";
import Timer from "../components/Timer";
import shemLogo from "../assets/img/shemm-white.png";
import moment from 'moment';
import 'moment/locale/hy-am';
import '../assets/css/manager.css';
import ManagerContant from "./ManagerContant";
import ManagerMenu from "./ManagerMenu";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
var notifcation_value;
class MainManager extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }
  token = localStorage.getItem("token")
  error_notify = () => toast.error("Չhաջողվեց բեռնել կազմակերպությունները, խնդրում ենք թարմացնել կայքը", {
    position: toast.POSITION.TOP_CENTER
  });
  componentDidMount() {
    this.getMeById()
    // getOrg(this.token)
    //   .then((res) => this.props.getOrg(res))
    getStuff(this.token, { limit: 1000 })
      .then((res) => this.props.getStuff(res))
    this.getManager()
    this.getOrg()
    // this.getMultiOrg()
    this.getMultiStaff()
    this.getNotificationInterval()
  }
  getMultiStaff() {
    this.props.loaderStuff()
    getStuff(this.token, { limit: 1000 })
      .then((res) => {
        this.props.getLimitStuff({ stuff: res.results })
      })
      .catch(() => {

        this.props.getLimitStuff()
      })
  }
  // getMultiOrg() {
  //   let list = []
  //   this.props.loaderOrg()
  //   // getOrg({ limit: 1000 })
  //   //   .then((res) => {
  //   //     this.props.getLimitOrg(res.results)
  //   //   })
  //   getOrg({ limit: 50 })
  //     .then((res) => {
  //       list = [...res.results]
  //       getOrg({ limit: 50, offset: 50 })
  //         .then((response) => {
  //           list = [...list, ...response.results]
  //           getOrg({ limit: 50, offset: 100 })
  //             .then((next_res) => {
  //               list = [...list, ...next_res.results]
  //               getOrg({ limit: 50, offset: 150 })
  //                 .then((next_response) => {
  //                   list = [...list, ...next_response.results]
  //                   console.log(list, "list");
  //                   this.props.getLimitOrg(list)
  //                 })
  //             })
  //         })
  //     })
  //     .catch(() => {
  //       this.error_notify()
  //       this.props.getLimitOrg()
  //     })
  // }
  getOrg() {
    this.props.loaderOrg()
    let list = []
    getOrg({ limit: 50 })
      .then((res) => {
        list = [...res.results]
        // this.props.getOrg(list)
        // this.props.getLimitOrg(list)
        console.log(res, 'reasdasd');
        getOrg({ limit: res.count, offset: 50 })
          .then((response) => {
            list = [...list, ...response.results]
            this.props.getOrg(list);
            this.props.getLimitOrg(list)
            // getOrg({ limit: 50, offset: 100 })
            //   .then((next_res) => {
            //     list = [...list, ...next_res.results]
            //     getOrg({ limit: 50, offset: 150 })
            //       .then((next_response) => {
            //         list = [...list, ...next_response.results]
            //         getOrg({ limit: 50, offset: 200 })
            //           .then((next) => {
            //             list = [...list, ...next.results]
            //             getOrg({ limit: 50, offset: 250 })
            //               .then((res_next) => {
            //                 list = [...list, ...res_next.results]
            //                 getOrg({ limit: 50, offset: 300 })
            //                   .then((response_next) => {
            //                     list = [...list, ...response_next.results]
            //                     getOrg({ limit: 50, offset: 350 })
            //                       .then((response_next_list) => {
            //                         list = [...list, ...response_next_list.results]
            //                         getOrg({ limit: 9999, offset: 400 })
            //                           .then((resssss) => {
            //                             list = [...list, ...resssss.results]
            //                             this.props.getOrg(list)
            //                             this.props.getLimitOrg(list)
            //                           })
            //                       })
            //                   })

            //               })
            //           })
            //       })
            //   })
          })

      })
    // .catch(() => {
    //   this.error_notify()
    //   this.props.getLimitOrg()
    // })
  }
  getNotification(id) {
    let data = localStorage.getItem("profession") !== "manager" ? { accountant_neq: id, accountants_client_eq: id } : { manager_neq: id, managers_client_eq: id }
    getNotification(data)
      .then((res) => {
        getNewTaskCount()
          .then((count) => {
            this.props.getNotification({ ...res, new_task: count })
          })
      })
  }
  getMeById() {
    let token = localStorage.getItem("token")
    let profession = localStorage.getItem("profession")
    let id = localStorage.getItem("id")
    getMeById(id, token, profession).then((getme) => {
      this.props.getMyInfo(getme)
      // if (localStorage.getItem("profession") === "accountant") {
      this.getNotification(id)
      // }
    }).catch((error) => console.log(error)
    )
  }
  getManager() {
    let token = localStorage.getItem("token");
    getManager(token).then((res) => {
      return this.props.getManager(res)
    })
  }
  getNotificationInterval() {
    notifcation_value = setInterval(() => {
      this.getNotification(localStorage.getItem("id"));
    }, 10000)
    return () => clearInterval(notifcation_value)
  }
  render() {
    // if (localStorage.getItem("profession") === "accountant") {
    // setTimeout(() => {
    //   this.getNotification(localStorage.getItem("id"));
    //   // this._timerList()
    // }, 180000)

    const { showNavbar, employee } = this.props
    return (
      <div className='manager-container'>
        {this.state.showSettingsModal ? <div className='popup' onClick={() => { this.setState({ showSettingsModal: false }) }}></div> : null}
        {this.state.showSettingsModal ? <Settings close={() => this.setState({ showSettingsModal: false })} /> : null}
        {showNavbar ? <div className='hidden-sheet' onClick={() => this.props.navbarShow()}></div> : null}
        <div className='manager-header'>
          <div className='container'>
            <div className='nav-bar'>
              <a className='logo'><img src={shemLogo} alt="logo" /></a>
              <div className='nav-bar-left'>
                {showNavbar ? <ManagerMenu /> : <span className='icon-Menu' onClick={() => this.props.navbarShow()}></span>}
                <div className="my-img-cont">
                  <a href="/main_employee/mypage" >
                    <MyImgRound image={employee.image} />
                    <div className='my-name'>
                      {employee.url && employee.user.first_name} {employee.url && employee.user.last_name}
                      <div className='menu-line'></div>
                    </div>
                    <Timer />
                  </a>
                  <div className="nav-item" onClick={() => this.setState({ show: !this.state.show })}>
                    {/* <a href="/main_employee/mypage" >  */}
                    <div className="dropdown-cont"></div>
                    {this.state.show ? <div className="dropdown-hover-none">
                      <div className='nav-item'><a href="/main_employee/mypage">Անձնական հաշիվ</a></div>
                      <div className='nav-item'><div onClick={() => {
                        this.setState({ showSettingsModal: true })
                      }}>էջի կարգավորումներ</div></div>
                      <div className='nav-item'><div onClick={() => {
                        localStorage.clear()
                        window.location = "/manager"
                      }} >Դուրս գալ</div></div>
                    </div> : null}
                  </div>
                  {/* </a> */}
                  {/* <i className="fas fa-power-off" onClick={() => {
                    localStorage.clear()
                    window.location = "/manager"
                  }}  ></i> */}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='header-line'></div>
        <Route path="/main_employee" component={ManagerContant} />
      </div>
    );
  }
  // }
}
export default connect(
  (state) => ({ word: state.word, show: state.showReducer, employee: state.loginReducer, showNavbar: state.showNavbar, activItem: state.managerReducer, notification: state.notification }),
  (dispatch) => ({
    navbarShow: () => dispatch({ type: NAVBAR_SHOW }),
    dataEmployee: (data) => dispatch(employeeAction(data)),
    getMyInfo: (data) => dispatch(employeeAction(data)),
    getStuff: (data) => dispatch(stuffAction(data)),
    getOrg: (data) => dispatch(orgAction(data)),
    getTasks: (data) => dispatch(tasksAction(data)),
    getManager: (data) => dispatch(employeeManagerAction(data)),
    getNotification: (data) => dispatch(getNotificationAction(data)),
    getLimitOrg: (data) => dispatch(get_org_limit(data)),
    getLimitStuff: (data) => (dispatch(get_stuff_limit(data))),
    loaderOrg: () => (dispatch({ type: LAODER_ORG })),
    loaderStuff: () => (dispatch({ type: LOADER_STUFF }))
  })
)(MainManager);