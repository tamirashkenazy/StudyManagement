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

        // <TableContainer component={Paper}>
        //     <Table className={classes.table} aria-label="simple table">
        //         <TableHead className={classes.tableHead}>
        //             <TableRow>
        //                 <TableCell align="right">תאריך</TableCell>
        //                 <TableCell align="right">מזהה קורס</TableCell>
        //                 <TableCell align="right">מספר שעות</TableCell>
        //                 <TableCell align="right">סטטוס</TableCell>
        //             </TableRow>
        //         </TableHead>
        //         <TableBody>
        //         {table_rows.map(row => {
        //             let date = dateFormat(row.date, "dd/mm/yyyy") 
        //             return (
        //                 <TableRow key={row.key}>
        //                     <TableCell align="right">{date}</TableCell>
        //                     <TableCell component="th" scope="row" align="right">{row.course_id}</TableCell>
        //                     <TableCell align="right">{row.hours}</TableCell>
        //                     <TableCell align="right" style={{color:english_to_hebrew_status[row.status].color}}>{english_to_hebrew_status[row.status].text}</TableCell>
        //                 </TableRow>
        //             )
        //         })}
        //         </TableBody>
        //     </Table>
        // </TableContainer>
    )
}