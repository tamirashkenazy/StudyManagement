import React, { useState } from 'react';
import AppBar from '@material-ui/core/AppBar';
import { useStylesAppBar } from '../navbar/appBarMenu.styles'
import AccountMenu from '../navbar/navbar.component'
import AssignmentTurnedInOutlinedIcon from '@material-ui/icons/AssignmentTurnedInOutlined';
import ScheduleOutlinedIcon from '@material-ui/icons/ScheduleOutlined';
import '../../../styles/students.scss';
import RequestHours from './request_hours_table.component'
import BookHours from './book_hours.component'
import History from './history.component'
import CoursesTable from './courses_table.component'
import LessonsTable from './lessons_table.component'
import TrackHoursTable from './track_hours_table.component'
import { Dialog_generator } from '../utils/utils'
import Grid from '@material-ui/core/Grid';
import { Typography } from '@material-ui/core';

const getOpenedPopup = (is_open_request_hours, is_open_book_class, is_open_history_popup) => {
    return (
        { request_hours_popup: is_open_request_hours, book_class_popup: is_open_book_class, history_popup: is_open_history_popup }
    )
}

const filter_student_by_id = (students, id) => {
    let student_obj = students.filter(student => student._id === id)
    if (student_obj.length > 0) {
        student_obj = student_obj[0]
        return student_obj
    }
    return null
}


export default function Student(props) {
    const { students } = props
    const user = props.history.location.state

    const [openedPopups, setOpenedPopups] = useState(getOpenedPopup(false, false, false))

    const navbar_operations_by_role = [
        { key: 'request_tutoring', header: 'בקשת שעות חונכות', on_click: () => setOpenedPopups(Object.assign({}, getOpenedPopup(true, false, false))), icon: <ScheduleOutlinedIcon fontSize="large" style={{ color: "white" }} /> },
        { key: 'book_class', header: 'קביעת שעת חונכות', on_click: () => setOpenedPopups(Object.assign({}, getOpenedPopup(false, true, false))), icon: <AssignmentTurnedInOutlinedIcon fontSize="large" style={{ color: "white" }} /> }
    ]
    const classes = useStylesAppBar();
    let student = filter_student_by_id(students, user._id)
    return (
        student ?
            <div className="student">
                <AppBar position="static" className={classes.AppBar} >
                    <AccountMenu userDetails={user} next_role='teacher' navbar_operations_by_role={navbar_operations_by_role} props={{ formSubmitButtonName: "עדכן פרטים" }} />
                </AppBar>
                {Dialog_generator(openedPopups.request_hours_popup, () => setOpenedPopups(Object.assign({}, getOpenedPopup(false, false, false))), " בקשת שעות חונכות","access_time", { _id: user._id }, (id) => RequestHours(id))}
                {Dialog_generator(openedPopups.book_class_popup, () => setOpenedPopups(Object.assign({}, getOpenedPopup(false, false, false))), "קביעת שעות חונכות", "assignment_turned_in",{ _id: user._id }, (id) => BookHours(id))}
                {Dialog_generator(openedPopups.history_popup, () => setOpenedPopups(Object.assign({}, getOpenedPopup(false, false, false))), "היסטוריית שיעורים","history", { _id: user._id }, (id) => History(id))}
                <br></br>
                <Typography variant="h3" align="center" >ברוך הבא למסך הסטודנט</Typography>
                <br></br>   
                <Grid container spacing={10} justify="space-around" direction="row-reverse" >
                    <Grid item md={4} xs={4}  style={{marginRight : "1rem"}}>
                        <TrackHoursTable id={user._id} setOpenedPopup={setOpenedPopups} />
                    </Grid>
                    <Grid item md={4} xs={4} style={{marginLeft : "1rem"}}>
                        <LessonsTable id={user._id} />
                        {/* <StudentsRequestTable students={students}/> */}
                    </Grid>
                </Grid>
                <br/><br/>
                <Grid container justify="center">
                    <Grid item md={4} xs={4}>
                        <CoursesTable id={user._id} />
                        {/* <CoursesTableAdmin all_courses={all_courses}/> */}
                    </Grid>
                </Grid>
            </div> :
            <div>
                loading student
            </div>
    )

}
