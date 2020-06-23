import React from 'react';
import GenericTable from '../../utils/generic_table.component'
import { Typography } from '@material-ui/core';


const status_to_hebrew = {
    "waiting" : {text : "ממתין לאישור", color: "inherit"},
    "approved" : {text : "אושר", color: "primary"},
    "declined" : {text : "בקשה נדחתה", color: "error"}
}

const teacher_status_request_array = (teaching_requests)=>{
    if (teaching_requests && teaching_requests.length>0){    
        let teacher_requests_status = teaching_requests.map(teaching_request => {
            return (
                {
                    "קורס" :<Typography variant="body1">{teaching_request.course_name}</Typography> ,
                    "סטטוס" : <Typography variant="body1" color={status_to_hebrew[teaching_request.status].color}>{status_to_hebrew[teaching_request.status].text}</Typography>
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
/**
 * table of the requests the teacher made in order to teach
 */
export default function TeachersStatusRequestsTable({teaching_requests}) {
    let teacher_req_stat = teacher_status_request_array(teaching_requests)
    return (
        <GenericTable table_data={{data:teacher_req_stat, title:"סטטוס בקשות"}}/>
    )
}