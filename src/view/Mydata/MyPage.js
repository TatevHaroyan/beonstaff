import React, { Component } from 'react';
import { Row } from 'react-bootstrap';
import { connect } from 'react-redux';
import OrgData from "./OrgData";
import { todaysTaskSum } from "../../api";
import Loader from 'react-loader-spinner';
import { changeEmployeeData, getEmployeeData } from "../../api/index";
import 'moment/locale/hy-am';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import '../../assets/css/mypage.css';
class MyPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: true,
            user: {
                name: "",
                surname: "",
                phone: "",
                email: "",
                document_type: "",
                document_number: ""
            }
        }
    }
    componentDidMount() {
        this.get_day_reports()
    }
    get_day_reports() {
        todaysTaskSum()
            .then((res) => {
                if (res.error) {
                } else {
                    this.setState({ ...this.state, ...res })
                }
            })
    }
    render() {
        const token = localStorage.getItem("token");
        const { myData } = this.props;
        let { imagePreviewUrl } = this.state;
        let $imagePreview = null;
        if (imagePreviewUrl !== "") {
            $imagePreview = (<div className='change-my-img' style={{ backgroundImage: "url(" + imagePreviewUrl + ")" }} />);
        }
        let date = new Date();
        return (
            myData.url ? <div className='my-page'>
                <div className='modules-header'>
                </div>
                <div className='my-page-cont'>
                    <div className='container'>
                        <Row className='img-name flex-nowrap justify-content-center'>
                            <div className='image-round-name'>
                                <div className='image-round'>
                                    <div className='my-image'
                                        style={{
                                            backgroundImage: myData.image && !this.state.file ? "url(" + myData.image + ")" : null
                                        }}
                                    >{$imagePreview}
                                    </div>
                                    <div className='photo-camera-background'>
                                        <label>
                                            <input className="fileInput" onKeyDown={(e) => this.keyPress(e)}
                                                multiple
                                                type="file"
                                                onChange={(e) => {
                                                    let id = myData.id;
                                                    let reader = new FileReader();
                                                    let file = e.target.files[0] ? e.target.files[0] : this.state.image;
                                                    let formData = new FormData();
                                                    // let image = this.state.image;
                                                    if (file) formData.append("image", file);
                                                    formData.append("user.first_name", myData.user.first_name);
                                                    formData.append("user.last_name", myData.user.last_name);
                                                    formData.append("user.email", myData.user.email);
                                                    reader.onloadend = () => {
                                                        changeEmployeeData(formData, token, id, localStorage.getItem("profession"))
                                                            // .then(() => this.props.close())
                                                            .then((res) => {
                                                                getEmployeeData(id, token, localStorage.getItem("profession"))
                                                                    .then((res) => {
                                                                        this.props.getEmployeeData(res)
                                                                    })
                                                            }).catch((error) => {
                                                                console.log(error);
                                                            })
                                                        this.setState({
                                                            ...this.state,
                                                            imagePreviewUrl: reader.result,
                                                            // image: file,
                                                        });
                                                        // this.changehandle(file)
                                                    }
                                                    // this.uploadImage(value)
                                                    reader.readAsDataURL(file)
                                                }} />
                                            <div className='photo-camera'></div>
                                        </label>
                                    </div>
                                </div>
                                <h1>{myData.user ? myData.user.first_name : ""}  {myData.user ? myData.user.last_name : ""}</h1>
                            </div>
                        </Row>

                        <OrgData {...this.props} />
                        <div className="day-reports">
                            <div><h5>Օրվա աշխատանքները</h5><span className="all-tasks">ընդհանուր-{this.state.all_duration}</span></div>
                            <div className="table-cont">
                                <div className="table-inside">
                                    <table>
                                        {this.state.result && this.state.result.length > 0 ? <tbody>
                                            <tr>
                                                <th>Կազմակերպության անուն</th>
                                                <th>Առաջադրանքի անուն</th>
                                                <th>Տևողություն</th>
                                            </tr>
                                            {this.state.result.map((item, index) => {
                                                return <tr className='report-list' key={index}>
                                                    <td className='report-item'>{item.company_name}</td>
                                                    <td className='report-item'>{item.task_name}</td>
                                                    <td className='report-item'>{item.duration}</td>
                                                </tr>
                                            })}
                                        </tbody> : <span>Առաջադրանքներ չկան</span>}
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div> : <div className="loaderMargin"><Loader
                type="Oval"
                color="#101C2A"
                height={30}
                width={30}
            /></div>
        );
    }
}
export default connect(
    (state) => ({ show: state.showReducer, myData: state.loginReducer }),
)(MyPage);