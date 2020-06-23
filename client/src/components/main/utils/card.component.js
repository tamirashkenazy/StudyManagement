import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { Card, Icon, Image } from 'semantic-ui-react'
// import CardContent from '@material-ui/core/CardContent';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
// import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import male_image from '../../../images/user_card_images/male.jpeg'
import female_image from '../../../images/user_card_images/female.jpeg'

const APPROVED = "approved"
const useStyles = makeStyles({
  header: {
    fontFamily: "Heebo !important",
  },
  tableCell: {
    textAlign: "right",
    border: "none",
    display: "table-cell",
    padding: "6px 0px 6px 0px",
  },
  tableCellHeader: {
    textAlign: "center",
    backgroundColor: "#000066",
    color: "white",
    fontSize: "1.4rem"
  },
  meta: {
    direction : "ltr",
    display: "grid"
  }
});

const get_teacher_courses = (teacher) => {
  let approved_courses = teacher.teaching_requests.filter(course => course.status === APPROVED)
  if (Array.isArray(approved_courses) && approved_courses.length > 0) {
    return (approved_courses.map(course => course.course_name)).join(", ")
  } else {
    return "לא אושרו קורסים עבור המורה"
  }
}

const get_student_courses = (student) => {
  let approved_courses = student.requests.filter(course => course.status === APPROVED)
  if (Array.isArray(approved_courses) && approved_courses.length > 0) {
    return (approved_courses.map(course => course.course_name)).join(", ")
  } else {
    return "לא אושרו קורסים עבור התלמיד"
  }
}

/**
 * The user card holds the information about a user:
 * the name, mail. phone number
 * courses teaching/studying, etc
 */
export default function UserCard({ user, teacher, student, opened_from_student=false}) { //user, teacher, student
  let curr_user = { id: user._id, roles: "אין תפקיד" }
  const full_name = `${user.first_name} ${user.last_name}`
  const classes = useStyles();
  if (user.isTeacher && teacher) {
    curr_user.roles = "מורה"
    curr_user.teacher_courses = get_teacher_courses(teacher)
  }
  if (user.isStudent && student) {
    curr_user.roles = (user.gender !== "male") ? "תלמידה" : "תלמיד";
    curr_user.student_courses = get_student_courses(student)
    curr_user.group_name = student.group.name ? student.group.name : "אין שייכות לקבוצה"
  }
  if (user.isStudent && user.isTeacher && student && teacher) {
    curr_user.roles = "מורה, תלמיד"
  }
  const imageSrc = (user.gender === "male") ? male_image : female_image;
  const study = (user.gender !== "male") ? 'לומדת' : 'לומד';
  const teaching = (user.gender !== "male") ? 'מלמדת' : 'מלמד';

  return (
    <Card className={classes.card}>
      <Image src={imageSrc} wrapped ui={false} />

      <Card.Content>

        <Card.Header className={classes.header}>{full_name}</Card.Header>

        <Card.Meta className={classes.meta}>
          {!opened_from_student && <span> {user._id} </span>}
          <span> {user.tel_number} </span>
          <span> {user.email} </span>
        </Card.Meta>

        <Card.Description>
          <TableContainer>
            <Table size="small" >
              <TableBody>

                {(user.isStudent && student) && <TableRow>
                  <TableCell className={classes.tableCell}> {study}</TableCell>
                  <TableCell className={classes.tableCell}>{curr_user.student_courses} </TableCell>
                </TableRow>}

                {(user.isStudent && student) && <TableRow>
                  <TableCell className={classes.tableCell}>קבוצת לימוד</TableCell>
                  <TableCell className={classes.tableCell}>{curr_user.group_name} </TableCell>
                </TableRow>}

                {(user.isTeacher && teacher) && <TableRow>
                  <TableCell className={classes.tableCell}>{teaching}</TableCell>
                  <TableCell className={classes.tableCell}>{curr_user.teacher_courses} </TableCell>
                </TableRow>}

              </TableBody>
            </Table>
          </TableContainer>
        </Card.Description>
      </Card.Content>

      <Card.Content extra>
        <Icon name='user' />
        {curr_user.roles}
      </Card.Content>
    </Card >
  );
}