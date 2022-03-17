import '../assets/css/manager.css';
import React, { Component } from 'react';
import { connect } from "react-redux";
class SearchBar extends Component {
    render() {
        return (
            <div className='search-bar'>
                <div className="search-button">
                    Որոնել
                </div>
                <input className="search-input" value={this.props.value} onChange={(e) => this.props.onChange(e.target.value)} />
                <div className="search-button">
                    <i className="fas fa-search"></i>
                </div>
            </div>
        );
    }
}
export default connect(
    (state) => ({ word: state.word, show: state.showReducer }),
)(SearchBar);