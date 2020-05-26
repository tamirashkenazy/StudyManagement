import React, {useEffect, useState} from 'react';
import { withStyles } from '@material-ui/core/styles';
import { green, red, grey } from '@material-ui/core/colors';

import GenericTable from '../../utils/generic_table.component'
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import CheckIcon from '@material-ui/icons/Check';
import axios from 'axios';
import get_mongo_api from '../../../mongo/paths.component';
import Typography from '@material-ui/core/Typography';
import DescriptionOutlinedIcon from '@material-ui/icons/DescriptionOutlined';
import { Radio, FormControlLabel, Button } from '@material-ui/core';

// const approve_decline_teacher_req = (_id, status, course_id) => {
//     axios.post(get_mongo_api(`teachers/update/requestStatus/${_id}`),{course_id, status}).then(response=>{
//         if (response.data.success) {
//             alert(response.data.message)
//             window.location.reload(true)
//         } else {
//             alert(response.data.message)
//         }
//     })
// }

const httpRequestToApproveDeclineRequests = (selectedValues) => {
    let arr = Object.entries(selectedValues).filter(([id, course_to_status_obj])=>{
        console.log(course_to_status_obj)
        if (course_to_status_obj && Object.keys(course_to_status_obj).length > 0) {
            return true
        }
    })
    console.log(arr);
    let post_msg = {id_to_courses : arr}
    axios.post(get_mongo_api(`teachers/update/requestStatusesList`),post_msg).then(response=>{
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
const GreenRadio = withStyles({
    root: {
      color: green[400],
      '&$checked': {
        color: green[600],
      },
    },
    checked: {},
  })((props) => <Radio color="default" {...props} />);

  const RedRadio = withStyles({
    root: {
      color: red[400],
      '&$checked': {
        color: red[600],
      },
    },
    checked: {},
  })((props) => <Radio color="default" {...props} />);

  const GreyRadio = withStyles({
    root: {
      color: grey[400],
      '&$checked': {
        color: grey[600],
      },
    },
    checked: {},
  })((props) => <Radio color="default" {...props} />);


const teachers_requests_array = (teachers_arr, selectedValues, handleInputChange)=>{
    if (teachers_arr && teachers_arr.length>0){
        let teacher_requests = teachers_arr.map(teacher_obj => {
            let request_courses_to_teach = teacher_obj.teaching_requests
            let grades_file = teacher_obj.grades_file
            request_courses_to_teach = request_courses_to_teach.filter(teaching_req => teaching_req.status === "waiting")
            const teacher_id = teacher_obj._id
            if (request_courses_to_teach && request_courses_to_teach.length>0){
                let requests_arr = request_courses_to_teach.map(request => {
                    let {course_name, course_id} = request
                    return (
                        {
                            "ת.ז" : teacher_id,
                            "קורס" : course_name,
                            "גיליון" : grades_file.name ? <IconButton onClick={()=>open_grades_file(teacher_id)} color="primary" style={{padding : "0"}}><DescriptionOutlinedIcon /></IconButton> : <Typography variant="body2">לא קיים גיליון ציונים</Typography>,
                            // "אישור קורס": <IconButton size="small" onClick={()=>approve_decline_teacher_req(teacher_id, "approved", request.course_id)}><CheckIcon style={{color:"green"}}/></IconButton>,
                            // "דחיית בקשה":<IconButton size="small" onClick={()=>approve_decline_teacher_req(teacher_id, "declined", request.course_id)}><CloseIcon style={{color:"red"}}/></IconButton>,
                            "אישור קורס" : <GreenRadio name={`${teacher_id},${course_id}`} value="approved" checked={selectedValues[teacher_id][course_id]==="approved" } onChange={handleInputChange}></GreenRadio>,
                            "דחיית בקשה" :   <RedRadio name={`${teacher_id},${course_id}`} value="declined" checked={selectedValues[teacher_id][course_id]==="declined"} onChange={handleInputChange}></RedRadio>,
                            "הסרת בחירה" : <GreyRadio name={`${teacher_id},${course_id}`} value={null} checked={selectedValues[teacher_id][course_id]===null} onChange={handleInputChange}></GreyRadio>,

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

const create_initial_object_requests = (arr) => {
    let start_teachers_object = {}
    if (arr && Array.isArray(arr) && arr.length > 0) {
        arr.forEach(obj => {
            start_teachers_object[obj._id] = {}
        })
    }
    return start_teachers_object
}

export default function TeachersRequestTable({teachers}) {
    
    const useChoosingForm = (httpRequestFunc) => {
        let start_teachers_object = create_initial_object_requests(teachers)
        const [selectedValues, setSelectedValues] = useState(start_teachers_object)
        useEffect(()=>{
            setSelectedValues(start_teachers_object)   
        }, [teachers])
        // const [wasAdded, setWasAdded] = useState(false)
        async function handleSubmit (event) {
            if (event) {
                event.preventDefault();
                let return_val = await httpRequestFunc(selectedValues)
                if (return_val) {
                    window.location.reload(true)
                }
                
            }
        }
        const handleInputChange = (event) => {
            event.persist();
            let {name, value} = event.target
            let [id, course_id] = name.split(',')
            if (value === "") {
                value = null
            }
            setSelectedValues(selectedValues => {
                return({...selectedValues, [id] : {...selectedValues[id], [course_id] : value}})
            });
        }
        return {selectedValues, handleInputChange, handleSubmit};
    }
    const {selectedValues, handleInputChange, handleSubmit} = useChoosingForm(httpRequestToApproveDeclineRequests);
    let teacher_arr = teachers_requests_array(teachers, selectedValues, handleInputChange)

    return (
        <>
        <GenericTable table_data={{data:teacher_arr, title:"בקשות מורים"}}/>
        <Button onClick={handleSubmit} style={{margin : "2vh 0 0 0"}} color="primary" variant="outlined">שליחת בקשות המורים</Button>
        </>
    )
}