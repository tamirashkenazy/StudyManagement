import React, { useState } from 'react';
// import {useAsyncHook} from '../../mongo/paths.component'
import { Tab } from 'semantic-ui-react'
import UserCard from '../utils/card.component'
import {Dialog_generator} from '../utils//utils'
import AccountCircleOutlinedIcon from '@material-ui/icons/AccountCircleOutlined';
import IconButton from '@material-ui/core/IconButton';
import GenericTable from '../utils/generic_table.component';


const make_participants = (arr_of_users, args) => {
    if (!args) {
        return null
    }
    const users_by_roles = {teachers : [], students : []}
    const {setCardOpen, setUserID, teachers, students} = args
    if (arr_of_users && arr_of_users!==undefined && arr_of_users.length>0){
        arr_of_users.forEach(user => {
            const id = user._id
            let courses;
            if (user.isTeacher) {
                courses = []
                let teacher = teachers.filter(teacher=> teacher._id === id)
                if (teacher && teacher.length === 1) {
                    teacher = teacher[0]
                    if (teacher.teaching_courses && teacher.teaching_courses.length > 0 ) {
                        teacher.teaching_courses.forEach(course=>courses.push(course.course_name))

                    }
                } else {

                }
                users_by_roles.teachers.push({
                    "" : <IconButton onClick={()=>{setCardOpen(true); setUserID(user._id)}}><AccountCircleOutlinedIcon/></IconButton>,
                    "ת.ז" : id,
                    "שם פרטי" : user.first_name,
                    "שם משפחה" : user.last_name,
                    // "קורסים" :  courses.join(", ")
                })
            }
            if (user.isStudent) {
                courses = []
                let student = students.filter(student=> student._id === id)
                if (student && student.length === 1) {
                    student = student[0]
                    console.log("student: ", student);
                    if (student.requests && student.requests.length > 0 ) {
                        student.requests.filter(req=>req.status === "approved").forEach(course=>courses.push(course.course_name))
                    }
                } else {

                }
                users_by_roles.students.push({
                    "" : <IconButton onClick={()=>{setCardOpen(true); setUserID(user._id)}}><AccountCircleOutlinedIcon/></IconButton>,
                    "ת.ז" : id,
                    "שם פרטי" : user.first_name,
                    "שם משפחה" : user.last_name,
                    // "קורסים" :  courses.join(", ")
                })
            }
        })
        return users_by_roles
    }
}

export default function Participants(props){
    const {teachers, students, users} = props
    console.log('props in parti', props);
    const [isCardOpen, setCardOpen] = useState(false)
    const [user_id, setUserID] = useState(null)

    let args = {setCardOpen, setUserID, teachers, students};
    let users_participants = make_participants(users, args)
    let panes=null
    if (users_participants) {
        panes = [
            { menuItem: 'מורים', render: () => <Tab.Pane>{<GenericTable table_data={{data:users_participants.teachers, title:null}} />}</Tab.Pane> },
            { menuItem: 'תלמידים', render: () => <Tab.Pane>{<GenericTable table_data={{data:users_participants.students, title:null}} />}</Tab.Pane> },
            ]
    }

    return (
        <>
         <Tab panes={panes}/>
        {Dialog_generator(isCardOpen, ()=>setCardOpen(false), "כרטיס סטודנט" ,{}, ()=><UserCard user_id={user_id}></UserCard>)}
        </>
    )
       
}