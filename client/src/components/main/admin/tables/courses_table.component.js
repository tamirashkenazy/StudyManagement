import React from 'react';
import GenericTable from '../../utils/generic_table.component'
import get_mongo_api from '../../../mongo/paths.component'
import axios from 'axios'
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import { Typography, Box } from '@material-ui/core';
import { Button} from 'react-bootstrap'
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';

const httpRequestToDeleteCourse = (id) => {
    axios.delete(get_mongo_api(`courses/${id}`)).then(response=>{
        if (response.data.success) {
            alert(response.data.message)
            window.location.reload(true)
        } else {
            alert(response.data.message)
        }
    })
}
const delete_course = (id, name) => {
    confirmAlert({
        customUI: ({ onClose }) => {
            return (
              <div style={{backgroundColor: "#F5F5F5", padding : "3rem", borderRadius : "20%", textAlign:"center", direction:"rtl"}} >
                <Typography variant="h4" align="center" fontWeight="fontWeightBold">מחיקת קורס</Typography>
                <hr></hr>
                <Typography component="div">
                    <Box fontWeight="fontWeightBold">
                    האם ברצונך למחוק את הקורס: {id} - {name}?
                    </Box>
                </Typography>
                <br></br>
                <Button align="center" variant="primary" onClick={() => {httpRequestToDeleteCourse(id); onClose();}}> מחיקה </Button>
              </div>
            );
          }
      }); 
}

const all_courses_array  = (all_courses)=>{
    if (all_courses && Array.isArray(all_courses) && all_courses.length>0){
        return all_courses.map(course => {
            return {
                "מזהה קורס": course._id,
                "שם קורס": course.name,
                "מחיקת קורס" : <IconButton onClick={()=>delete_course(course._id, course.name)} style={{padding : " 0.5vh 0px 0.5vh 0px"}}><CloseIcon style={{color:"red"}}/>  </IconButton>
            }
        })
    } else {
        return ([{
            "אין קורסים":""
        }])
    }
}

export default function CoursesTableAdmin({all_courses}) {
    let courses_arr = all_courses_array(all_courses)
    return (
        <GenericTable table_data={{data:courses_arr, title:"קורסים קיימים"}}/>
    )
}