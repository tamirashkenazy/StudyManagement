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

const APPROVED =  "approved"
const useStyles = makeStyles({
    tableCell : {
      textAlign : "center",
      direction : "ltr",
      fontSize : "1.4rem"
    },
    tableCellHeader : {
      textAlign : "center",
      backgroundColor : "#000066",
      color : "white",
      fontSize : "1.4rem"
    }
  });
  
const get_teacher_courses = (teacher) => {
  let approved_courses = teacher.teaching_requests.filter(course => course.status === APPROVED)
  if (Array.isArray(approved_courses) && approved_courses.length > 0) {
    return  (approved_courses.map(course=>course.course_name)).join(", ")
  } else {
    return "לא אושרו קורסים עבור המורה"
  }
}

const get_student_courses = (student) => {
  let approved_courses = student.requests.filter(course => course.status === APPROVED)
  if (Array.isArray(approved_courses) && approved_courses.length > 0) {
    return  (approved_courses.map(course=>course.course_name)).join(", ")
  } else {
    return "לא אושרו קורסים עבור התלמיד"
  }
}

export default function UserCard({user, teacher, student}) {
    let curr_user = {id : user._id, roles : "אין תפקיד"}
    const full_name = `${user.first_name} ${user.last_name}`
    const classes = useStyles();
    if (user.isStudent && user.isTeacher && student && teacher) {
      curr_user.roles = "מורה, תלמיד"
    } else if (user.isTeacher && teacher) {
      curr_user.roles = "מורה"
      curr_user.teacher_courses = get_teacher_courses(teacher)
    } else if (user.isStudent && student) {
      curr_user.roles = "תלמיד"
      curr_user.student_courses = get_student_courses(student)
    }
    return (
      <Card >
          <CardContent>
            <TableContainer>
              <Table size="small">
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
                    <TableCell className={classes.tableCell}>{curr_user.roles}</TableCell>
                  </TableRow>
                  {(user.isStudent && student) && <TableRow>
                    <TableCell className={classes.tableCell}>קורסים שלומד</TableCell>
                    <TableCell className={classes.tableCell}>{curr_user.student_courses} </TableCell>
                  </TableRow>}
                  {(user.isTeacher && teacher) && <TableRow>
                    <TableCell className={classes.tableCell}>קורסים שמלמד</TableCell>
                    <TableCell className={classes.tableCell}>{curr_user.teacher_courses} </TableCell>
                  </TableRow>}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
      </Card>
    );
}