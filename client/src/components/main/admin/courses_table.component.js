import React from 'react';

import GenericTable from '../utils/generic_table.component'

const all_courses_array  = (all_courses)=>{
    if (all_courses && Array.isArray(all_courses) && all_courses.length>0){
        return all_courses.map(course => {
            return {
                "מזהה קורס": course._id,
                "שם קורס": course.name
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