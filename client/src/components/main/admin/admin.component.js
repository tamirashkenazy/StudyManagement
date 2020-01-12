import React, {useState } from 'react';
import AppBar from '@material-ui/core/AppBar';
import {useStyles} from '../navbar/appBarMenu.styles'
import AdminMenu from '../navbar/admin_menu.component'
import PeopleAltOutlinedIcon from '@material-ui/icons/PeopleAltOutlined';
import PieChartSharpIcon from '@material-ui/icons/PieChartSharp';
import AssignmentOutlinedIcon from '@material-ui/icons/AssignmentOutlined';
import PostAddIcon from '@material-ui/icons/PostAdd';
import {Dialog_generator} from '../utils/utils'
import Participants from './participants.component'
import AddCourse from './add_course.component'

// const getOpenedPopup = (is_participants, is_statistics, is_reports) => {
//     return(
//         { participants : is_participants, statistics : is_statistics,  reports : is_reports}
//     )
// }
const getOpenedPopup = (num_of_popup, total_popups) => {
    let true_false_by_index = {}
    let i;
    for (i=0; i < total_popups; i++){
        if (i===num_of_popup) {
            true_false_by_index[i] = true
        } else {
            true_false_by_index[i] = false
        }

    }
    return true_false_by_index
}

const closeAllPopups = (total_popups) => {
    let true_false_by_index = {}
    let i;
    for (i=0; i < total_popups; i++){
        true_false_by_index[i] = false
    }
    return true_false_by_index
}
export default function Admin(props) {
    const total_popups = 4
    const user = props.history.location.state
    const [openedPopups, setOpenedPopups] = useState(closeAllPopups(total_popups))
    const classes = useStyles();
    const navbar_operations_by_role = [
        { key : 'participants', header : 'משתתפים' , on_click : ()=>setOpenedPopups(getOpenedPopup(0,total_popups)) , icon : <PeopleAltOutlinedIcon fontSize="large" style={{color:"white"}} />},
        { key : 'statistics', header : 'סטטיסטיקות' , on_click : ()=>setOpenedPopups(getOpenedPopup(1,total_popups)) , icon : <PieChartSharpIcon fontSize="large" style={{color:"white"}} />},
        { key : 'reports', header : 'דוחות' , on_click : ()=>setOpenedPopups(getOpenedPopup(2,total_popups)) , icon : <AssignmentOutlinedIcon fontSize="large" style={{color:"white"}} />},
        { key : 'add_course', header : 'הוסף קורס' , on_click : ()=>setOpenedPopups(getOpenedPopup(3,total_popups)) , icon : <PostAddIcon fontSize="large" style={{color:"white"}} />}
      
    ]

    return (
        <div>
            <AppBar position="static" className={classes.AppBar} >
                <AdminMenu userDetails={user} navbar_operations_by_role={navbar_operations_by_role}/>
            </AppBar> 
            {Dialog_generator(openedPopups[0], ()=>setOpenedPopups(closeAllPopups(total_popups)), "משתתפים",{}, ()=>Participants())}
            {Dialog_generator(openedPopups[3], ()=>setOpenedPopups(closeAllPopups(total_popups)), "הוסף קורס",{}, ()=>AddCourse())}
        </div>

    )
}
