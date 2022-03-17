import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getNoteNextPage, getNote, deleteNote } from "../../api";
import '../../assets/css/manager.css';
import Pagination from "react-js-pagination";
import NewNote from "./NewNote.js";
import Button from "../../components/Button/Button";
import moment from 'moment';
import 'moment/locale/hy-am';
import Loader from 'react-loader-spinner';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";


class Note extends Component {
    constructor(props) {
        super(props);
        this.state = {
            note: [],
            count: 0,
            activePage: 1,
            show: false,
            deleteVisible: false,
        }
    }
    componentDidMount() {
        this.getNote()
    }
    getNote() {
        this.setState({ loading: true })
        let token = localStorage.getItem("token");
        let id = localStorage.getItem("id")
        getNote(token, id)
            .then((res) => this.setState({
                note: res.results, count: res.count, deleteVisible: false, loading: false
            }))
    }
    handlePageChange(pageNumber) {
        this.setState({ activePage: pageNumber });
        let page = pageNumber === 1 ? "" : (pageNumber - 1);
        let token = localStorage.getItem("token")
        let id = localStorage.getItem("id")
        getNoteNextPage(token, id, page)
            .then((res) => this.setState({
                note: res.results,
                count: res.count,
            }))
    }
    deleteNote(id) {
        deleteNote(id)
            .then(() => {
                this.getNote()
            })
    }
    loading(data) {
        if (data.length > 0 && this.state.loading === false) {
            return data.map((item, index) => {
                return <div className="note-item" key={index}>
                    <div className="note-item-title">{item.title}</div>
                    {/* <div className="note-item-end-date">{moment(item.end_date).format('YYYY-MM-DD')}</div> */}
                    <div className="tool-tip-cont">
                        <div className="tool-tip">Ջնջել</div>
                        <i className="fas fa-trash-alt" onClick={() => this.setState({ deleteVisible: true, id: item.id })}></i>
                    </div>
                </div>
            })
        }
        else if (this.state.loading === true) {
            return (<div className="loaderMargin"><Loader
                type="Oval"
                color="#101C2A"
                height={30}
                width={30}
            /></div>)
        } else {
            return <div></div>
        }
    }
    render() {
        const { word } = this.props
        return (
            <div className='users'>
                {this.state.show ? <div className='popup' onClick={() => { this.setState({ show: false }) }}></div> : null}
                {this.state.deleteVisible ? <div className="popup" onClick={() => this.setState({ deleteVisible: false })}>
                </div> : null}
                {this.state.deleteVisible ? <div className="delete-note">
                    <div className="delete-text"> {word.finish}</div>
                    <div className="note-buttons">
                        <Button
                            buttonStyle="blue-button"
                            onChangeValue={() => this.deleteNote(this.state.id)}
                            title={word.yes}
                        />
                        <Button
                            buttonStyle="blue-button"
                            onChangeValue={() => this.setState({ deleteVisible: false })}
                            title={word.no}
                        />
                    </div>
                </div> : null}
                <div className='plus-cont' onClick={() => {
                    this.setState({ show: true })
                }}><span className="plus">+</span>
                    <span className="tooltiptext">{word.addItem}</span>
                </div>

                {this.state.show ? <NewNote close={(res) => this.setState({
                    show: false, note: res ? res.results : this.state.note,
                    count: res ? res.count : this.state.count,
                })} /> : null}
                {this.loading(this.state.note)}
                {/* {this.state.note.length > 0 && this.state.loading === false ? this.state.note.map((item, index) => {
                    return <div className="note-item" key={index}>
                        <div className="note-item-title">{item.title}</div>
                        <div className="note-item-end-date">{moment(item.end_date).format('LLL')}</div>
                        <i className="fas fa-trash-alt" onClick={() => this.setState({ deleteVisible: true, id: item.id })}></i>
                    </div>
                }) : <div className="loaderMargin"><Loader
                    type="Oval"
                    color="#101C2A"
                    height={30}
                    width={30}
                /></div>} */}
                {this.state.note.length > 10 ? <Pagination
                    activePage={this.state.activePage}
                    itemsCountPerPage={10}
                    totalItemsCount={this.state.count}
                    pageRangeDisplayed={5}
                    onChange={(data) => this.handlePageChange(data)}
                /> : null}
            </div>
        );
    }
}
export default connect(
    (state) => ({ word: state.word, show: state.showReducer }),

)(Note);