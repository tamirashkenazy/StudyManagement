import React, {useState} from 'react';
import {Button, Dropdown} from 'semantic-ui-react'
import axios from 'axios'
import get_mongo_api, {useAsyncHook} from '../../mongo/paths.component'
import { Grid } from 'semantic-ui-react'

const make_courses_option = (arr_of_courses) => {
    // let local_courses = courses
    if (arr_of_courses && arr_of_courses!==undefined){
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

export default function RequestHours(props){
    const [selectedCourse, setSelectedCourse] = useState(null)
    const [courses_options, loading] = useAsyncHook(`courses`, make_courses_option);
    const [hours, setHours] = useState(null)
    
    const sendCourse = (_id) => {
        console.log("in sendCourse");
        const course_id = selectedCourse.split('-')[0]
        const course_name = selectedCourse.split('-')[1]
        console.log(course_name);
        console.log(course_id);

        axios.post(get_mongo_api(`students/add/request/${_id}`),{course_id : course_id,course_name:course_name, number_of_hours: hours,  status : "waiting"}).then(response=>{
            if (response.data.success) {
                console.log('reloading');
                alert(response.data.message)
                window.location.reload(true)
            } else {
                console.log('false');
                console.log(response.data.message)
            }
        })
        

    }
    
    return (
        !loading && 
        <Grid columns={1} style={{ margin:"10%", minHeight:"20%"}} >
            <Grid.Row >
                <Dropdown  fluid placeholder='בחר קורס' onChange={(e,{value})=> setSelectedCourse(value)} options={courses_options}/>
            </Grid.Row>
            <Grid.Row>
                <Dropdown  placeholder='מספר שעות' onChange={(e,{value})=>setHours(value)} options={get_options(4)}/>
            </Grid.Row>
            {selectedCourse && hours && <Grid.Row>
                <Button onClick={()=>{sendCourse(props._id); console.log('clicked');}}>שלח</Button>
            </Grid.Row>}
        </Grid>
    )
}