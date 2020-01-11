import React, {useState } from 'react';
import AppBar from '@material-ui/core/AppBar';
import {useStyles} from '../navbar/appBarMenu.styles'
import AdminMenu from '../navbar/admin_menu.component'
import PeopleAltOutlinedIcon from '@material-ui/icons/PeopleAltOutlined';
import PieChartSharpIcon from '@material-ui/icons/PieChartSharp';
import AssignmentOutlinedIcon from '@material-ui/icons/AssignmentOutlined';
import {Dialog_generator} from '../utils/utils'
import Participants from './participants.component'
const getOpenedPopup = (is_participants, is_statistics, is_reports) => {
    return(
        { participants : is_participants, statistics : is_statistics,  reports : is_reports}
    )
}

export default function Admin(props) {
    const user = props.history.location.state
    const [openedPopups, setOpenedPopups] = useState(getOpenedPopup(false, false, false))
    const classes = useStyles();

    const navbar_operations_by_role = [
        { key : 'participants', header : 'משתתפים' , on_click : ()=>setOpenedPopups(Object.assign({},getOpenedPopup(true, false, false))) , icon : <PeopleAltOutlinedIcon fontSize="large" style={{color:"white"}} />},
        { key : 'statistics', header : 'סטטיסטיקות' , on_click : ()=>setOpenedPopups(Object.assign({},getOpenedPopup(false, true, false))) , icon : <PieChartSharpIcon fontSize="large" style={{color:"white"}} />},
        { key : 'reports', header : 'דוחות' , on_click : ()=>setOpenedPopups(Object.assign({},getOpenedPopup(false, false, true))) , icon : <AssignmentOutlinedIcon fontSize="large" style={{color:"white"}} />}
      
    ]

    return (
        <div>
            <AppBar position="static" className={classes.AppBar} >
                <AdminMenu userDetails={user} navbar_operations_by_role={navbar_operations_by_role}/>
            </AppBar> 
            {Dialog_generator(openedPopups.participants, ()=>setOpenedPopups(Object.assign({},getOpenedPopup(false, false, false))), "משתתפים",{_id:user._id}, ()=>Participants())}
        </div>

    )
}
