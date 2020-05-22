import React, {useState } from 'react';
import AppBar from '@material-ui/core/AppBar';
import {useStylesAppBar} from '../navbar/appBarMenu.styles'
import AdminMenu from '../navbar/admin_menu.component'
import PeopleAltOutlinedIcon from '@material-ui/icons/PeopleAltOutlined';
import PieChartSharpIcon from '@material-ui/icons/PieChartSharp';
import AssignmentOutlinedIcon from '@material-ui/icons/AssignmentOutlined';
import PostAddIcon from '@material-ui/icons/PostAdd';
import GroupAddOutlinedIcon from '@material-ui/icons/GroupAddOutlined';
import {Dialog_generator, getOpenedPopup, closeAllPopups} from '../utils/utils'
import Participants from './navbar_items/participants.component'
import AddCourse from './navbar_items/add_course.component'
import AddGroup from './navbar_items/add_group.component'
import TeachersRequestTable from './tables/teachers_req.component'
import StudentsRequestTable from './tables/students_req.component'
import Grid from '@material-ui/core/Grid';
import {useAsyncHook} from '../../mongo/paths.component';
import {AnnualStatistics} from './annual_statistics'
import {Statistics} from './navbar_items/statistics.component'
import CoursesTableAdmin from './tables/courses_table.component'
import GroupsTableAdmin from './tables/groups_table.component'
import Reports from './navbar_items/reports.component'
import { Typography } from '@material-ui/core';

import '../../../styles/grids.scss'



const GetAllStatisticsFromDB = () => {
    const lessons_pie = useAsyncHook(`lessons/numOfLessonsByCourse`, null, null, false)
    const students_pie = useAsyncHook(`students/numOfStudentsByCourse`, null, null, false)
    const teachers_pie = useAsyncHook(`teachers/numOfSTeachersByCourse`, null, null, false)
    return {lessons_pie, students_pie, teachers_pie}
}
const GetAllReportsDataFromDB = (selectedMonthYear) => {
    const lessons_done = useAsyncHook(`lessons/byStatus/done`, null, null, false)
    const lesson_price_uni = useAsyncHook(`constants/lesson_price`, null, null, false) 
    const lesson_price_student = useAsyncHook(`constants/student_fee`, null, null, false) 
    const  arr_teachers_from_db= useAsyncHook(`lessons/teachersReport/${selectedMonthYear.year}/${selectedMonthYear.month}`, null, null, false) 
    const  arr_students_from_db= useAsyncHook(`lessons/studentsReport/${selectedMonthYear.year}/${selectedMonthYear.month}`, null, null, false) 
    return {lessons_done, lesson_price_uni, lesson_price_student, arr_teachers_from_db, arr_students_from_db}
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
    const [all_courses, isLoadingCourses] = useAsyncHook(`courses`)
    const [all_groups, isLoadingGroups] = useAsyncHook(`groups`)
    let {lessons_pie, students_pie, teachers_pie} = GetAllStatisticsFromDB()
    const [selectedMonthYear, setMonthYear] = useState({month : new Date().getMonth()+1, year : new Date().getFullYear()})
    let {lessons_done, lesson_price_uni, lesson_price_student, arr_teachers_from_db, arr_students_from_db} = GetAllReportsDataFromDB(selectedMonthYear)

    return (
        <div  style={{textAlign : "center" }}>
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
            
            <Grid container justify="space-around" direction="row-reverse">  
                <Grid item md={5} xs={4}>
                    <TeachersRequestTable teachers={teachers} />
                </Grid>
                <Grid item md={5} xs={4} style={{ marginLeft: "1rem" }}>
                    <StudentsRequestTable students={students}/>
                </Grid>
            </Grid>
            <br/><br/>
            <Grid container justify="space-around" direction="row-reverse">
                {!isLoadingCourses && <Grid item md={5} xs={4} style={{marginRight: "1rem" }}>
                    <CoursesTableAdmin all_courses={all_courses}/>
                </Grid>}
                {!isLoadingGroups && <Grid item md={5} xs={4} style={{ marginLeft: "1rem" }}>
                    <GroupsTableAdmin all_groups={all_groups} users={users} students={students}/>
                </Grid>}
            </Grid>
            <br/><br/>
            <Grid container justify="center">
                <Grid item xs={8} >
                {!isLoading_sumLessons && !isLoading_budget && 
                        <AnnualStatistics annual_budget={annual_budget} sum_lessons={sum_lessons}/>}
                </Grid>
            </Grid>
        </div>

    )
}
