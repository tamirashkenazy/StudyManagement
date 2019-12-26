import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import {useStyles} from './styles'
import AccountMenu from './account_menu.component'
import EventAvailableOutlinedIcon from '@material-ui/icons/EventAvailableOutlined';
import ImportContactsSharpIcon from '@material-ui/icons/ImportContactsSharp';
export default function Teacher(props) {
    const state = props.history.location.state
    // console.log(JSON.stringify(state));
    const navbar_operations_by_role = [
        { key : 'update_availability', header : 'עדכון זמינות' , on_click : ()=>{console.log("update your zminut")} , icon : <EventAvailableOutlinedIcon fontSize="large" style={{color:"white"}} />},
        { key : 'courses_to_teach', header : 'בחירת קורסים להוראה' , on_click : ()=>{console.log("choose teach")} , icon : <ImportContactsSharpIcon fontSize="large" style={{color:"white"}} />}
      ]
    const classes = useStyles();
    return (
        <div>
            <AppBar position="static" className={classes.AppBar} >
                <AccountMenu userDetails={state} next_role='student' navbar_operations_by_role={navbar_operations_by_role}/>
            </AppBar> 
        <h5>
          Teacher
        </h5>
        </div>
    )
}
