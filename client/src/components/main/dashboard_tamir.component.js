import React, {useEffect} from 'react'
import {useHistory} from 'react-router-dom'
import axios from 'axios'
import get_mongo_api from '../mongo/paths.component'

// import Toolbar from '@material-ui/core/Toolbar';
// import Typography from '@material-ui/core/Typography';
// import IconButton from '@material-ui/core/IconButton';
// import AccountCircle from '@material-ui/icons/AccountCircle';
// import ListItemIcon from '@material-ui/core/ListItemIcon';
// import ListItemText from '@material-ui/core/ListItemText';
// import {Sync, CreateOutlined} from '@material-ui/icons';
// import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
// import ExitToAppIcon from '@material-ui/icons/ExitToApp';
// import AccountMenu from './account_menu.component'

export default function Main(props) {
    let history = useHistory();

    // const [userDetails, setUserDetails] = useState({});
    // const [isLoading, setIsLoading] = useState(true)

    const fetchDataById = async (_id) => {
      
        axios.get(get_mongo_api(`users/${_id}`)).then((response=>{
            if (response.data.success) {
                let user = response.data.user
                console.log(JSON.stringify(user));
                // setUserDetails(user)
                // setIsLoading(false)
                if(user.isTeacher) {
                  //the replace make the history to be: from the login which is '/' to /main and it replaces the /main to be one of the following by the role of the user
                  //then if you go back on the browser it will go to '/', if you change from replace to push, the stack was '/' -> '/main' -> '/main/role' which is bad because main just fetching
                  history.replace({
                    pathname: '/main/teacher', 
                    state: user
                  });
                } else if(user.isStudent) {
                  history.replace({
                    pathname: '/main/student', 
                    state: user
                  });
                } else if(user.isAdmin) {
                  history.replace({
                    pathname: '/main/admin', 
                    state: user
                  });
                } else {
                  alert("error, the account is not a teacher, a student or an admin")
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
