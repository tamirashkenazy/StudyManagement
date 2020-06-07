import React, {useState} from 'react';
import {Dialog_generator} from '../../utils/utils'
import GenericTable from '../../utils/generic_table.component'
import AddStudentsToGroup from '../add_students_to_group.component'
import TransferWithinAStationIcon from '@material-ui/icons/TransferWithinAStation';
import IconButton from '@material-ui/core/IconButton';

const all_groups_array  = (all_groups, setGroupNameChosen, setPopUpOpen, group_to_num_of_students)=>{
    if (all_groups && Array.isArray(all_groups) && all_groups.length>0){
        return all_groups.map(group => {
            return {
                "שם הקבוצה": group.name,
                "מספר שעות עבור קבוצה": group.approved_hours,
                "מספר סטודנטים בקבוצה" : group_to_num_of_students[group.name] ? group_to_num_of_students[group.name] : 0,
                "צפייה והוספת תלמידים לקבוצה" : <IconButton onClick={()=>{setGroupNameChosen(group.name); setPopUpOpen(true)}} style={{padding : " 0.5vh 0px 0.5vh 0px"}}><TransferWithinAStationIcon style={{color:"#4682B4"}}/></IconButton>
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
    let group_arr = all_groups_array(all_groups, setGroupNameChosen, setPopUpOpen, group_to_num_of_students)

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