import React, {useState} from 'react';
import {Button, Dropdown} from 'semantic-ui-react'
import axios from 'axios'
import get_mongo_api, {useAsyncHook} from '../../mongo/paths.component'
import { Grid } from 'semantic-ui-react'

const make_courses_option = (arr_of_courses) => {
    // let local_courses = courses
    if (arr_of_courses && Array.isArray(arr_of_courses) && arr_of_courses.length > 0){
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


const get_options = (num_of_options) => {
    var options = []
    for (let i=1 ; i<=num_of_options; i++) {
        let temp = {key : i, text : i, value: `${i}`}
        options.push(temp)
    }
    return options
}

export default function RequestHours({id, number_of_approved_hours}){
    const [courses_options, loading] = useAsyncHook(`courses`, make_courses_option);
    const [selectedCourse, setSelectedCourse] = useState(null)
    const [hours, setHours] = useState(null)
    
    const sendCourse = (_id) => {
        const course_id = selectedCourse.split('-')[0]
        const course_name = selectedCourse.split('-')[1]
        axios.post(get_mongo_api(`students/add/request/${_id}`),{course_id : course_id,course_name:course_name, number_of_hours: hours,  status : "waiting"}).then(response=>{
            if (response.data.success) {
                alert(response.data.message)
                window.location.reload(true)
            } else {
                // alert("הקורס לא התווסף בהצלחה")
                alert(response.data.message)
            }
        })
    }
    
    return (
        //conditional rendering react: https://reactjs.org/docs/conditional-rendering.html 
        !loading &&
        <Grid columns={1}  style={{margin : "2rem 1rem 3rem 1rem"}}>
            <Grid.Row centered>
                <Dropdown direction="right"  placeholder='בחר קורס' scrolling search selection  onChange={(e,{value})=> setSelectedCourse(value)} options={courses_options}  />

            </Grid.Row>
            <Grid.Row centered>
                <Dropdown direction="right"  placeholder='מספר שעות' scrolling search selection  onChange={(e,{value})=>setHours(value)} options={get_options(number_of_approved_hours)}/>
            </Grid.Row >
            {selectedCourse && hours && <Grid.Row centered>
                <Button onClick={()=>{sendCourse(id)}}>שלח</Button>
            </Grid.Row>}
        </Grid>
    )
}