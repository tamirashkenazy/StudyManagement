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


    // const  = () => {
        
    // }
    // onEnter={RequestHours()} 
    return (
        <div>
            <AppBar position="static" className={classes.AppBar} >
                <AccountMenu userDetails={user} next_role='teacher' navbar_operations_by_role={navbar_operations_by_role} formSubmitButtonName="עדכן פרטים"/>

            </AppBar> 
        <h5>
        Student{openedPopups.request_hours_popup}
        </h5>
        {Dialog_generator(openedPopups.request_hours_popup, ()=>setOpenedPopups(getOpenedPopup(false, false)), "בקשת שעות חונכות",{_id:user._id}, ()=>RequestHours(props._id))}
        {/* <Dialog open={openedPopups.request_hours_popup} onClose={()=>setOpenedPopups(getOpenedPopup(false, false))} aria-labelledby="form-dialog-title">
            <DialogTitle style={{direction : "rtl", textAlign:"right"}} id="form-dialog-title">בקשת שעות חונכות</DialogTitle>
            <DialogContent style={{direction : "rtl", textAlign:"right"}}>
            <RequestHours/>
            </DialogContent>
        </Dialog> */}
        

        </div>
    )
}