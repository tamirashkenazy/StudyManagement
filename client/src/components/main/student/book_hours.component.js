import React, { useState } from 'react';
import axios from 'axios'
import {Dropdown} from 'semantic-ui-react'
import get_mongo_api, {useAsyncHook} from '../../mongo/paths.component'
import { Calendar } from '../utils/calendar/calendar';

//Michael
//lessons is not CORRECT => lessons is already linked to a student..
//needs to have another function that by courseId finds all teachers and returns each one availability hours

const make_courses_option = (arr_of_courses) => {
    if (arr_of_courses && arr_of_courses!==undefined && arr_of_courses.length > 0){
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

//still needs to think about 2 teachers on the same hour&date
export default function BookHours(props) {
    const [selectedCourse, setSelectedCourse] = useState(null)
    const [courses_options, loading] = useAsyncHook(`courses`, make_courses_option);
    // const [lessons_options, loading] = useAsyncHook(`lessons/byCourseId/${selectedCourse.split('-')[0]}`, make_lessons_option);


    const bookHours = (dateSelected) => {
        // if (dateSelected.length > 0) {
            // console.log(selectedCourse, selectedTeacher, selectedDate, props.id)
            // axios.post(get_mongo_api(`lessons/add/`), { course: selectedCourse, date: dateSelected, teacher: teacherSelected, student: thisStudent, status: "new" }).then(response => {
            //     if (!response.data.success) {
            //         console.log(response.data.message)
            //         console.log(selectedCourse, selectedTeacher, selectedDate, id)
            //     } else {
            //         alert(response.data.message)
            //         console.log(selectedCourse, selectedTeacher, selectedDate, id)
            //         window.location.reload(true)
            //     }
            // })
            console.log(dateSelected);
        // }
    }

    const [isTeacher, setIsTeacher] = useState(false);

    //get Dates saved as availability in teacher (Michael func). For example: 
    //needs to do ForEach on lessons_optins and convert them to this formet
    const datesDict = {
        [new Date('2020-04-22 12:00')]: 'פנוי',
        [new Date('2020-04-24 13:00')]: 'פנוי',
        [new Date('2020-04-25 18:00')]: 'פנוי',
    }

    return (
        !loading &&
        <div className="studentCalendar">
            <Dropdown fluid placeholder='בחר קורס' onChange={(e, { value }) => setSelectedCourse(value)} options={courses_options} />

            <Calendar
                isTeacher={isTeacher}
                datesDict={datesDict}
                confirmHandler={(dateSelected) => bookHours(dateSelected)} />
        </div>
    )
} 