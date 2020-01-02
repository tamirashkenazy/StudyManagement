import React, {useState, useEffect } from 'react';
import AppBar from '@material-ui/core/AppBar';
import {useStyles} from './appBarMenu.styles'
import AccountMenu from './navbar.component'
import EventAvailableOutlinedIcon from '@material-ui/icons/EventAvailableOutlined';
import ImportContactsSharpIcon from '@material-ui/icons/ImportContactsSharp';



export default function Teacher(props) {
    const [user, setUser] = useState(props.history.location.state)
    const navbar_operations_by_role = [
        { key : 'update_availability', header : 'עדכון זמינות' , on_click : ()=>{console.log("update your zminut")} , icon : <EventAvailableOutlinedIcon fontSize="large" style={{color:"white"}} />},
        { key : 'courses_to_teach', header : 'בחירת קורסים להוראה' , on_click : ()=>{console.log("choose teach")} , icon : <ImportContactsSharpIcon fontSize="large" style={{color:"white"}} />}
      ]
    const classes = useStyles();
    const getUserFromDb = (_id) => {
        setUser(user)
    }
    useEffect(()=> {
        getUserFromDb(user._id)
    })
    return (
        <div>
            <AppBar position="static" className={classes.AppBar} >
                <AccountMenu userDetails={user} next_role='student' navbar_operations_by_role={navbar_operations_by_role} formSubmitButtonName="עדכן פרטים"/>
            </AppBar> 
        <h5>
          Teacher
        </h5>
        </div>
    )
}
