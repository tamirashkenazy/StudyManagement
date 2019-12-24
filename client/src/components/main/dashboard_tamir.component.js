import React, {useEffect, useState} from 'react'
import {useHistory, Redirect} from 'react-router-dom'
import axios from 'axios'
import AppBar from '@material-ui/core/AppBar';
// import Toolbar from '@material-ui/core/Toolbar';
// import Typography from '@material-ui/core/Typography';
// import IconButton from '@material-ui/core/IconButton';
// import AccountCircle from '@material-ui/icons/AccountCircle';
// import ListItemIcon from '@material-ui/core/ListItemIcon';
// import ListItemText from '@material-ui/core/ListItemText';
// import {Sync, CreateOutlined} from '@material-ui/icons';
// import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
// import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import {useStyles} from './styles'
// import AccountMenu from './account_menu.component'

export default function Main(props) {
    let history = useHistory();

    const [userDetails, setUserDetails] = useState({});
    const [isLoading, setIsLoading] = useState(true)

    const fetchDataById = async (_id) => {
        axios.get(`http://localhost:5000/users/${_id}`).then((response=>{
            if (response.data.success) {
                let user = response.data.user
                console.log(JSON.stringify(user));
                setUserDetails(user)
                setIsLoading(false)
                if(user.isTeacher) {
                  history.push({
                    pathname: '/main/teacher', 
                    state: {first_name : "תמיר"}
                  });
                } else if(user.isStudent) {
                  history.push({
                    pathname: '/main/student', 
                    state: user
                  });
                } else if(user.isStudent) {
                  history.push({
                    pathname: '/main/admin', 
                    state: user
                  });
                } else {
                  alert("error, the account is not a teacher or a student")
                }
            } else {
              
            }
        }))
    }

    useEffect(()=>{
        const {_id} = props.location.state
        fetchDataById(_id)
    });

    // const classes = useStyles();
    return(
      <div>
        bla
        </div>
    )
    // return (
    //   !isLoading ? 
    //   <div>
    //   <AppBar position="static" className={classes.AppBar} >
    //       <AccountMenu userDetails={userDetails}/>
    //       {userDetails.isStudent ? <Redirect push to="/main/student" /> : <div>not student</div>}
    //   </AppBar> 
    //   <h5>
    //     {JSON.stringify(userDetails)}
    //   </h5>
    //   </div>
    //   : 
    //   <></>
  // )
}
