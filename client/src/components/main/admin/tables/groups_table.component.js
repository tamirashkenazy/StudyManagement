import React, {useState} from 'react';
import {Dialog_generator} from '../../utils/utils'
import GenericTable from '../../utils/generic_table.component'
import AddStudentsToGroup from '../add_students_to_group.component'
import TransferWithinAStationIcon from '@material-ui/icons/TransferWithinAStation';
import get_mongo_api from '../../../mongo/paths.component'
import axios from 'axios'
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import { Typography, Box } from '@material-ui/core';
import { Button} from 'react-bootstrap'
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import {make_arr_students_in_group, tz} from '../add_students_to_group.component'

const httpRequestToDeleteGroup = async (name, students) => {
    let students_in_group = make_arr_students_in_group(students.filter(student=>student.group.name === name), ()=>{}, true)
    let ids_of_students = students_in_group.map(student_obj => {
        return student_obj[tz]
    }).filter(item => item !== undefined)
    let post_body = {students_id : ids_of_students, group_name : "כללי"}
    let res = await axios.post(get_mongo_api('students/updateGroup/listOfStudents'), post_body).then((response)=>  response.data.success)
    if (res === true) {
        axios.delete(get_mongo_api(`groups/${name}`)).then(response=>{
            if (response.data.success) {
                alert(response.data.message)
                window.location.reload(true)
            } else {
                alert(response.data.message)
            }
        })
    }

}
const delete_group = (name, students) => {
    confirmAlert({
        customUI: ({ onClose }) => {
            return (
              <div style={{backgroundColor: "#F5F5F5", padding : "3rem", borderRadius : "20%", textAlign:"center", direction:"rtl"}} >
                <Typography variant="h4" align="center" fontWeight="fontWeightBold">מחיקת קבוצה</Typography>
                <hr></hr>
                <Typography component="div">
                    <Box fontWeight="fontWeightBold">
                    האם ברצונך למחוק את הקבוצה: {name}?
                    </Box>
                </Typography>
                <br></br>
                <Button align="center" variant="primary" onClick={() => {httpRequestToDeleteGroup(name, students); onClose();}}> מחיקה </Button>
              </div>
            );
          }
      }); 
}

const all_groups_array  = (all_groups, setGroupNameChosen, setPopUpOpen, group_to_num_of_students, students)=>{
    if (all_groups && Array.isArray(all_groups) && all_groups.length>0){
        return all_groups.map(group => {
            return {
                "שם הקבוצה": group.name,
                "מספר שעות עבור קבוצה": group.approved_hours,
                "מספר סטודנטים בקבוצה" : group_to_num_of_students[group.name] ? group_to_num_of_students[group.name] : 0,
                "צפייה והוספת תלמידים לקבוצה" : <IconButton onClick={()=>{setGroupNameChosen(group.name); setPopUpOpen(true)}} style={{padding : " 0.5vh 0px 0.5vh 0px"}}><TransferWithinAStationIcon style={{color:"#4682B4"}}/></IconButton>,
                "מחיקת קבוצה" : group.name !== "כללי" && <IconButton onClick={()=>delete_group(group.name, students)} style={{padding : " 0.5vh 0px 0.5vh 0px"}}><CloseIcon style={{color:"red"}}/>  </IconButton> 
            }
        })
    } else {
        return ([{
            "אין קבוצות":""
        }])
    }
}

const map_group_to_students = (students) => {
    let group_to_num_of_students = {}
    if (!students) {
        return group_to_num_of_students
    }
    students.forEach(student=>{
        let group = student.group.name
        if (group_to_num_of_students.hasOwnProperty(group)) {
            group_to_num_of_students[group] += 1
        } else {
            group_to_num_of_students[group] = 1

        }
    })
    return group_to_num_of_students
}

export default function CoursesTableAdmin({all_groups, students}) {
    const [groupNameChosen, setGroupNameChosen] = useState(null)
    const [isPopUpOpen, setPopUpOpen] = useState(false)
    let group_to_num_of_students = map_group_to_students(students)
    let group_arr = all_groups_array(all_groups, setGroupNameChosen, setPopUpOpen, group_to_num_of_students, students)

    return (
        <>
        {Dialog_generator(
            isPopUpOpen, 
            ()=>setPopUpOpen(false), 
            "הוספת סטודנטים לקבוצה" ,
            "",
            {students, groupNameChosen}, 
            (args)=>AddStudentsToGroup(args) )
        }
        <GenericTable table_data={{data:group_arr, title:"קבוצות קיימות"}}/>
        </>
    )
}