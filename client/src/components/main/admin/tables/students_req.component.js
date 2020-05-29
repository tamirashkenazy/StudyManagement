import React from 'react';
import GenericTable from '../../utils/generic_table.component'
import {  Button } from '@material-ui/core';
import {httpRequestToApproveDeclineRequests, GreenRadio, RedRadio, GreyRadio, useChoosingForm} from './requests_utils'


function RequestRow (request, student_id, selectedValues, handleInputChange) {
    let {course_id} = request
    return (
        {
            "ת.ז" : student_id,
            "קורס" : request.course_name,
            "שעות מבוקשות" : request.number_of_hours,
            // "אישור": <IconButton size="small" onClick={()=>approve_decline_hours_student(student_id, "approved", request.course_id)}><CheckIcon style={{color:"green"}}/></IconButton>,
            // "דחייה":<IconButton size="small" onClick={()=>approve_decline_hours_student(student_id, "declined", request.course_id)}><CloseIcon style={{color:"red"}}/></IconButton>,
            "אישור קורס" : <GreenRadio name={`${student_id},${course_id}`} value="approved" checked={selectedValues[student_id][course_id]==="approved" } onChange={handleInputChange}></GreenRadio>,
            "דחיית בקשה" :   <RedRadio name={`${student_id},${course_id}`} value="declined" checked={selectedValues[student_id][course_id]==="declined"} onChange={handleInputChange}></RedRadio>,
            "הסרת בחירה" : <GreyRadio  name={`${student_id},${course_id}`} value={null} checked={selectedValues[student_id][course_id]===null} onChange={handleInputChange}></GreyRadio>,
        }
    )
}

const students_requests_array = (students_arr, selectedValues, handleInputChange)=>{
    if (students_arr && students_arr.length>0){
        let students_requests = students_arr.map(student_obj => {
            let request_courses_to_study = student_obj.requests
            const student_id= student_obj._id
            if (request_courses_to_study && request_courses_to_study.length>0){
                let requests_arr = request_courses_to_study.filter(request => request.status === "waiting").map(request => 
                        RequestRow(request, student_id, selectedValues, handleInputChange)
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

export default function StudentsRequestTable({students}) {

    // const [, loading] = useAsyncHook(`students`, students_requests_array);
    const {selectedValues, handleInputChange, handleSubmit} = useChoosingForm(httpRequestToApproveDeclineRequests, students, `students/update/requestStatusesList`);

    let students_arr = students_requests_array(students, selectedValues, handleInputChange)
    return (
        <>
        <GenericTable table_data={{data:students_arr, title:"בקשות תלמידים"}}/>
        <Button onClick={handleSubmit} style={{margin : "2vh 0 0 0"}} color="primary" variant="outlined">שליחת בקשות התלמידים</Button>
        </>
    )
}