import React, {useState} from 'react';
import {Button, Dropdown} from 'semantic-ui-react'
import axios from 'axios'
import get_mongo_api, {useAsyncHook} from '../../mongo/paths.component'
import { Grid } from 'semantic-ui-react'

const make_courses_option = (arr_of_courses) => {
    // let local_courses = courses
    if (arr_of_courses!==null){
        let options = arr_of_courses.map(course_obj => {
            return (
                {
                    key : course_obj._id,
                    value : `${course_obj._id} ${course_obj.name}`,
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

export default function RequestHours(_id){
    // const [courses, setCourses] = useState(null)
    const [selectedCourse, setSelectedCourse] = useState(null)
    const [result, loading] = useAsyncHook(`courses`, make_courses_option);
    const [hours, setHours] = useState(null)

    const sendCourse = () => {
        axios.post(get_mongo_api(`students/add/request/${_id}`),{course_id : selectedCourse, number_of_hours: hours, status : "waiting"}).then(response=>{
            if (response.data.success) {
                alert(response.data.message)
            } else {
                console.log('false');
                console.log(response.data.message)
            }
        })
        // console.log(selectedCourse, hours);
    }
    
    const onChangeCourse = (e,{value}) => {
        value = value.split(' ')[0]
        setSelectedCourse(value)
    }

    const onChangeHours = (e,{value}) => {
        // console.log("selected= ", value)
        setHours(value)
    }


    return (
        !loading && 
        <Grid columns={1} style={{ margin:"10%", minHeight:"20%"}} >
            <Grid.Row >
                <Dropdown  fluid placeholder='בחר קורס' onChange={onChangeCourse} options={result}/>
            </Grid.Row>
            <Grid.Row>
                <Dropdown  placeholder='מספר שעות' onChange={onChangeHours} options={get_options(4)}/>
            </Grid.Row>
            {selectedCourse && hours && <Grid.Row>
                <Button onClick={sendCourse}>שלח</Button>
            </Grid.Row>}
        </Grid>
    )
}