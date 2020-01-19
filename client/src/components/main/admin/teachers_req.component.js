import React from 'react';
import {useAsyncHook} from '../../mongo/paths.component'
import GenericTable from '../utils/generic_table.component'
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import CheckIcon from '@material-ui/icons/Check';

const teachers_requests_array = (teachers_arr)=>{
    if (teachers_arr && teachers_arr.length>0){
        let teacher_requests = teachers_arr.map(teacher_obj => {
            let request_courses_to_teach = teacher_obj.teaching_requests
            const teacher_id = teacher_obj._id
            const grades_sheet = "גיליון"
            if (request_courses_to_teach && request_courses_to_teach.length>0){
                let requests_arr = request_courses_to_teach.map(request => {
                    return (
                        {
                            "ת.ז" : teacher_id,
                            "קורס" : request.course_name,
                            "גיליון" : grades_sheet,
                            "": <IconButton size="small"><CheckIcon style={{color:"green"}}/></IconButton>,
                            " ":<IconButton size="small"><CloseIcon style={{color:"red"}}/></IconButton>
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
        
        return teacher_requests
    } else {
        return null
    }
}

export default function TeachersRequestTable() {
    const [teachers, loading] = useAsyncHook(`teachers`, teachers_requests_array);
    return (
        !loading && <GenericTable table_data={{data:teachers, title:"בקשות מורים"}}/>
    )
}