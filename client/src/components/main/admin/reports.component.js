import React from 'react'
import Grid from '@material-ui/core/Grid';
import { Typography, Button } from '@material-ui/core';
import GenericTable from '../utils/generic_table.component'
import axios from "axios"
import {Dropdown} from 'semantic-ui-react'
import get_mongo_api from '../../mongo/paths.component'

const httpPostRequestToXslxFile = (arr_of_teachers, arr_of_students, year, month) => {
    let post_msg = {studentsReport : arr_of_students, teachersReport : arr_of_teachers}
    console.log(post_msg);
    let url = get_mongo_api(`constants/exportToExcel/${year}/${month}`)
    axios.post(url, post_msg).then(res=>{
        if (res.data.success) {
            alert(res.data.message) // excel was ok
        } else {
            alert(res.data.message) // couldnt export to excel
        }
    })
}

const make_arr_for_payements = (arr) => {
    if (arr && Array.isArray(arr) && arr.length > 0) {
        return arr.map(details_of_teacher=>{
            return ({
                "תז" : details_of_teacher.id,
                "שם" : details_of_teacher.name,
                "מס׳ שיעורים" : details_of_teacher.number_of_lessons,
                "סכום כולל": details_of_teacher.amount + "שח"
            })
        })
    } else {
        return [{"אין נתונים" : ""}]
    }

}

const make_drop_down_months_options = () => {
    let curr_year = new Date().getFullYear()
    let options_for_month = []

    for (let i = curr_year; i>= curr_year-1; i--){
        let max_month = new Date().getMonth()+1
        if (i == curr_year) {
            for (let j = max_month; j>=1; j--) {
                options_for_month.push({
                    key : `${i}-${j}`,
                    value : `${i}-${j}`,
                    text : `${i} - ${month_to_words[j]}`
                })
            }
        } else {
            for (let j = 12; j>=1; j--) {
                options_for_month.push({
                    key : `${i}-${j}`,
                    value : `${i}-${j}`,
                    text : `${month_to_words[j]} ${i}`
                })
            }
        }
    }
    return options_for_month
}

const month_to_words = {"1" : "ינואר", "2" : "פברואר", "3" : "מרץ", "4" : "אפריל", "5" : "מאי", "6" : "יוני","7" : "יולי", "8" : "אוגוסט", "9" : "ספטמבר", "10" : "אוקטובר", "11" : "נובמבר", "12" : "דצמבר"}


export default function Reports({arr_teachers_from_db, arr_students_from_db, lessons_done, lesson_price_uni, lesson_price_student, selectedMonthYear, setMonthYear}){
    let years_months = make_drop_down_months_options()
    let arr_teachers = make_arr_for_payements(arr_teachers_from_db)
    let arr_students = make_arr_for_payements(arr_students_from_db)
    let num_of_lessons_done = null
    if (lessons_done && lessons_done.data && lessons_done.data.success) {
        num_of_lessons_done = lessons_done.data.count
    }

    const changeMonthYear = (value) => {
        let [year,month] = value.split("-")
        setMonthYear({year, month})
    }

    return (
        <>  
            
            <Grid container justify="center"> 
                <Grid item md={5} xs={4} >
                    {num_of_lessons_done &&
                    <Typography variant="h5" style={{margin : "0.8vh 0 0.8vh 0"}}>כמות שיעורים שבוצעו: {num_of_lessons_done}</Typography>}
                    <Typography variant="h5" style={{margin : "0.8vh 0 0.8vh 0"}}>מחיר שיעור עבור מחלקה: {lesson_price_uni} ש״ח</Typography>
                    <Typography variant="h5" style={{margin : "0.8vh 0 0.8vh 0"}}>מחיר שיעור עבור סטודנט: {lesson_price_student} ש״ח</Typography>
                </Grid>
            </Grid>
            <br></br>
            
            <Grid container justify="center"> 
                <Grid item md={5} xs={4} >
                    <Typography variant="h5" >נתונים עבור:  {month_to_words[selectedMonthYear.month]} {selectedMonthYear.year}</Typography>
                    <Dropdown direction="right"  placeholder='חודש ושנה' options={years_months} scrolling search selection onChange={(e,{value})=> changeMonthYear(value)} defaultValue={years_months[0].value}></Dropdown>
                </Grid>
            </Grid>
            
            <Grid container justify="space-around"> 
                <Grid item md={5} xs={4} >
                    <GenericTable table_data={{data : arr_teachers, title:"מורים"}}></GenericTable>
                </Grid>
                <Grid item md={5} xs={4} >
                    <GenericTable table_data={{data : arr_students, title:"תלמידים"}}></GenericTable>
                </Grid>
            </Grid>
            <br></br>
            <Grid container justify="space-around" direction="row-reverse" > 
                <Grid item md={5} xs={4} >
                    <Button color="primary" variant="outlined" onClick={()=>httpPostRequestToXslxFile(arr_teachers_from_db, arr_students_from_db, selectedMonthYear.year, selectedMonthYear.month)}>יצא לאקסל</Button>
                </Grid>
            </Grid>
        </> 
    )
}