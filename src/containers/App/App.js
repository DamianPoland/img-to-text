import React, { useEffect } from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'
import AlertPrivacy from '../../UI/AlertPrivacy/AlertPrivacy'
import AOS from 'aos'
import 'aos/dist/aos.css'


// componentns
import Home from '../../components/Home/Home'
import Nav from '../../components/Nav/Nav'
import About from '../../components/About/About'
import PrivacyPolicy from '../../components/PrivacyPolicy/PrivacyPolicy'
import Footer from '../../components/Footer/Footer'


const App = () => {

  // aos
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, [])


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
      <AlertPrivacy />
    </BrowserRouter>
  );
}


export default App;
