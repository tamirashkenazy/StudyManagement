import React, { useState } from 'react';
import './styles/App.scss';
import { BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import {useAsyncHook} from './components/mongo/paths.component'
import LandingPage from './components/login/LandingPage.component';
import signupConatainer from './components/signup/signupFormContainer.component';
import Main from './components/main/dashboard_main';
import Student from './components/main/student/student.component';
import Teacher from './components/main/teacher/teacher.component';
import Admin from './components/main/admin/admin.component';
import get_mongo_api from './components/mongo/paths.component';


function App() {
  const [teachers, isLoading_teachers] = useAsyncHook(`teachers`)
  const [students, isLoading_students] = useAsyncHook(`students`)
  const [users, isLoading_users] = useAsyncHook('users')
  return (
    (!isLoading_teachers && !isLoading_students && !isLoading_users) ? 
    <Router>
      <Switch>
          <Route path="/signup" component={signupConatainer} />
          <Route path="/main/student" render={ (props)=> <Student {...props} students={students}/>}/>
          <Route path="/main/teacher" render={(props)=><Teacher {...props} teachers={teachers} />} />
          <Route path="/main/admin" render={(props)=><Admin  {...props} teachers={teachers} students={students} users={users}/>}/>
          {/* //https://tylermcginnis.com/react-router-pass-props-to-components/ */}
          <Route path="/main" render={(props)=><Main  {...props}  teachers={teachers}/>}/>
          {/**landing page is the sign in page */}
          <Route path="/" exact component={LandingPage}/> 
        </Switch>
    </Router>
    :
    <label>Loading</label>
  );
}
export default App;
