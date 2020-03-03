import React from 'react';
// import {useAsyncHook} from '../../mongo/paths.component's
import GenericTable from '../utils/generic_table.component'
import { Typography } from '@material-ui/core';
// import IconButton from '@material-ui/core/IconButton';
// import CloseIcon from '@material-ui/icons/Close';
// import CheckIcon from '@material-ui/icons/Check';
// import axios from 'axios';
// import get_mongo_api from '../../mongo/paths.component';

// const approve_decline_teacher_req = (_id, status, course_id) => {
//     axios.post(get_mongo_api(`teachers/update/requestStatus/${_id}`),{course_id, status}).then(response=>{
//         if (response.data.success) {
//             alert(response.data.message)
//             window.location.reload(true)
//         } else {
//             // alert("הקורס לא התווסף בהצלחה")
//             alert(response.data.message)
//         }
//     })
// }

const status_to_hebrew = {
    "waiting" : {text : "ממתין לאישור", color: "inherit"},
    "approved" : {text : "אושר", color: "primary"},
    "declined" : {text : "בקשה נדחתה", color: "error"}
}

const teacher_status_request_array = (teacher)=>{
    const {teaching_requests} = teacher;
    if (teaching_requests && teaching_requests.length>0){    
        let teacher_requests_status = teaching_requests.map(teaching_request => {
            return (
                {
                    "קורס" :<Typography variant="h5">{teaching_request.course_name}</Typography> ,
                    "סטטוס" : <Typography variant="h5" color={status_to_hebrew[teaching_request.status].color}>{status_to_hebrew[teaching_request.status].text}</Typography>
                }
            )
        })
        return teacher_requests_status
    } else {
        return ([{
            "אין בקשות":""
        }])
    }
}

export default function TeachersStatusRequestsTable({teacher}) {
    let teacher_req_stat = teacher_status_request_array(teacher)
    // const [teachers, loading] = useAsyncHook(`teachers`, teachers_requests_array);
    return (
        <GenericTable table_data={{data:teacher_req_stat, title:"סטטוס בקשות"}}/>
    )
}