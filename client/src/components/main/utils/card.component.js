import React from 'react'
import {useAsyncHook} from '../../mongo/paths.component'
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

const useStyles = makeStyles({
    card: {
      minWidth: "000px",
    },
    tableCell : {
      textAlign : "center",
      direction : "ltr"
    },
    tableCellHeader : {
      textAlign : "center",
      // direction : "rtl",
      backgroundColor : "#000066",
      color : "white",
    }
  });
  

const student_courses_func = (student_obj)=>{
  if (student_obj) {
    let courses_arr = student_obj.requests.filter(course_req => course_req.status === "approved")
    if (courses_arr && courses_arr.length>0) {
      // console.log(courses_arr.length);
      return courses_arr.join(", ")
    } else {
      return "אין קורסים מאושרים"
    }
  } else {
    return null
  }
}

const teacher_courses_func = (teacher_obj)=>{
  if (teacher_obj) {
    let teaching_courses = teacher_obj.teaching_courses
    let teacher_courses_arr = []
    if (teaching_courses && teaching_courses.length>0) {
      teaching_courses.forEach(course_obj=> teacher_courses_arr.push(course_obj.course_name))
      return teacher_courses_arr.join(", ")
    } else {
      return "המורה לא מלמד קורסים"
    }
  } else {
    return null
  }
}
export default function UserCard({user_id}) {
    const [user, loading] = useAsyncHook(`users/${user_id}`, null);
    const [student_courses, loading_student_courses] = useAsyncHook(`students/${user_id}`, student_courses_func);
    const [teacher_courses, loading_teacher_courses] = useAsyncHook(`teachers/${user_id}`, teacher_courses_func);
    const full_name = `${user.first_name} ${user.last_name}`
    const classes = useStyles();
    let roles = "אין תפקיד"
    if (user.isStudent && user.isTeacher) {
      roles = "מורה, תלמיד"
    } else if (user.isStudent) {
      roles = "מורה"
    } else if (user.isTeacher) {
      roles = "תלמיד"
    }
    return (
        !loading && !loading_student_courses && !loading_teacher_courses &&
        <Card className={classes.card}>
            <CardContent>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow >
                      <TableCell className={classes.tableCellHeader} colSpan={2}>{full_name}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell className={classes.tableCell}>ת.ז  </TableCell>
                      <TableCell className={classes.tableCell}>{user._id}  </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className={classes.tableCell}> טלפון </TableCell>
                      <TableCell className={classes.tableCell}> {user.tel_number}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className={classes.tableCell}> מייל </TableCell>
                      <TableCell className={classes.tableCell}> {user.email}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className={classes.tableCell}> תפקיד</TableCell>
                      <TableCell className={classes.tableCell}>{roles}</TableCell>
                    </TableRow>
                    {user.isStudent &&  <TableRow>
                      <TableCell className={classes.tableCell}>קורסים שלומד</TableCell>
                      <TableCell className={classes.tableCell}>{student_courses} </TableCell>
                    </TableRow>}
                    {user.isTeacher && <TableRow>
                      <TableCell className={classes.tableCell}>קורסים שמלמד</TableCell>
                      <TableCell className={classes.tableCell}>{teacher_courses} </TableCell>
                    </TableRow>}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
        </Card>
    );
}