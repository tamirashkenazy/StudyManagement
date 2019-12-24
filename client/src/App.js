import React from 'react';
import './styles/App.scss';
// import 'bootstrap/dist/css/bootstrap.min.css'
import { BrowserRouter as Router, Route, Switch} from 'react-router-dom';
// import {Button } from 'semantic-ui-react'
import LandingPage from './components/login/LandingPage.component';
import signupConatainer from './components/signup/signupForm.component';
import Main from './components/main/dashboard_tamir.component';
import Student from './components/main/student.component';
import Teacher from './components/main/teacher.component';
import Admin from './components/main/admin.component';

function App() {
  return (
    <Router>
      <Switch>
          <Route path="/signup" component={signupConatainer} />
          <Route path="/main/student" component={Student}/>
          <Route path="/main/teacher" component={Teacher}/>
          <Route path="/main/admin" component={Admin}/>

          <Route path="/main" component={Main}/>
          <Route path="/" exact component={LandingPage}/>
        </Switch>
    </Router>
  );
}
export default App;
