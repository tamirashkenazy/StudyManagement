import React, {useState } from 'react';
import AppBar from '@material-ui/core/AppBar';
import {useStylesAppBar} from '../navbar/appBarMenu.styles'
import AccountMenu from '../navbar/navbar.component'
import EventAvailableOutlinedIcon from '@material-ui/icons/EventAvailableOutlined';
import ImportContactsSharpIcon from '@material-ui/icons/ImportContactsSharp';
import CoursesToTeach from'./courses_teaching.component'
import {Dialog_generator} from '../utils/utils'
import TeachersStatusRequestsTable from './requests_status.component'

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
const getOpenedPopup = (is_open_select_courses_to_teach, is_update_availability) => {
    return(
        { select_courses : is_open_select_courses_to_teach, update_availability : is_update_availability }
    )
}

const filter_teacher_by_id = (teachers, id) => {
    let teacher_obj = teachers.filter(teacher => teacher._id === id)
    teacher_obj = teacher_obj[0]
    return teacher_obj
}

export default function Teacher(props) {
    const {teachers } = props
    const user = props.history.location.state
    // const [user, setUser] = useState(props.history.location.state)
    const [openedPopups, setOpenedPopups] = useState(getOpenedPopup(false, false))
    const navbar_operations_by_role = [
        { key : 'update_availability', header : 'עדכון זמינות' , on_click : ()=>{console.log("update your zminut")} , icon : <EventAvailableOutlinedIcon fontSize="large" style={{color:"white"}} />},
        { key : 'courses_to_teach', header : 'בחירת קורסים להוראה' , on_click : ()=>setOpenedPopups(Object.assign({},getOpenedPopup(true, false))) , icon : <ImportContactsSharpIcon fontSize="large" style={{color:"white"}} />}
      ]
    const classes = useStylesAppBar();
    let teacher = filter_teacher_by_id(teachers, user._id)
    console.log('teacher: ', teacher );
    console.log('teachers: ', teachers );
    return (
        <div>
            <AppBar position="static" className={classes.AppBar} >
                <AccountMenu userDetails={user} next_role='student' navbar_operations_by_role={navbar_operations_by_role} props={{formSubmitButtonName : "עדכן פרטים"}} />
            </AppBar> 
            {Dialog_generator(openedPopups.select_courses, ()=>setOpenedPopups(Object.assign({},getOpenedPopup(false, false))), "בחירת קורסים ללמד",{_id:user._id, teacher }, (id, teacher)=>CoursesToTeach(id, teacher))}

        {/* <h5> */}
        <Grid container spacing={1} alignItems="stretch" justify="space-evenly" direction="row" style={{margin:"0 auto", direction :"rtl"}}>
            <Grid item xs align="center">
                <Typography variant="h4">שיעורים</Typography>
                {/* <TeachersStatusRequestsTable/> */}
            </Grid>
            <Grid item xs align="center">
                <Typography variant="h4">סטטוס בקשות</Typography>
                <TeachersStatusRequestsTable teacher={teacher}/>
            </Grid>

        </Grid>
        {/* </h5> */}
        </div>
    )
}
