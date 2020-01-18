import React, {useState} from 'react';
import {Button, Checkbox} from 'semantic-ui-react'
import { Grid } from 'semantic-ui-react'
import axios from 'axios'
import get_mongo_api, {useAsyncHook} from '../../mongo/paths.component'

const make_courses_option = (arr_of_courses) => {
    if (arr_of_courses && arr_of_courses.length>0){
        let options = arr_of_courses.map(course_obj => {
            return (
                {
                    key : course_obj._id,
                    value : `${course_obj._id}-${course_obj.name}`,
                    text : `${course_obj._id} - ${course_obj.name}`
                }
            )
        })
        return options
    }
}


// const get_options = (num_of_options) => {
//     var options = []
//     for (let i=1 ; i<=num_of_options; i++) {
//         let temp = {key : i, text : i, value: `${i}`}
//         options.push(temp)
//     }
//     return options
// }

export default function CoursesToTeach(props){
    const [selectedCourses, setSelectedCourses] = useState([])
    const [courses_options, loading] = useAsyncHook(`courses`, make_courses_option);
    const sendCourses = (_id) => {
        Object.keys(selectedCourses).forEach(key=>{
            let course_id = key.split('-')[0]
            let course_name = key.split('-')[1]
            axios.post(get_mongo_api(`teachers/add/request/${_id}`),{course_id : course_id, course_name: course_name}).then(response=>{
                if (!response.data.success) {
                    console.log(response.data.message)
                }
            })
        })

        // window.location.reload(true)
        // callback()
        // console.log(selectedCourse, hours); 
    }
    
    const onChangeCourse = (e, {value, label, checked}) => {
        let new_selected = Object.assign({},selectedCourses)
        new_selected[value] = checked
        setSelectedCourses(new_selected)
    }

    return (
        !loading && 
        <Grid columns={1} style={{ margin:"10%", minHeight:"20%"}} >
                {courses_options.map(option_obj=>{
                    return(
                        <Grid.Row key={option_obj.value}>
                        <Checkbox 
                            checked={option_obj.value in selectedCourses && selectedCourses[option_obj.value]}
                            label={option_obj.text}
                            value={option_obj.value}
                            onChange={onChangeCourse}
                        />
                        </Grid.Row>
                    )

                })}
                {/* <Dropdown  fluid placeholder='בחר קורס' onChange={(e,{value})=> setSelectedCourse(value)} options={courses_options}/> */}
            
            <Grid.Row>
                {/* <Dropdown  placeholder='מספר שעות' onChange={(e,{value})=>setHours(value)} options={get_options(4)}/> */}
            </Grid.Row>
            {selectedCourses && <Grid.Row>
                <Button onClick={()=>sendCourses(props._id)}>שלח</Button>
            </Grid.Row>}
        </Grid>
    )
}