import React, { useState } from 'react';
import AppBar from '@material-ui/core/AppBar';
import { useStylesAppBar } from '../navbar/appBarMenu.styles'
import AccountMenu from '../navbar/navbar.component'
import AssignmentTurnedInOutlinedIcon from '@material-ui/icons/AssignmentTurnedInOutlined';
import ScheduleOutlinedIcon from '@material-ui/icons/ScheduleOutlined';
import '../../../styles/students.scss';
import RequestHours from './navbar_items//request_hours_table.component'
import BookHours from './navbar_items/book_hours.component'
import History from './history.component'
import CoursesTable from './tables/courses_table.component'
import LessonsTable from './tables/lessons_table.component'
import TrackHoursTable from './tables/track_hours_table.component'
import { Dialog_generator, getOpenedPopup, closeAllPopups } from '../utils/utils'
import Grid from '@material-ui/core/Grid';
import { Typography } from '@material-ui/core';
import { SendMessage } from '../utils/messages.component';
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import UserCard from '../utils/card.component'
import { useAsyncHook } from '../../mongo/paths.component';

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
    const [selectedCourseID, setSelectedCourse] = useState(null)
    const [hours_options, setHoursOptions] = useState(null)
    const total_popups = 4
    const [openedPopups, setOpenedPopups] = useState(closeAllPopups(total_popups))
    const [isCardOpen, setCardOpen] = useState(false);
    const [userTeacher, setUserTeacher] = useState(null);
    const [teacher, setTeacher] = useState(null);
    const navbar_operations_by_role = [
        { key: 'request_tutoring', header: 'בקשת שעות חונכות', on_click: () => setOpenedPopups(getOpenedPopup(0, total_popups)), icon: <ScheduleOutlinedIcon fontSize="large" style={{ color: "white" }} /> },
        { key: 'book_class', header: 'קביעת שעת חונכות', on_click: () => setOpenedPopups(getOpenedPopup(1, total_popups)), icon: <AssignmentTurnedInOutlinedIcon fontSize="large" style={{ color: "white" }} /> },
        { key: 'send_message', header: 'הודעות', on_click: () => setOpenedPopups(getOpenedPopup(3, total_popups)), icon: <MailOutlineIcon fontSize="large" style={{ color: "white" }} /> }
    ]
    const classes = useStylesAppBar();
    const student = filter_student_by_id(students, user._id)
    const [lessons, loading] = useAsyncHook(`lessons/byStudentId/${user._id}`);
    return (
        student ?
            <div>
                <AppBar position="static" className={classes.AppBar} >
                    <AccountMenu userDetails={user} next_role='teacher' navbar_operations_by_role={navbar_operations_by_role} props={{ formSubmitButtonName: "עדכן פרטים" }} />
                </AppBar>
                {Dialog_generator(openedPopups[0], () => setOpenedPopups(closeAllPopups(total_popups)), " בקשת שעות חונכות", "access_time", { id: user._id, number_of_approved_hours: student.group.approved_hours }, (args) => RequestHours(args))}
                {Dialog_generator(openedPopups[1], () => setOpenedPopups(closeAllPopups(total_popups)), "קביעת שעות חונכות", "assignment_turned_in", { _id: user._id, selectedCourseID, setSelectedCourse, hours_options, setHoursOptions, student,lessons: loading ? null : lessons }, (args) => BookHours(args))}
                {Dialog_generator(openedPopups[2], () => { setSelectedCourse(null); setOpenedPopups(closeAllPopups(total_popups)) }, null, null, { _id: user._id, courseID: selectedCourseID, setCardOpen, setUser: setUserTeacher, setTeacher }, (args) => History(args))},
                {Dialog_generator(openedPopups[3], () => setOpenedPopups(closeAllPopups(total_popups)), "הודעות", "mail_outline", { user: user, close_popup: () => setOpenedPopups(closeAllPopups(total_popups)) }, (args) => SendMessage(args))}
                {Dialog_generator(isCardOpen, () => setCardOpen(false), null, null, null, () => <UserCard user={userTeacher} teacher={teacher} opened_from_student={true} ></UserCard>, "card")}

                <br></br>
                <Typography variant="h3" align="center" >מידע אישי לתלמיד</Typography>
                <br></br>
                <Grid container spacing={10} justify="space-around" direction="row-reverse" >
                    <Grid item md={5} xs={4} style={{ marginRight: "1rem" }}>
                        <TrackHoursTable id={user._id} student={student} openedPopups={openedPopups} setOpenedPopups={setOpenedPopups} setSelectedCourse={setSelectedCourse} getOpenedPopup={getOpenedPopup} />
                    </Grid>
                    <Grid item md={5} xs={4} style={{ marginLeft: "1rem" }}>
                        <LessonsTable setCardOpen={setCardOpen} setUser={setUserTeacher} setTeacher={setTeacher} lessons={loading ? null : lessons}   />
                    </Grid>
                </Grid>
                <br /><br />
                <Grid container justify="center">
                    <Grid item md={7} xs={4}>
                        <CoursesTable id={user._id} />
                    </Grid>
                </Grid>
            </div> :
            <div>
                loading student
            </div>
    )

}
