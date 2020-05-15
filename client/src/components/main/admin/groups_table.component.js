import React from 'react';

import GenericTable from '../utils/generic_table.component'

const all_groups_array  = (all_groups)=>{
    if (all_groups && Array.isArray(all_groups) && all_groups.length>0){
        return all_groups.map(group => {
            return {
                "שם הקבוצה": group.name,
                "מספר שעות עבור קבוצה": group.approved_hours
            }
        })
    } else {
        return ([{
            "אין קבוצות":""
        }])
    }
}

export default function CoursesTableAdmin({all_groups}) {
    let group_arr = all_groups_array(all_groups)
    return (
        <GenericTable table_data={{data:group_arr, title:"קבוצות קיימות"}}/>
    )
}