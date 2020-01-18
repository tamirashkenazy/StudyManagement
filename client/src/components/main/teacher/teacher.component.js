import React, {useState } from 'react';
import AppBar from '@material-ui/core/AppBar';
import {useStylesAppBar} from '../navbar/appBarMenu.styles'
import AccountMenu from '../navbar/navbar.component'
import EventAvailableOutlinedIcon from '@material-ui/icons/EventAvailableOutlined';
import ImportContactsSharpIcon from '@material-ui/icons/ImportContactsSharp';
import CoursesToTeach from'./courses_teaching.component'
import {Dialog_generator} from '../utils/utils'


const getOpenedPopup = (is_open_select_courses_to_teach, is_update_availability) => {
    return(
        { select_courses : is_open_select_courses_to_teach, update_availability : is_update_availability }
    )
}

export default function Teacher(props) {
    const [user, setUser] = useState(props.history.location.state)
    const [openedPopups, setOpenedPopups] = useState(getOpenedPopup(false, false))

    const navbar_operations_by_role = [
        { key : 'update_availability', header : 'עדכון זמינות' , on_click : ()=>{console.log("update your zminut")} , icon : <EventAvailableOutlinedIcon fontSize="large" style={{color:"white"}} />},
        { key : 'courses_to_teach', header : 'בחירת קורסים להוראה' , on_click : ()=>setOpenedPopups(Object.assign({},getOpenedPopup(true, false))) , icon : <ImportContactsSharpIcon fontSize="large" style={{color:"white"}} />}
      ]
    const classes = useStylesAppBar();
    return (
        <div>
            <AppBar position="static" className={classes.AppBar} >
                <AccountMenu userDetails={user} next_role='student' navbar_operations_by_role={navbar_operations_by_role} props={{formSubmitButtonName : "עדכן פרטים"}} />
            </AppBar> 
            {Dialog_generator(openedPopups.select_courses, ()=>setOpenedPopups(Object.assign({},getOpenedPopup(false, false))), "בחירת קורסים ללמד",{_id:user._id}, (id)=>CoursesToTeach(id))}

        <h5>
          Teacher
        </h5>
        </div>
    )
}
