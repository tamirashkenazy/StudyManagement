import React, {useEffect} from 'react'
import {useHistory} from 'react-router-dom'
import axios from 'axios'
import get_mongo_api from '../mongo/paths.component'

export default function Main(props) {
    let history = useHistory();
    const fetchDataById = async (_id, next_role) => {
        axios.get(get_mongo_api(`users/${_id}`)).then((response=>{
            if (response.data.success) {
                let user = response.data.message
                if(next_role === null) {
                  if(user.isStudent) {
                    history.replace({
                      pathname: '/main/student',
                      state: user
                    });
                  } else if(user.isTeacher) {
                    //the replace make the history to be: from the login which is '/' to /main and it replaces the /main to be one of the following by the role of the user
                    //then if you go back on the browser it will go to '/', if you change from replace to push, the stack was '/' -> '/main' -> '/main/role' which is bad because main just fetching
                    history.replace({
                      pathname: '/main/teacher', 
                      state: user,
                    });
                  } else if(user.isAdmin) {
                    history.replace({
                      pathname: '/main/admin', 
                      state: user,
                    });
                  }
                } else {
                  history.replace({
                    pathname: `/main/${next_role}`, 
                    state: user
                  });
                }
            } else {
              alert("error, the account is not a teacher, a student or an admin")
            }
        }))
    }

    useEffect(()=>{
        const {_id} = props.location.state
        const {next_role} = props.location
        fetchDataById(_id, next_role)
    });
    return(
      <></>
    )
}
