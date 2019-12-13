import React from 'react';
import './styles/App.scss';
// import 'bootstrap/dist/css/bootstrap.min.css'
import { BrowserRouter as Router, Route, Switch} from 'react-router-dom';
// import {Button } from 'semantic-ui-react'
import LandingPage from './components/LandingPage.component';
import signupConatainer from './components/signup/signupForm.component';

function App() {
  return (
    <Router>
      <div id="land-page" className="land_page bg">
        <Switch>
          <Route path="/signup" component={signupConatainer}/>
          <Route path="/" exact component={LandingPage}/>
        </Switch>
      </div>
    </Router>
  );
}
export default App;
