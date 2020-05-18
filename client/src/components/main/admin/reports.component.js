import React from 'react'
import Grid from '@material-ui/core/Grid';
import { Typography, Button } from '@material-ui/core';
import GenericTable from '../utils/generic_table.component'
import axios from "axios"

const httpPostRequestToXslxFile = (arr_of_teachers, arr_of_students, num_of_lessons_done, lesson_price_uni, lesson_price_student) => {
    let post_msg = {arr_of_students, arr_of_teachers, num_of_lessons_done, lesson_price_uni, lesson_price_student}
    let url = ""
    axios.post(url, post_msg).then(res=>{
        if (res.data.success) {
            alert(res.data.message) // excel was ok
        } else {
            alert(res.data.message) // couldnt export to excel
        }
    })
}

const make_arr_for_payements = (arr, money_per_lesson) => {
    if (arr && Array.isArray(arr) && arr.length > 0) {

    } else {
        return [{"אין נתונים" : ""}]
    }

}

export default function Reports({arr_teachers_from_db, arr_students_from_db, num_of_lessons_done, lesson_price_uni, lesson_price_student}){
    let arr_teachers = make_arr_for_payements(arr_teachers_from_db, lesson_price_uni)
    let arr_students = make_arr_for_payements(arr_students_from_db, lesson_price_student)
    return (
        <>
            <Grid container justify="center"> 
                <Grid item md={5} xs={4} >
                    <Typography variant="h5" style={{margin : "0.8vh 0 0.8vh 0"}}>כמות שיעורים שבוצעו: {num_of_lessons_done}</Typography>
                    <Typography variant="h5" style={{margin : "0.8vh 0 0.8vh 0"}}>מחיר שיעור עבור מחלקה: {lesson_price_uni} ש״ח</Typography>
                    <Typography variant="h5" style={{margin : "0.8vh 0 0.8vh 0"}}>מחיר שיעור עבור סטודנט: {lesson_price_student} ש״ח</Typography>
                </Grid>
            </Grid>
            <Grid container justify="space-around" direction="row-reverse" > 
                <Grid item md={5} xs={4} >
                    <GenericTable table_data={{data : [{"אין מורים עדיין" : ""}], title:"מורים"}}></GenericTable>
                </Grid>
                <Grid item md={5} xs={4} >
                    <GenericTable table_data={{data : [{"אין תלמידים עדיין" : ""}], title:"תלמידים"}}></GenericTable>
                </Grid>
            </Grid>
            <br></br>
            <Grid container justify="space-around" direction="row-reverse" > 
                <Grid item md={5} xs={4} >
                    <Button color="primary" variant="outlined" onClick={()=>httpPostRequestToXslxFile(arr_teachers, arr_students, num_of_lessons_done, lesson_price_uni, lesson_price_student)}>יצא לאקסל</Button>
                </Grid>
            </Grid>
        </> 
    )
}