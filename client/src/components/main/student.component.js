import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import {useStyles} from './styles'
import AccountMenu from './account_menu.component'
import AssignmentTurnedInOutlinedIcon from '@material-ui/icons/AssignmentTurnedInOutlined';
import ScheduleOutlinedIcon from '@material-ui/icons/ScheduleOutlined';
export default function Student(props) {
    const state = props.history.location.state
    // console.log(JSON.stringify(state));
    const navbar_operations_by_role = [
        { key : 'request_tutoring', header : 'בקשת שעות חונכות' , on_click : ()=>{console.log("request_tutoring")} , icon : <ScheduleOutlinedIcon fontSize="large" style={{color:"white"}} />},
        { key : 'book_class', header : 'קביעת שיעור' , on_click : ()=>{console.log("book_class")} , icon : <AssignmentTurnedInOutlinedIcon fontSize="large" style={{color:"white"}} />}
      ]
    const classes = useStyles();
    return (
        <div>
            <AppBar position="static" className={classes.AppBar} >
                <AccountMenu userDetails={state} next_role='teacher'  navbar_operations_by_role={navbar_operations_by_role}/>
            </AppBar> 
        <h5>
          Student
        </h5>
        </div>
    )
}