import React, { useState } from 'react';
import axios from 'axios'
import { Dropdown } from 'semantic-ui-react'
import get_mongo_api, { useAsyncHook } from '../../mongo/paths.component'
import { Calendar } from '../utils/calendar/calendar';

var HOURS_AVAILABLE_GLOBAL = {};

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

function hasNull(target) {
    for (var member in target) {
        if (target[member] == null)
            return true;
    }
    return false;
}

const make_available_hours_list = (arr_of_dates, setNoAvailableDates) => {
    var dates = {};
    if (arr_of_dates && arr_of_dates !== undefined && arr_of_dates.length > 0) {
        arr_of_dates.forEach(dates_per_teacher => {
            var teacher_name = dates_per_teacher.teacher_name;
            var teacher_id = dates_per_teacher.teacher_id;
            let hours = dates_per_teacher.hours_available.map(hour_available => {
                var today = Date.now();
                var date = new Date(hour_available);
                if (today < date) {
                    var singleDate = hour_available.split("T");
                    var dateFormat = singleDate[0].replace("-", " ")
                    var singleHour = singleDate[1].slice(0, 5);
                    return (
                        {
                            date: [new Date(dateFormat + " " + singleHour)],
                            text: teacher_name,
                            id: teacher_id
                        }
                    )
                }
                else {
                    return null;
                }
            })
            // console.log(hours);
            if (hours && hours.length > 0 && !hasNull(hours)) {
                for (var x = 0; x < hours.length; x++) {
                    teacher_name = hours[x].text;
                    teacher_id = hours[x].id;
                    var teacher = { teacher_id: teacher_id, teacher_name: teacher_name }
                    dates[hours[x].date] = teacher;
                };
                setNoAvailableDates(false)
            }
            else {
                setNoAvailableDates(true)
            }
        })
    }
    return dates;
}

function get_available_hours_list(selectedCourse) {
    if (selectedCourse) {
        return axios.get(get_mongo_api(`teachers/${selectedCourse}/hoursAvailable/allTeachers`)).then(response => {
            if (response.data.success) {
                return response.data.message;
            }
            else {
                console.log(response.data.message);
                return response.data.message;
            }
        });
    }
}

const set_available_hours = (selectedCourse, setHoursOptions, setNoAvailableDates) => {
    get_available_hours_list(selectedCourse).then((dates) => {
        if (dates) {
            HOURS_AVAILABLE_GLOBAL = { ...make_available_hours_list(dates, setNoAvailableDates) };
            setHoursOptions(HOURS_AVAILABLE_GLOBAL);
        } else {
            console.log(dates);
        }
    })
}

//still needs to think about 2 teachers on the same hour&date
export default function BookHours({ _id, selectedCourse, setSelectedCourse, hours_options, setHoursOptions, student }) {
    const [courses_options, loading] = useAsyncHook(`students/${_id}/courses`, make_courses_option);
    const [isTeacher] = useState(false);
    const [no_available_dates, setNoAvailableDates] = useState(true);

    const sendHours = (dateSelected) => {
        if (dateSelected !== undefined && dateSelected && selectedCourse) {
            // console.log(dateSelected);
            Object.entries(dateSelected).forEach(oneDateSelected => {
                // console.log(oneDateSelected);
                const course = student.courses.find(course => course.course_id === selectedCourse);
                var courseSelected = { course_id: selectedCourse, course_name: course.course_name };
                var teacherSelected = Object.values(oneDateSelected)[1];
                var onlyDateSelected = Object.values(oneDateSelected)[0] + "Z";
                var thisStudent = { student_id: _id, student_name: student.name }
                // console.log(courseSelected)
                // console.log(onlyDateSelected)
                // console.log(thisStudent)
                // console.log(teacherSelected)
                var data = { course: courseSelected, date: onlyDateSelected, teacher: teacherSelected, student: thisStudent, status: "waiting" }
                axios.post(get_mongo_api(`lessons/add/`), data).then(response => {
                    if (!response.data.success) {
                        console.log(response.data.message)
                        alert(response.data.message)
                    } else {
                        // deleteHoursFromTeacher(teacherSelected.teacher_id, onlyDateSelected).then((response) => {
                            if (response.data.success) {
                                console.log(response.data.message)
                                alert(response.data.message)
                                window.location.reload(true)
                            } else {
                                console.log(response.data.message)
                                alert(response.data.message)
                            }
                        // })
                    }
                })
            })
        }
    }

    const deleteHoursFromTeacher = async (_id, lessonHour) => {
        console.log(lessonHour);
        // return await axios.post(get_mongo_api(`teachers/delete/hoursAvailable/${_id}`), { hours_available: lessonHour }).then((response => {
        //     if (response.data.success) {
        //         console.log(response.data.message);
        //         // alert(response.data.message)
        //         return response.data.message;
        //     }
        //     else {
        //         console.log(response.data.success);
        //         // alert(response.data.message)
        //     }
        // }))
    }


    return (
        (!loading && courses_options) ?
            <div className="studentCalendar">
                <Dropdown direction="right" placeholder='בחר קורס' scrolling search selection options={courses_options} onChange={(e, { value }) => { setSelectedCourse(value); set_available_hours(value, setHoursOptions, setNoAvailableDates); }} />
                {selectedCourse ?
                    <>
                        {hours_options && !no_available_dates ?
                            <Calendar
                                isTeacher={isTeacher}
                                datesDict={hours_options}
                                confirmHandler={(dateSelected) => sendHours(dateSelected)} />
                            :
                            <div> <label>  לא קיימות שעות חונכות פנויות עבור קורס זה </label> </div>}
                    </> : null}
            </div> : 'אין אפשרות לקבוע שעת חונכות כי לא קיימים עבורך קורסים במערכת'
    )
}
