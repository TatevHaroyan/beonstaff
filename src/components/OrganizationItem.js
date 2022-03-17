import React, { Component } from 'react';
import images from "../assets/img/images.jpg";
import { connect } from 'react-redux';
import { delete_company } from "../api";
import '../assets/css/manager.css';
const profession = localStorage.getItem("profession");
class OrganizationItem extends Component {
    delete_company() {
        let id = this.props.id
        let data = {
            id
        }
        delete_company(data)
    }
    render() {
        return (
            <div className='list-item card'>
                <a href={profession !== "manager" ? `/main_employee/organization_file/?company=${this.props.id}` : "#"}>
                    <div className='list-item-img' style={{ backgroundImage: this.props.logo !== null ? "url(" + this.props.logo + ")" : "url(" + images + ")" }}>
                    </div></a>
                <div className='list-item-data'>
                    <a href={`/main_employee/organization/${this.props.id}`}>
                        <div className="tool-tip-cont">
                            <div className="tool-tip">{this.props.orgname }</div>
                            <div className='list-item-name-surname'>{this.props.orgname}   {this.props.is_deleted ? <i className="fas fa-trash-alt" onClick={() => delete_company()}></i> : null}</div>
                        </div>
                    </a>
                    <div className='line'></div>
                    <span className='list-item-name-surname' >{this.props.name}</span>
                    <span className='list-item-name-surname'>{this.props.surname}</span>
                    <p className='profession'>{this.props.HVHH}</p>
                    <p className='numbers'>{this.props.phone}</p>
                </div>
                <div className="accountant_image_list">
                    {this.props.accountant_list ? this.props.accountant_list.map((item, index) => {
                        return <div key={index} className="accountant_image"
                            style={{ backgroundImage: item.image !== null ? "url(" + item.image + ")" : "url( )" }}></div>
                    }) : null}
                </div>
            </div>
        );
    }
}
export default connect(
    (state) => ({ word: state.word, show: state.showReducer }),

)(OrganizationItem);