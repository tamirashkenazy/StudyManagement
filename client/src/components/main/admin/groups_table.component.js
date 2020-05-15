import React, {useState} from 'react';
import {Dialog_generator} from '../utils/utils'
import GenericTable from '../utils/generic_table.component'
import AddStudentsToGroup from './add_students_to_group.component'
const all_groups_array  = (all_groups, setGroupNameChosen, setPopUpOpen)=>{
    if (all_groups && Array.isArray(all_groups) && all_groups.length>0){
        return all_groups.map(group => {
            return {
                "שם הקבוצה": group.name,
                "מספר שעות עבור קבוצה": group.approved_hours,
                "צפייה והוספת תלמידים לקבוצה" : <button onClick={()=>{setGroupNameChosen(group.name); setPopUpOpen(true)}}>add</button>
            }
        })
    } else {
        return ([{
            "אין קבוצות":""
        }])
    }
}

export default function CoursesTableAdmin({all_groups, users, students}) {
    const [groupNameChosen, setGroupNameChosen] = useState(null)
    const [isPopUpOpen, setPopUpOpen] = useState(false)
    let group_arr = all_groups_array(all_groups, setGroupNameChosen, setPopUpOpen)

    return (
        <>
        {Dialog_generator(
            isPopUpOpen, 
            ()=>setPopUpOpen(false), 
            "הוספת סטודנטים לקבוצה" ,
            "",
            {users, students, groupNameChosen}, 
            (args)=>AddStudentsToGroup(args) )
        }
        <GenericTable table_data={{data:group_arr, title:"קבוצות קיימות"}}/>
        </>
    )
}