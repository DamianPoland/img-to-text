import React from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'


// componentns
import Home from '../../components/Home/Home'
import Nav from '../../components/Nav/Nav'
import About from '../../components/About/About'
import PrivacyPolicy from '../../components/PrivacyPolicy/PrivacyPolicy'
import Footer from '../../components/Footer/Footer'


const App = () => {
  return (
    <BrowserRouter >
      <Route path='/' component={Nav} />
      <Switch>
        <Route path='/home' component={Home} />
        <Route path='/about' component={About} />
        <Route path='/privacy-policy' component={PrivacyPolicy} />
        <Redirect to='/home' />
      </Switch>
      <Route path='/' component={Footer} />
    </BrowserRouter>
  );
}


export default App;
