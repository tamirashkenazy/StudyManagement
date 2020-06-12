import React, { useState } from 'react';
import AppBar from '@material-ui/core/AppBar';
import { useStylesAppBar } from '../navbar/appBarMenu.styles'
import AccountMenu from '../navbar/navbar.component'
import EventAvailableOutlinedIcon from '@material-ui/icons/EventAvailableOutlined';
import ImportContactsSharpIcon from '@material-ui/icons/ImportContactsSharp';
import AssignmentOutlinedIcon from '@material-ui/icons/AssignmentOutlined';
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import CoursesToTeach from './navbar_items/courses_teaching.component'
import UploadGradesSheet from './navbar_items/teacher_grades_sheet.component'
import UpdateAvailability from './navbar_items/update_availability.component'
import { Dialog_generator, getOpenedPopup, closeAllPopups } from '../utils/utils'
import TeachersStatusRequestsTable from './tables/requests_status.component'
import LessonsTable from './tables/lessons_table.component'
import ProgressBar from './progress_bar.component'
import '../../../styles/teachers.scss';
import { Typography } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import {SendMessage } from '../utils/messages.component'
import UserCard from '../utils/card.component'
import {useAsyncHook} from '../../mongo/paths.component';


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
    const total_popups = 4
    const [openedPopups, setOpenedPopups] = useState(closeAllPopups(total_popups))
    const [isCardOpen, setCardOpen] = useState(false);
    const [userStudent, setUserStudent] = useState(null);
    const [student, setStudent] = useState(null);

    const navbar_operations_by_role = [
        { key: 'update_availability', header: 'עדכון זמינות', on_click: () => setOpenedPopups(getOpenedPopup(1, total_popups)), icon: <EventAvailableOutlinedIcon fontSize="large" style={{ color: "white" }} /> },
        { key: 'courses_to_teach', header: 'בחירת קורסים להוראה', on_click: () => setOpenedPopups(getOpenedPopup(0, total_popups)), icon: <ImportContactsSharpIcon fontSize="large" style={{ color: "white" }} /> },
        { key: 'upload_grades_sheet', header: 'העלאת גיליון ציונים', on_click: () => setOpenedPopups(getOpenedPopup(2, total_popups)), icon: <AssignmentOutlinedIcon fontSize="large" style={{ color: "white" }} /> },
        { key: 'send_message', header: 'הודעות', on_click: () => setOpenedPopups(getOpenedPopup(3, total_popups)), icon: <MailOutlineIcon fontSize="large" style={{ color: "white" }} /> }
    ]
    const close_all = () => setOpenedPopups(closeAllPopups(total_popups))

    const classes = useStylesAppBar();
    let teacher = filter_teacher_by_id(teachers, user._id)
    const [lessons, loading] = useAsyncHook(`lessons/byTeacherId/${user._id}`);

    return (
        teacher ?
            <div>
                <AppBar position="static" className={classes.AppBar} >
                    <AccountMenu userDetails={user} next_role='student' navbar_operations_by_role={navbar_operations_by_role} props={{ formSubmitButtonName: "עדכן פרטים" }} />
                </AppBar>
                {Dialog_generator(openedPopups[0], close_all, "בחירת קורסים להוראה","menu_book", { id: user._id, teacher }, (args) => CoursesToTeach(args), {height : "50vh"})}
                {Dialog_generator(openedPopups[2], close_all, "העלאת גיליון ציונים","assignment", { id: user._id, close_popup : close_all }, (args) => UploadGradesSheet(args))}
                {Dialog_generator(openedPopups[1], close_all, "עדכון זמינות","date_range", { id: user._id, lessons: loading? null : lessons}, (args) => UpdateAvailability(args))}
                {Dialog_generator(openedPopups[3], close_all, "הודעות","mail_outline", { user, close_popup : close_all }, (args) => SendMessage(args))}
                {Dialog_generator(isCardOpen, () => setCardOpen(false), null, null, null, () => <UserCard user={userStudent} student={student}></UserCard>, "card")}

                <br></br>
                    <Typography variant="h3" align="center" >מידע אישי למורה</Typography>
                <br></br>   
                <Grid container justify="space-around" direction="row-reverse"  >
                    <Grid item md={4} xs={4}  style={{  marginRight : "1rem"}}>
                        <TeachersStatusRequestsTable teaching_requests={teacher.teaching_requests} />
                    </Grid>
                    <Grid item md={6} xs={4} style={{ marginLeft : "1rem"}}>
                        <LessonsTable id={user._id} setCardOpen={setCardOpen} setUser={setUserStudent} setStudent={setStudent} lessons={ loading? null : lessons}/>
                    </Grid>
                </Grid>
                <br/><br/>
                <Grid container justify="center" >
                    <Grid item md={8} xs={4} >
                        <ProgressBar id={user._id} />
                    </Grid>
                </Grid>
                
            </div>
            : <div>
                loading teacher
        </div>

    )
}
