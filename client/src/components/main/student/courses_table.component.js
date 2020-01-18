import React from 'react';
import {useAsyncHook} from '../../mongo/paths.component'
import { makeStyles } from '@material-ui/core/styles';
import GenericTable from '../utils/generic_table.component'

var dateFormat = require('dateformat');

const make_rows_of_courses_requests = (arr_of_student_courses_requests) => {

    if (arr_of_student_courses_requests && arr_of_student_courses_requests.length > 0){
        console.log(arr_of_student_courses_requests);
        let options = arr_of_student_courses_requests.map(course_obj => {
            return (
                {
                    key : course_obj._id,
                    date : course_obj.updated_at,
                    course_name : course_obj.course_name,
                    course_id : course_obj.course_id,
                    hours : course_obj.number_of_hours,
                    status : course_obj.status
                }
            )
        })
        console.log(options);
        return options
    }
}

const useStyles = makeStyles({
    table: {
      direction : "rtl",

    },
    tableHead : {
        backgroundColor : "#CCE5FF"
    }
  });


const english_to_hebrew_status = {"waiting" : {text : "ממתין לאישור", color:"red"}, "should_pay" : {text : "ממתין לתשלום", color:"#990099"}, "approved" : {text : "בקשה מאושרת", color:"green"}}

export default function CoursesTable(user_id) {
    const [table_rows, loading] = useAsyncHook(`students/${user_id}/request`, make_rows_of_courses_requests);

    const classes = useStyles();
    return (
        !loading && table_rows && 
        <GenericTable table_data={{data:table_rows, title:"קורסים"}}/>
    )
}