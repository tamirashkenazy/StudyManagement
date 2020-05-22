import React from 'react';
import GenericTable from '../../utils/generic_table.component'
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import CheckIcon from '@material-ui/icons/Check';
import axios from 'axios';
import get_mongo_api from '../../../mongo/paths.component';
import Typography from '@material-ui/core/Typography';
import DescriptionOutlinedIcon from '@material-ui/icons/DescriptionOutlined';

const approve_decline_teacher_req = (_id, status, course_id) => {
    axios.post(get_mongo_api(`teachers/update/requestStatus/${_id}`),{course_id, status}).then(response=>{
        if (response.data.success) {
            alert(response.data.message)
            window.location.reload(true)
        } else {
            alert(response.data.message)
        }
    })
}


const open_grades_file = (_id) => {
    axios.get(get_mongo_api(`teachers/${_id}/checkgrades`),{_id}).then(response=>{
        if (response.data.success) {
            window.open(get_mongo_api(`teachers/${_id}/grades`));
        } else {
            alert(response.data.message)
        }
    })
}


const teachers_requests_array = (teachers_arr)=>{
    if (teachers_arr && teachers_arr.length>0){
        let teacher_requests = teachers_arr.map(teacher_obj => {
            let request_courses_to_teach = teacher_obj.teaching_requests
            let grades_file = teacher_obj.grades_file
            request_courses_to_teach = request_courses_to_teach.filter(teaching_req => teaching_req.status === "waiting")
            const teacher_id = teacher_obj._id
            if (request_courses_to_teach && request_courses_to_teach.length>0){
                let requests_arr = request_courses_to_teach.map(request => {
                    return (
                        {
                            "ת.ז" : teacher_id,
                            "קורס" : request.course_name,
                            "גיליון" : grades_file.name ? <IconButton onClick={()=>open_grades_file(teacher_id)} color="primary" style={{padding : "0"}}><DescriptionOutlinedIcon /></IconButton> : <Typography variant="body2">לא קיים גיליון ציונים</Typography>,
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
        // console.log('teacher req: ', teacher_requests);
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

export default function TeachersRequestTable({teachers}) {
    let teacher_arr = teachers_requests_array(teachers)
    return (
        <GenericTable table_data={{data:teacher_arr, title:"בקשות מורים"}}/>
    )
}