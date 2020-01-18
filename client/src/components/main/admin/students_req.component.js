import React  from 'react';
import {useAsyncHook} from '../../mongo/paths.component'
import GenericTable from '../utils/generic_table.component'
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import CheckIcon from '@material-ui/icons/Check';

const students_requests_array = (students_arr)=>{
    if (students_arr && students_arr.length>0){
        let students_requests = students_arr.map(student_obj => {
            let request_courses_to_study = student_obj.requests
            const student_id= student_obj._id
            if (request_courses_to_study && request_courses_to_study.length>0){
                let requests_arr = request_courses_to_study.map(request => {
                    return (
                        {
                            "ת.ז" : student_id,
                            "קורס" : request.course_name,
                            "שעות מבוקשות" : request.number_of_hours,
                            "שעות מאושרות" : "שעות לאשר",
                            "קבצים" : "קבצים",
                            "": <IconButton size="small" onClick={()=>console.log('clicked')}><CheckIcon style={{color:"green"}}/></IconButton>,
                            " ":<IconButton size="small"><CloseIcon style={{color:"red"}}/></IconButton>
                        }
                    )
                })
                return requests_arr
            } else {
                return null
            }
        })
        students_requests = students_requests.flat()
        return students_requests
    } else {
        return null
    }
}

export default function StudentsRequestTable(props) {
    const [students, loading] = useAsyncHook(`students`, students_requests_array);
    return (
        !loading && <GenericTable table_data={{data:students, title:"בקשות תלמידים"}}/>
    )
}