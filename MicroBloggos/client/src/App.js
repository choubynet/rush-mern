import React, { Component } from 'react';
import  { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import jwt_decode from 'jwt-decode';

import store from './store';

import Main from './components/Layout/Main';

import Home from './components/Home';
import Register from './components/Auth/Register';
import Login from './components/Auth/Login';
import Profile from './components/Profile/Profile';
import Modify from './components/Profile/Modify'
import NotFound from './components/NotFound';
import Search from './components/Search/NotFound';
import MembersList from './components/Members/MembersList';
import setAuthHeader from './utils/setAuthHeader';
import { logoutUser, getCurrentUser } from './actions/authActions';

if (localStorage.getItem('jwtToken')) {
  const currentTime = Date.now() / 1000
  const decode = jwt_decode(localStorage.getItem('jwtToken'))

  if (currentTime > decode.exp) {
    store.dispatch(logoutUser())
    window.location.href = '/'
  }
  else {
    setAuthHeader(localStorage.getItem('jwtToken'))
    store.dispatch(getCurrentUser())
  }
}

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <div>
          <BrowserRouter>
          <Main>
              <Switch>
                <Route exact path="/" component={Home} />
                <Route path="/login" component={Login} />
                <Route path="/register" component={Register} />
                <Route path="/profile/:userId" component={Profile} />
                <Route path="/modify/:userId" component={Modify} />
                <Route path="/search" component={Search} />
                <Route path="/members" component={MembersList} />
                <Route component={NotFound} />
              </Switch>
            </Main>
          </BrowserRouter>
        </div>
      </Provider>
    );
  }
}

export default App;
