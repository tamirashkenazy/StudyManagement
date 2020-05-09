import React, { useState } from 'react';
import axios from 'axios'
import { Dropdown } from 'semantic-ui-react'
import get_mongo_api, { useAsyncHook } from '../../mongo/paths.component'
import { Calendar } from '../utils/calendar/calendar';

var HOURS_AVAILABLE_GLOBAL = null;
var ARR_OF_HOURS = [];
var HOURS = {};

const make_courses_option = (arr_of_courses) => {
    if (arr_of_courses && arr_of_courses !== undefined && arr_of_courses.length > 0) {
        let options = arr_of_courses.map(course_obj => {
            return (
                {
                    key: course_obj.course_id,
                    value: course_obj.course_id,
                    text: course_obj.course_name
                }
            )
        })
        return options
    }
}

const make_available_hours_list = (arr_of_hours) => {
    var dates = {};
    if (arr_of_hours && arr_of_hours !== undefined && arr_of_hours.length > 0) {
        arr_of_hours.forEach(datesArr => {
            let hours = datesArr.hours_available.map(hour_available => {
                var singleDate = hour_available.split("T");
                var singleHour = singleDate[1].slice(0, 5);
                return (
                    {
                        date: [new Date(singleDate[0] + "" + singleHour)],
                        text: datesArr.teacher_name,
                        id: datesArr.teacher_id
                    }
                )
            })
            for (var x = 0; x < hours.length; x++) {
                dates[hours[x].date] = hours[x].text;
                HOURS[hours[x].date] = hours[x].id;
            };
        })
    }
    // console.log(dates);
    // console.log(HOURS);
    return dates;
}

function get_available_hours_list(selectedCourse) {
    if (selectedCourse) {
        return axios.get(get_mongo_api(`teachers/${selectedCourse}/hoursAvailable/allTeachers`)).then(response => {
            // console.log('hours available response:' + response.data.unique);
            if (response.data.success) {
                ARR_OF_HOURS = response.data.message;
            }
            else {
                console.log(response.data.message);
            }
        });
    }
}

const set_available_hours = (selectedCourse) => {
    get_available_hours_list(selectedCourse).then((returnVal) => {
        HOURS_AVAILABLE_GLOBAL = make_available_hours_list(ARR_OF_HOURS);
        // console.log(HOURS_AVAILABLE_GLOBAL);
    })
}

//still needs to think about 2 teachers on the same hour&date
export default function BookHours(props) {
    const [selectedCourse, setSelectedCourse] = useState(null)
    const [courses_options, loading] = useAsyncHook(`students/${props._id}/courses`, make_courses_option);
    const [isTeacher] = useState(false);

    const sendHours = (dateSelected) => {
        if (dateSelected!==undefined && dateSelected && selectedCourse) {
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
        // console.log(dateSelected,selectedCourse);
        }
        // }
    }

    return (
        !loading &&
        <div className="studentCalendar">
            <Dropdown direction="right" placeholder='בחר קורס' scrolling search selection onChange={(e, { value }) => {setSelectedCourse(value); set_available_hours(value)}} options={courses_options} />
            {/* {console.log(HOURS_AVAILABLE_GLOBAL)} */}
            {HOURS_AVAILABLE_GLOBAL ?
                <Calendar
                    isTeacher={isTeacher}
                    datesDict={HOURS_AVAILABLE_GLOBAL}
                    confirmHandler={(dateSelected) => sendHours(dateSelected)} />
                : null}
        </div>
    )
} 
