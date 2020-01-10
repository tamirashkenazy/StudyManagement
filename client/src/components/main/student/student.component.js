import React, {useState } from 'react';
import AppBar from '@material-ui/core/AppBar';
import {useStyles} from '../navbar/appBarMenu.styles'
import AccountMenu from '../navbar/navbar.component'
import AssignmentTurnedInOutlinedIcon from '@material-ui/icons/AssignmentTurnedInOutlined';
import ScheduleOutlinedIcon from '@material-ui/icons/ScheduleOutlined';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import RequestHours from './request_hours.component'
import CoursesTable from './courses_table.component'
import { Grid } from 'semantic-ui-react'
const getOpenedPopup = (is_open_request_hours, is_open_book_class) => {
    return(
        {request_hours_popup : is_open_request_hours, book_class_popup : is_open_book_class }
    )
    
}


function Dialog_generator(open, onClose, title, props, component){
    const rtl_style = {direction : "rtl", textAlign:"right"}
    return (
        <Dialog open={open} onClose={onClose} aria-labelledby="form-dialog-title">
            <DialogTitle style={rtl_style} id="form-dialog-title">{title}</DialogTitle>
            <DialogContent style={rtl_style}>
            {component(props._id)}
            </DialogContent>
        </Dialog>
    )
}

export default function Student(props) {
    const user = props.history.location.state
    const [openedPopups, setOpenedPopups] = useState(getOpenedPopup(false, false))
    const navbar_operations_by_role = [
        { key : 'request_tutoring', header : 'בקשת שעות חונכות' , on_click : ()=>setOpenedPopups(Object.assign({},getOpenedPopup(true, false))) , icon : <ScheduleOutlinedIcon fontSize="large" style={{color:"white"}} />},
        { key : 'book_class', header : 'קביעת שיעור' , on_click : ()=>{console.log("book_class")} , icon : <AssignmentTurnedInOutlinedIcon fontSize="large" style={{color:"white"}} />}
      ]
    const classes = useStyles();


    return (
        <div>
            <AppBar position="static" className={classes.AppBar} >
                <AccountMenu userDetails={user} next_role='teacher' navbar_operations_by_role={navbar_operations_by_role} formSubmitButtonName="עדכן פרטים"/>

            </AppBar> 
        <h5>
        Student
        </h5>
        {Dialog_generator(openedPopups.request_hours_popup, ()=>setOpenedPopups(getOpenedPopup(false, false)), "בקשת שעות חונכות",{_id:user._id}, (id)=>RequestHours(id))}
        <Grid divided='vertically' centered>
            <Grid.Row columns={2}>
                <div>
                    דיב1
                </div>
                <div>
                    דיב2
                </div>
            </Grid.Row>
            <Grid.Row columns={1}>
                <Grid.Column> 
                    {CoursesTable(user._id)}
                </Grid.Column>
            </Grid.Row>
            
        </Grid>
        
        </div>
    )

}