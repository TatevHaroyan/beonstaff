import React, { Component } from 'react';
import { connect } from "react-redux";
import MyImgRound from "../../components/MyImgRound";
import { searchAction, delete_search } from "../../action";
import { AddAccountantCompany, getOrgData } from "../../api";
// import { orgAction } from "../../action/index";
import BlueButton from "../../components/BlueButton/BlueButton";
import "../../assets/css/add.css";

class AddOrgAccountant extends Component {
    constructor(props) {
        super(props);
        this.state = {
            find: "",
            accountant: [],
            same: false
        }
    }
    componentDidMount() {
        console.log("componentDidMount");
        // this.pushList();
    }
    // componentWillUnmount() {
    //     console.log("componentWillUnmount");
    //     this.props.delete_search()
    // }
    // selectedAccountant = () => {
    //     console.log("selectedAccountant");
    //     this.setState({ accountant: this.props.data.accountant })
    // }
    // AddAccountantCompany() {
    //     console.log("AddAccountantCompany");
    //     let token = localStorage.getItem("token")
    //     let data = this.props.data;
    //     let id = data.id
    //     let company = {
    //         "id": data.id,
    //         "name": data.name,
    //         "client": data.client.url,
    //         "subscribe": data.subscribe,
    //         "accountant": this.state.accountant,
    //         "HVHH": data.HVHH,
    //         "address": data.address,
    //         "url": data.url
    //     }
    //     AddAccountantCompany(id, token, company)
    //         .then((res) => this.props.close())
    //         .then((res) => {
    //             getOrgData(token, id)
    //                 .then((res) => this.props.update(res))
    //         })
    // }
    // addAccountant(url) {
    //     console.log("urllllllllllllllllllll");
    //     this.setState((prevState) => {
    //         let tmp = { ...prevState }
    //         tmp.accountant.push(url)
    //         return tmp

    //     })
    // }
    // deleteAccountant(url) {
    //     console.log("deleteAccountanttttttttt");
    //     this.setState(prevState => ({
    //         accountant: prevState.accountant.filter(el => el !== url)
    //     }));
    // }
    pushList = () => {
        console.log("in push listttttttttttt");
        for (let i = 0; i < this.props.stuff.length; i++) {
            for (let j = 0; j < this.props.data.accountant.length; j++) {
                if (this.props.data.accountant[j].id === this.props.stuff[i].id) {
                    this.setState((prevState) => {
                        let tmp = { ...prevState }
                        tmp.accountant.push(this.props.data.accountant[j].url)
                        return tmp

                    })
                }
            }
        }
    }
    // findUrl = (url) => {
    //     console.log("findUrllllllllllllll");
    //     let data = this.state.accountant;
    //     let same = false
    //     for (let i = 0; i < data.length; i++) {
    //         if (url === data[i]) {
    //             same = true
    //         }
    //     }
    //     return same
    // }
    render() {
        const { word, search, stuff } = this.props;
        console.log("in renderrrrrrrrrrrrrrrrrr");
        return (
            <div className='add-employee-list' >
                <input type="text" value={search} onChange={(e) => {
                    let value = e.target.value
                    this.props.find(value)
                }} />
                <div className='employee-name-cont'>
                    {stuff.filter(item => {
                        let lowerCaseFirstName = item.user.first_name.toLowerCase()
                        let lowerCaseLirstName = item.user.last_name.toLowerCase()
                        return (
                            lowerCaseFirstName.includes(search.toLowerCase()) ||
                            lowerCaseLirstName.includes(search.toLowerCase())
                        );
                    })
                        .map((item, index) => {
                            // console.log(item, "itemmmmmm");
                            return <div key={index} className="employee-name" onClick={() => {
                                !this.findUrl(item.url) ? this.addAccountant(item.url) : this.deleteAccountant(item.url);
                            }}>
                                <MyImgRound image={item.image} />
                                <span>{item.user.first_name} {item.user.last_name}</span>
                            </div>
                        })}
                </div>
                <BlueButton title={word.append} onChangeValue={() => this.AddAccountantCompany()} />
            </div>
        );
    }
}

export default connect(
    (state) => ({
        word: state.word, search: state.search,
        stuff: state.stuff.results
    }),
    dispatch => ({
        find: text => dispatch(searchAction(text)),
        delete_search: () => dispatch(delete_search())

    })
)(AddOrgAccountant);