import React, {useState } from 'react';
import AppBar from '@material-ui/core/AppBar';
import {useStylesAppBar} from '../navbar/appBarMenu.styles'
import AdminMenu from '../navbar/admin_menu.component'
import PeopleAltOutlinedIcon from '@material-ui/icons/PeopleAltOutlined';
import PieChartSharpIcon from '@material-ui/icons/PieChartSharp';
import AssignmentOutlinedIcon from '@material-ui/icons/AssignmentOutlined';
import PostAddIcon from '@material-ui/icons/PostAdd';
import GroupAddOutlinedIcon from '@material-ui/icons/GroupAddOutlined';
import {Dialog_generator} from '../utils/utils'
import Participants from './participants.component'
import AddCourse from './add_course.component'
import AddGroup from './add_group.component'
import TeachersRequestTable from './teachers_req.component'
import StudentsRequestTable from './students_req.component'
import Grid from '@material-ui/core/Grid';
import {useAsyncHook} from '../../mongo/paths.component';
import {AnnualStatistics} from './annual_statistics'
import {Statistics} from './statistics.component'
import CoursesTableAdmin from './courses_table.component'
import GroupsTableAdmin from './groups_table.component'
import Reports from './reports.component'
import { Typography } from '@material-ui/core';

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
    const user = props.history.location.state
    const {teachers, students, users} = props
    const total_popups = 5
    const [openedPopups, setOpenedPopups] = useState(closeAllPopups(total_popups))
    const classes = useStylesAppBar();
    const navbar_operations_by_role = [
        { key : 'participants', header : 'משתתפים' , on_click : ()=>setOpenedPopups(getOpenedPopup(0,total_popups)) , icon : <PeopleAltOutlinedIcon fontSize="large" style={{color:"white"}} />},
        { key : 'statistics', header : 'סטטיסטיקות' , on_click : ()=>setOpenedPopups(getOpenedPopup(1,total_popups)) , icon : <PieChartSharpIcon fontSize="large" style={{color:"white"}} />},
        { key : 'reports', header : 'דוחות' , on_click : ()=>setOpenedPopups(getOpenedPopup(2,total_popups)) , icon : <AssignmentOutlinedIcon fontSize="large" style={{color:"white"}} />},
        { key : 'add_course', header : 'הוספת קורס' , on_click : ()=>setOpenedPopups(getOpenedPopup(3,total_popups)) , icon : <PostAddIcon fontSize="large" style={{color:"white"}} />},
        { key : 'add_group', header : 'הוספת קבוצה' , on_click : ()=>setOpenedPopups(getOpenedPopup(4,total_popups)) , icon : <GroupAddOutlinedIcon fontSize="large" style={{color:"white"}} />}
    ]
    const [sum_lessons, isLoading_sumLessons] = useAsyncHook(`lessons/paidMoney`)
    const [annual_budget, isLoading_budget] = useAsyncHook(`constants/annual_budget`)
    //assigned a value but never used  no-unused-vars
    const [lessons_pie, _] = useAsyncHook(`lessons/numOfLessonsByCourse`)
    const [students_pie, __] = useAsyncHook(`students/numOfStudentsByCourse`)
    const [teachers_pie, ___] = useAsyncHook(`teachers/numOfSTeachersByCourse`)
    const [all_courses, isLoadingCourses] = useAsyncHook(`courses`)
    const [all_groups, isLoadingGroups] = useAsyncHook(`groups`)
    const [lessons_done, isLoadingLessonsDone] = useAsyncHook(`lessons/byStatus/done`) // change it to get the only done statuses
    const [lesson_price_uni, isLoadingLessonPriceUni] = useAsyncHook(`constants/lesson_price`) 
    const [lesson_price_student, isLoadingLessonPriceStudent] = useAsyncHook(`constants/student_fee`) 


    const [selectedMonthYear, setMonthYear] = useState({month : new Date().getMonth()+1, year : new Date().getFullYear()})
    const [arr_teachers_from_db, isTeacherArrOfDone] = useAsyncHook(`lessons/teachersReport/${selectedMonthYear.year}/${selectedMonthYear.month}`) 
    const [arr_students_from_db, isStudentArrOfDone] = useAsyncHook(`lessons/studentsReport/${selectedMonthYear.year}/${selectedMonthYear.month}`) 
    return (
        <div  style={{textAlign : "center" , backgroundColor: "gainsboro"}}>
            
            <AppBar position="static" className={classes.AppBar} >
                <AdminMenu userDetails={user} navbar_operations_by_role={navbar_operations_by_role}/>
            </AppBar> 
            {Dialog_generator (openedPopups[0],()=>setOpenedPopups(closeAllPopups(total_popups)),"משתתפים", "people_outline" ,{users, teachers, students} ,(args)=>Participants(args))}
            {Dialog_generator (openedPopups[2],()=>setOpenedPopups(closeAllPopups(total_popups)),"דוחות", "assignment" ,{arr_teachers_from_db, arr_students_from_db, lessons_done, lesson_price_uni, lesson_price_student, selectedMonthYear, setMonthYear} ,(args)=>Reports(args))}
            {Dialog_generator(openedPopups[3], ()=>setOpenedPopups(closeAllPopups(total_popups)), "הוספת קורס","playlist_add",{}, ()=>AddCourse(), {maxWidth : "md"})}
            {Dialog_generator(openedPopups[1], ()=>setOpenedPopups(closeAllPopups(total_popups)), "סטטיסטיקות","pie_chart",{}, ()=> Statistics(lessons_pie, students_pie, teachers_pie), {maxWidth : "md", direction:"ltr"})}
            {Dialog_generator(openedPopups[4], ()=>setOpenedPopups(closeAllPopups(total_popups)), "הוספת קבוצה", "add_group",{}, ()=>AddGroup(), {maxWidth : "md"})}
            <br></br>
                <Typography variant="h3" align="center">ברוכים הבאים למסך המנהל</Typography>
            <br></br>   
            <Grid container spacing={10} justify="space-around" direction="row-reverse" >
                <Grid item md={5} xs={4} style={{marginRight: "1rem"}} >
                    <TeachersRequestTable teachers={teachers} />
                </Grid>
                <Grid item md={5} xs={4} style={{ marginLeft: "1rem" }}>
                    <StudentsRequestTable students={students}/>
                </Grid>
            </Grid>
            <br/><br/>
            <Grid container spacing={10} justify="space-around" direction="row-reverse">
                {!isLoadingCourses && <Grid item md={4} xs={4} style={{marginRight: "1rem" }}>
                    <CoursesTableAdmin all_courses={all_courses}/>
                </Grid>}
                {!isLoadingGroups && <Grid item md={6} xs={4} style={{ marginLeft: "1rem" }}>
                    <GroupsTableAdmin all_groups={all_groups} users={users} students={students}/>
                </Grid>}
            </Grid>
            <br/><br/>
            <Grid container justify="center">
                <Grid item xs={8} >
                { (!isLoading_sumLessons && !isLoading_budget) ? 
                        <AnnualStatistics annual_budget={annual_budget} sum_lessons={sum_lessons}/>
                         : <div>not finished</div>}
                </Grid>
            </Grid>
        </div>

    )
}
