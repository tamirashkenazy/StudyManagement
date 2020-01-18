import React, { useState } from 'react';
import AppBar from '@material-ui/core/AppBar';
import { useStylesAppBar } from '../navbar/appBarMenu.styles'
import AccountMenu from '../navbar/navbar.component'
import AssignmentTurnedInOutlinedIcon from '@material-ui/icons/AssignmentTurnedInOutlined';
import ScheduleOutlinedIcon from '@material-ui/icons/ScheduleOutlined';
import '../../../styles/students.scss';
import RequestHours from './request_hours.component'
import CoursesTable from './courses_table.component'
import { Dialog_generator } from '../utils/utils'
const getOpenedPopup = (is_open_request_hours, is_open_book_class) => {
    return (
        { request_hours_popup: is_open_request_hours, book_class_popup: is_open_book_class }
    )
}

export default function Student(props) {
    const user = props.history.location.state
    const [openedPopups, setOpenedPopups] = useState(getOpenedPopup(false, false))

    const navbar_operations_by_role = [
        { key: 'request_tutoring', header: 'בקשת שעות חונכות', on_click: () => setOpenedPopups(Object.assign({}, getOpenedPopup(true, false))), icon: <ScheduleOutlinedIcon fontSize="large" style={{ color: "white" }} /> },
        { key: 'book_class', header: 'קביעת שיעור', on_click: () => { console.log("book_class") }, icon: <AssignmentTurnedInOutlinedIcon fontSize="large" style={{ color: "white" }} /> }
    ]
    const classes = useStylesAppBar();

    return (
        <div className="student">

            <AppBar position="static" className={classes.AppBar} >
                <AccountMenu userDetails={user} next_role='teacher' navbar_operations_by_role={navbar_operations_by_role} props={{ formSubmitButtonName: "עדכן פרטים" }} />
            </AppBar>

            {Dialog_generator(openedPopups.request_hours_popup, () => setOpenedPopups(Object.assign({}, getOpenedPopup(false, false))), "בקשת שעות חונכות", { _id: user._id }, (id) => RequestHours(id))}
            <div className="content" >
                <div className="topDiv">
                    <div className="rightDiv">
                        דיב2
                    </div>
                    <div className="leftDiv">
                        דיב1
                    </div>
                    <div className="bottomDiv">
                        {CoursesTable(user._id)}
                    </div>
                </div>
            </div>
        </div>
    )

}