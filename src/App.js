import React from 'react';
import logo from './logo.svg';
import './styles/App.scss';
// import 'bootstrap/dist/css/bootstrap.min.css'
import { BrowserRouter as Router, Route} from 'react-router-dom';
import {Button } from 'semantic-ui-react'
import CreateUser from './components/create-user.component'
import LandingPage from './components/LandingPage.component';

function App() {
  return (
    <Router>
      <div id="land-page" className="land_page bg">
        <LandingPage />
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
