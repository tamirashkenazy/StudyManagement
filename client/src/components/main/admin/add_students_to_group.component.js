import React, {useState} from 'react'
import axios from 'axios';
import get_mongo_api from '../../mongo/paths.component';
import GenericTable from '../utils/generic_table.component';
import { Button} from 'react-bootstrap'
import IconButton from '@material-ui/core/IconButton';
import PersonAddIcon from '@material-ui/icons/PersonAdd';

export const tz = "תז"
const make_button_add_remove = (curr_id, ids, setId) => {
  if (ids.has(curr_id)){
    return <IconButton size="small" style={{color:"#FA8072"}}onClick={()=>setId(prev => {
      prev.delete(curr_id)
      return (
        new Set(prev)
      )})}>בטל הוספה
    </IconButton>
  } else {
    return <IconButton onClick={()=>setId(prev => {
      prev.add(curr_id)
      return (
        new Set(prev)
      )})}><PersonAddIcon style={{color : "green"}}></PersonAddIcon>
    </IconButton>
  }
}

/**
 * Creating array for students in the specific group and not in the specific group
 */
export const make_arr_students_in_group = (students, setId, in_group=false, ids=null) => {
  if (students && Array.isArray(students) && students.length>0){
    if (!in_group) {
      return students.map(student => {
        return {
          [tz]: student._id,            
          "שם": student.name,
          "הוספה לקבוצה" : make_button_add_remove(student._id, ids, setId)
        }
    })} else {
      return students.map(student => {
        return {
          [tz]: student._id,            
          "שם": student.name
        }
      })
    }
    
} else {
    return ([{
        "אין סטודנטים בקבוצה":""
    }])
}}

/**
 * post request to add group to DB
 */
const post_request_add_to_group = (ids, groupNameChosen) => {
  let post_body = {students_id : Array.from(ids), group_name : groupNameChosen}
  axios.post(get_mongo_api('students/updateGroup/listOfStudents'), post_body).then((response)=> {
    if (response.data.success) {
        window.location.reload(true)
    } else {
        alert(response.data.message)
    }
})
}

/**
 * This component is responsible to add students to a group
 */
export default function AddStudentsToGroup({students, groupNameChosen}) { 
    const [ids, setId] = useState(new Set())
    const students_in_group = make_arr_students_in_group(students.filter(student=>student.group.name === groupNameChosen), setId, true)
    const students_not_in_group = make_arr_students_in_group(students.filter(student=>student.group.name !== groupNameChosen), setId, false, ids)
    return (
      <>
      <GenericTable table_data={{data:students_in_group, title:`סטודנטים בקבוצה: ${groupNameChosen}`}}></GenericTable>
      <GenericTable table_data={{data:students_not_in_group, title:"סטודנטים שלא בקבוצה"}}></GenericTable>
      {ids.size > 0 && <Button variant="outline-primary" onClick={()=>post_request_add_to_group(ids, groupNameChosen)}>הוסף</Button>}
      </>
    );
}