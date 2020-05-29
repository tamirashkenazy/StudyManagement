import React from 'react';
import GenericTable from '../../utils/generic_table.component'
import IconButton from '@material-ui/core/IconButton';
import axios from 'axios';
import get_mongo_api from '../../../mongo/paths.component';
import Typography from '@material-ui/core/Typography';
import DescriptionOutlinedIcon from '@material-ui/icons/DescriptionOutlined';
import {  Button } from '@material-ui/core';
import {httpRequestToApproveDeclineRequests, GreenRadio, RedRadio, GreyRadio, useChoosingForm} from './requests_utils'

const open_grades_file = (_id) => {
    axios.get(get_mongo_api(`teachers/${_id}/checkgrades`),{_id}).then(response=>{
        if (response.data.success) {
            window.open(get_mongo_api(`teachers/${_id}/grades`));
        } else {
            alert(response.data.message)
        }
    })
}

function RequestRow (request, teacher_id, selectedValues, handleInputChange, grades_file) {
    let {course_name, course_id} = request
    return (
        {
            "ת.ז" : teacher_id,
            "קורס" : course_name,
            "גיליון" : grades_file.name ? <IconButton onClick={()=>open_grades_file(teacher_id)} color="primary" style={{padding : "0"}}><DescriptionOutlinedIcon /></IconButton> : <Typography variant="body2">לא קיים גיליון ציונים</Typography>,
            "אישור קורס" : <GreenRadio name={`${teacher_id},${course_id}`} value="approved" checked={selectedValues[teacher_id][course_id]==="approved" } onChange={handleInputChange}></GreenRadio>,
            "דחיית בקשה" :   <RedRadio name={`${teacher_id},${course_id}`} value="declined" checked={selectedValues[teacher_id][course_id]==="declined"} onChange={handleInputChange}></RedRadio>,
            "הסרת בחירה" : <GreyRadio  name={`${teacher_id},${course_id}`} value={null} checked={selectedValues[teacher_id][course_id]===null} onChange={handleInputChange}></GreyRadio>,
        }
    )
}

const teachers_requests_array = (teachers_arr, selectedValues, handleInputChange)=>{
    if (teachers_arr && teachers_arr.length>0){
        let teacher_requests = teachers_arr.map(teacher_obj => {
            let request_courses_to_teach = teacher_obj.teaching_requests
            let grades_file = teacher_obj.grades_file
            request_courses_to_teach = request_courses_to_teach.filter(teaching_req => teaching_req.status === "waiting")
            const teacher_id = teacher_obj._id
            if (request_courses_to_teach && request_courses_to_teach.length>0){
                let requests_arr = request_courses_to_teach.map(request => 
                    RequestRow(request, teacher_id, selectedValues, handleInputChange, grades_file)
                )
                return requests_arr
            } else {
                return null
            }
        })
        teacher_requests = teacher_requests.flat()
        teacher_requests = teacher_requests.filter(element=> element!=null)
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
    const {selectedValues, handleInputChange, handleSubmit} = useChoosingForm(httpRequestToApproveDeclineRequests, teachers, `teachers/update/requestStatusesList`);
    let teacher_arr = teachers_requests_array(teachers, selectedValues, handleInputChange)
    return (
        <>
        <GenericTable table_data={{data:teacher_arr, title:"בקשות מורים"}}/>
        <Button onClick={handleSubmit} style={{margin : "2vh 0 0 0"}} color="primary" variant="outlined">שליחת בקשות המורים</Button>
        </>
    )
}