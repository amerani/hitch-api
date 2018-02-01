import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import logo from './logo.svg';
import './App.css';

const QUERY = gql`query { user(email:"alekmerani@gmail.com") { id, firstName, lastName } }`

class App extends Component {
  render() {
    console.log(this.props)
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          {!this.props.loading && <span> Hi {this.props.user.firstName} {this.props.user.lastName} </span> }
        </p>
      </div>
    );
  }
}

export default graphql(QUERY, {
  props: ({ data: { loading, error, networkStatus, user } }) => {
    console.log(user)
    if (loading) {
      return { loading };
    }

    if (error) {
      return { error };
    }

    return {
      loading: false,
      networkStatus,
      user,
    };
  },
})(App);
