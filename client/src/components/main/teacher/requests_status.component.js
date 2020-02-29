import React from 'react';
import {useAsyncHook} from '../../mongo/paths.component'
import GenericTable from '../utils/generic_table.component'
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import CheckIcon from '@material-ui/icons/Check';
import axios from 'axios';
import get_mongo_api from '../../mongo/paths.component';

const approve_decline_teacher_req = (_id, status, course_id) => {
    axios.post(get_mongo_api(`teachers/update/requestStatus/${_id}`),{course_id, status}).then(response=>{
        if (response.data.success) {
            alert(response.data.message)
            window.location.reload(true)
        } else {
            // alert("הקורס לא התווסף בהצלחה")
            alert(response.data.message)
        }
    })
}

const teachers_requests_array = (teachers_arr)=>{
    if (teachers_arr && teachers_arr.length>0){
        let teacher_requests = teachers_arr.map(teacher_obj => {
            let request_courses_to_teach = teacher_obj.teaching_requests
            request_courses_to_teach = request_courses_to_teach.filter(teaching_req => teaching_req.status === "waiting")
            const teacher_id = teacher_obj._id
            const grades_sheet = "גיליון"
            if (request_courses_to_teach && request_courses_to_teach.length>0){
                let requests_arr = request_courses_to_teach.map(request => {
                    return (
                        {
                            "ת.ז" : teacher_id,
                            "קורס" : request.course_name,
                            "גיליון" : grades_sheet,
                            "אישור קורס": <IconButton size="small" onClick={()=>approve_decline_teacher_req(teacher_id, "approved", request.course_id)}><CheckIcon style={{color:"green"}}/></IconButton>,
                            "דחיית בקשה":<IconButton size="small" onClick={()=>approve_decline_teacher_req(teacher_id, "declined", request.course_id)}><CloseIcon style={{color:"red"}}/></IconButton>
                        }
                    )
                })
                return requests_arr
            } else {
                return null
            }
        })
        teacher_requests = teacher_requests.flat()
        teacher_requests = teacher_requests.filter(element=> element!=null)
        console.log('teacher req: ', teacher_requests);
        if (teacher_requests && Array.isArray(teacher_requests) && teacher_requests.length===0) {
            return ([{
                "אין בקשות של מורים":""
            }])
        }
        return teacher_requests
    } else {
        return ([{
            "אין מורים להציג":""
        }])
    }
}

export default function TeachersStatusRequestsTable({teacher}) {
    console.log('teacher in req: ', teacher);
    // const [teachers, loading] = useAsyncHook(`teachers`, teachers_requests_array);
    return (
        <div>a</div> //<GenericTable table_data={{data:teachers, title:"בקשות מורים"}}/>
    )
}