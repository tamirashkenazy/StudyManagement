import React from 'react';
import GenericTable from '../../utils/generic_table.component'
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import CheckIcon from '@material-ui/icons/Check';
import axios from 'axios';
import get_mongo_api from '../../../mongo/paths.component';

// import Input from '@material-ui/core/Input';
const approve_decline_hours_student = (_id, status, course_id) => {
    console.log(_id, status, course_id);
    axios.post(get_mongo_api(`students/update/requestStatus/${_id}`),{course_id, status}).then(response=>{
        if (response.data.success) {
            alert(response.data.message)
            window.location.reload(true)
        } else {
            alert(response.data.message)
        }
    })
}
// function RequestRow (request, student_id) {
function RequestRow (request, student_id) {
    // const [approved_hours, set_approved_hours] = useState(request.number_of_hours)

    return (
        {
            "ת.ז" : student_id,
            "קורס" : request.course_name,
            "שעות מבוקשות" : request.number_of_hours,
            "אישור": <IconButton size="small" onClick={()=>approve_decline_hours_student(student_id, "approved", request.course_id)}><CheckIcon style={{color:"green"}}/></IconButton>,
            "דחייה":<IconButton size="small" onClick={()=>approve_decline_hours_student(student_id, "declined", request.course_id)}><CloseIcon style={{color:"red"}}/></IconButton>
        }
    )
}

const students_requests_array = (students_arr)=>{
    if (students_arr && students_arr.length>0){
        let students_requests = students_arr.map(student_obj => {
            let request_courses_to_study = student_obj.requests
            const student_id= student_obj._id
            if (request_courses_to_study && request_courses_to_study.length>0){
                let requests_arr = request_courses_to_study.filter(request => request.status === "waiting").map(request => 
                        RequestRow(request, student_id)
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
    let students_arr = students_requests_array(students)
    return (
        <GenericTable table_data={{data:students_arr, title:"בקשות תלמידים"}}/>
    )
}