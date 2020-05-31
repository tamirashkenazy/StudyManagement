import React, { useState } from 'react';
import GenericTable from '../../utils/generic_table.component'
import {  Button } from '@material-ui/core';
import {httpRequestToApproveDeclineRequests, GreenRadio, RedRadio, GreyRadio, useChoosingForm} from './requests_utils'
import UserCard from '../../utils/card.component'
import AccountCircleOutlinedIcon from '@material-ui/icons/AccountCircleOutlined';
import IconButton from '@material-ui/core/IconButton';
import {Dialog_generator} from '../../utils/utils'
import {filter_by_id} from '../navbar_items/participants.component'


function RequestRow (request, student_id, selectedValues, handleInputChange, setCardOpen, setCurrUser, user) {
    let {course_id} = request
    return (
        {
            "ת.ז" : <>  <IconButton style={{padding : "0"}} onClick={()=>{setCardOpen(true); setCurrUser(user)}} color="primary"><AccountCircleOutlinedIcon/></IconButton> {student_id}</>,
            "קורס" : request.course_name,
            "שעות מבוקשות" : request.number_of_hours,
            "אישור קורס" : <GreenRadio name={`${student_id},${course_id}`} value="approved" checked={selectedValues[student_id][course_id]==="approved" } onChange={handleInputChange}></GreenRadio>,
            "דחיית בקשה" :   <RedRadio name={`${student_id},${course_id}`} value="declined" checked={selectedValues[student_id][course_id]==="declined"} onChange={handleInputChange}></RedRadio>,
            "הסרת בחירה" : <GreyRadio  name={`${student_id},${course_id}`} value={""} checked={selectedValues[student_id][course_id]===""} onChange={handleInputChange}></GreyRadio>,
        }
    )
}

const students_requests_array = (students_arr, selectedValues, handleInputChange, setCardOpen, setCurrUser, users)=>{
    if (students_arr && students_arr.length>0){
        let students_requests = students_arr.map(student_obj => {
            let request_courses_to_study = student_obj.requests
            const student_id= student_obj._id
            let user = users ? users.filter(user => user._id === student_id) : null
            user = user ? user[0] : null
            if (request_courses_to_study && request_courses_to_study.length>0){
                let requests_arr = request_courses_to_study.filter(request => request.status === "waiting").map(request => 
                        RequestRow(request, student_id, selectedValues, handleInputChange, setCardOpen, setCurrUser, user)
                )
                return requests_arr
            } else {
                return null
            }
        })
        students_requests = students_requests.flat()
        students_requests = students_requests.filter(element=> element!=null)
        if (students_requests && Array.isArray(students_requests) && students_requests.length===0) {
            return ([{
                "אין בקשות של תלמידים":""
            }])
        }
        return students_requests
    } else {
        return ([{
            "אין תלמידים להציג":""
        }])
    }
}


export default function StudentsRequestTable({users, students, teachers}) {
    const [isCardOpen, setCardOpen] = useState(false)
    const [user, setCurrUser] = useState(null)
    const {selectedValues, handleInputChange, handleSubmit} = useChoosingForm(httpRequestToApproveDeclineRequests, students, `students/update/requestStatusesList`);

    let students_arr = students_requests_array(students, selectedValues, handleInputChange, setCardOpen, setCurrUser, users)
    return (
        <>
        <GenericTable table_data={{data:students_arr, title:"בקשות תלמידים"}}/>
        <Button onClick={handleSubmit} style={{margin : "2vh 0 0 0"}} color="primary" variant="outlined">שליחת בקשות התלמידים</Button>
        {Dialog_generator(
            isCardOpen, 
            ()=>setCardOpen(false), 
            null, null, 
            {user, teacher:filter_by_id(teachers, user), student:filter_by_id(students, user)}, 

            (props)=><UserCard user={user} teacher={props.teacher} student={props.student}></UserCard>, "card")
        }
        </>
    )
}