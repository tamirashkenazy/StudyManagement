import React from 'react';
import './styles/App.scss';
// import 'bootstrap/dist/css/bootstrap.min.css'
import { BrowserRouter as Router, Route} from 'react-router-dom';
// import {Button } from 'semantic-ui-react'
import LandingPage from './components/LandingPage.component';
import SignupForm from './components/signupForm';

function App() {
  return (
    <Router>
      <div id="land-page" className="land_page bg">
        {/* < /> */}
        <Route path="/" exact component={LandingPage}/>
        <Route path="/signup" component={SignupForm}/>
        {/* <Button> hey </Button> */}
      </div>
    </Router>
  );
}
/* <br/>
       <Route path="/" exact component={UsersList}/>
        <Route path="/create" component={CreateUser}/> 
*/
export default App;
