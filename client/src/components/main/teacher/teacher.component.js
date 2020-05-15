import React, { useState } from 'react';
import AppBar from '@material-ui/core/AppBar';
import { useStylesAppBar } from '../navbar/appBarMenu.styles'
import AccountMenu from '../navbar/navbar.component'
import EventAvailableOutlinedIcon from '@material-ui/icons/EventAvailableOutlined';
import ImportContactsSharpIcon from '@material-ui/icons/ImportContactsSharp';
import AssignmentOutlinedIcon from '@material-ui/icons/AssignmentOutlined';
import CoursesToTeach from './courses_teaching.component'
import UploadGradesSheet from './teacher_grades_sheet.component'
import UpdateAvailability from './update_availability.component'
import { Dialog_generator } from '../utils/utils'
import TeachersStatusRequestsTable from './requests_status.component'
import LessonsTable from './lessons_table.component'
import ProgressBar from './progress_bar.component'
import '../../../styles/teachers.scss';
import { Typography } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';

const getOpenedPopup = (is_open_select_courses_to_teach, is_update_availability, is_upload_grades_sheet) => {
    return (
        { select_courses: is_open_select_courses_to_teach, update_availability: is_update_availability, upload_grades_sheet: is_upload_grades_sheet }
    )
}

const filter_teacher_by_id = (teachers, id) => {
    let teacher_obj = teachers.filter(teacher => teacher._id === id)
    if (teacher_obj.length > 0) {
        teacher_obj = teacher_obj[0]
        return teacher_obj
    }
    return null
}


export default function Teacher(props) {
    const { teachers } = props
    const user = props.history.location.state
    // const [user, setUser] = useState(props.history.location.state)
    const [openedPopups, setOpenedPopups] = useState(getOpenedPopup(false, false, false))
    const navbar_operations_by_role = [
        { key: 'update_availability', header: 'עדכון זמינות', on_click: () => setOpenedPopups(Object.assign({}, getOpenedPopup(false, true, false))), icon: <EventAvailableOutlinedIcon fontSize="large" style={{ color: "white" }} /> },
        { key: 'courses_to_teach', header: 'בחירת קורסים להוראה', on_click: () => setOpenedPopups(Object.assign({}, getOpenedPopup(true, false, false))), icon: <ImportContactsSharpIcon fontSize="large" style={{ color: "white" }} /> },
        { key: 'upload_grades_sheet', header: 'העלאת גיליון ציונים', on_click: () => setOpenedPopups(Object.assign({}, getOpenedPopup(false, false, true))), icon: <AssignmentOutlinedIcon fontSize="large" style={{ color: "white" }} /> }
    ]


    const classes = useStylesAppBar();
    let teacher = filter_teacher_by_id(teachers, user._id)

    return (
        teacher ?
            <div className="teacher">
                <AppBar position="static" className={classes.AppBar} >
                    <AccountMenu userDetails={user} next_role='student' navbar_operations_by_role={navbar_operations_by_role} props={{ formSubmitButtonName: "עדכן פרטים" }} />
                </AppBar>
                {Dialog_generator(openedPopups.select_courses, () => setOpenedPopups(Object.assign({}, getOpenedPopup(false, false, false))), "בחירת קורסים להוראה","menu_book", { id: user._id, teacher }, (id, teacher) => CoursesToTeach(id, teacher))}
                {Dialog_generator(openedPopups.upload_grades_sheet, () => setOpenedPopups(Object.assign({}, getOpenedPopup(false, false, false))), "העלאת גיליון ציונים","assignment", { id: user._id }, (id) => UploadGradesSheet(id))}
                {Dialog_generator(openedPopups.update_availability, () => setOpenedPopups(Object.assign({}, getOpenedPopup(false, false, false))), "עדכון זמינות","date_range", { id: user._id }, (id) => UpdateAvailability(id))}
                <br></br>
                    <Typography variant="h3" align="center" >ברוך הבא למסך המורה</Typography>
                <br></br>   
                <Grid container spacing={10} justify="space-around" direction="row-reverse" >
                    <Grid item md={4} xs={4}  style={{marginRight : "1rem"}}>
                        <TeachersStatusRequestsTable teaching_requests={teacher.teaching_requests} />
                    </Grid>
                    <Grid item md={4} xs={4} style={{marginLeft : "1rem"}}>
                        <LessonsTable id={user._id} />
                    </Grid>
                </Grid>
                <br/><br/>
                <Grid container justify="center">
                    <Grid item md={4} xs={4}>
                        <ProgressBar id={user._id} />
                    </Grid>
                </Grid>
                
            </div>
            : <div>
                loading teacher
        </div>

    )
}
