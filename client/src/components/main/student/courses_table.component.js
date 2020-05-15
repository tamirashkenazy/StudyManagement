import React from 'react';
import {useAsyncHook} from '../../mongo/paths.component'
// import { makeStyles } from '@material-ui/core/styles';
import GenericTable from '../utils/generic_table.component'
import { Typography } from '@material-ui/core';

const status_to_hebrew = {
    "waiting" : {text : "ממתין לאישור", color: "inherit"},
    "approved" : {text : "אושר", color: "primary"},
    "declined" : {text : "בקשה נדחתה", color: "default"}
}

const make_rows_of_courses_requests = (arr_of_student_courses_requests) => {
    if (arr_of_student_courses_requests && Array.isArray(arr_of_student_courses_requests) && arr_of_student_courses_requests.length > 0){
        let options = arr_of_student_courses_requests.map(course_obj => {
            let date = new Date(course_obj.updated_at)
            let date_str = date.getDate() + " / " + date.getMonth() + " / " + date.getFullYear()
            return (
                {
                    // key : course_obj._id,
                    "תאריך הבקשה" : <Typography variant="body1" style={{direction : "ltr"}}>{date_str}</Typography> ,
                    "שם הקורס" : course_obj.course_name,
                    "קוד הקורס" : course_obj.course_id,
                    "שעות מבוקשות" : course_obj.number_of_hours,
                    "סטטוס" : <Typography variant="body1" color={status_to_hebrew[course_obj.status].color}>{status_to_hebrew[course_obj.status].text}</Typography>
                }
            )
        })
        // console.log(options);
        return options
    }
}

// const useStyles = makeStyles({
//     table: {
//       direction : "rtl",

//     },
//     tableHead : {
//         backgroundColor : "#CCE5FF"
//     }
//   });


export default function CoursesTable(user_id) {
    const [table_rows, loading] = useAsyncHook(`students/${user_id}/requests`, make_rows_of_courses_requests);

    // const classes = useStyles();
    return (
        !loading && table_rows && 
        <GenericTable table_data={{data:table_rows, title:"קורסים"}}/>
    )
}