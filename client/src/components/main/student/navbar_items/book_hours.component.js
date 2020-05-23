import React, { useState, useEffect } from 'react';
import axios from 'axios'
import { Dropdown } from 'semantic-ui-react'
import get_mongo_api, { useAsyncHook } from '../../../mongo/paths.component'
import { Calendar } from '../../utils/calendar/calendar';

// set up Calendar functions
var HOURS_AVAILABLE_GLOBAL = {};

const get_hours_available_to_book = async (data) => {
    return await axios.post(get_mongo_api(`students/availableHours`), data).then((response => {
        return response;
    }))
}

const hasNull = (target) => {
    for (var member in target) {
        if (target[member] == null)
            return true;
    }
    return false;
}

const make_available_hours_list = (arr_of_dates, setNoAvailableDates, studentID, lessons) => {
    var dates = {};
    if (arr_of_dates && arr_of_dates !== undefined && arr_of_dates.length > 0) {
        let hours = [];
        arr_of_dates.forEach(dates_per_teacher => {
            if (dates_per_teacher.teacher_id !== studentID) {
                var teacher_name = dates_per_teacher.teacher_name;
                var teacher_id = dates_per_teacher.teacher_id;
                let hours_per_teacher = dates_per_teacher.hours_available.map(hour_available => {
                    var today = Date.now();
                    var date = hour_available.slice(0, -1)
                    var newDate = new Date(date);
                    if (today < newDate) {
                        return (
                            {
                                date: [newDate],
                                text: teacher_name,
                                id: teacher_id
                            }
                        )
                    }
                    else {
                        return null;
                    }
                })
                hours_per_teacher.forEach(hour => {
                    hours.push(hour);
                });
            } else { }

        })
        var all_hours = [];

        if (lessons && lessons !== undefined && lessons.length > 0) {
            all_hours = set_lessons(lessons, hours);
        }
        else {
            all_hours = hours;
        }
        dates = arrange_hours_array(all_hours, setNoAvailableDates);
    }
    return dates;
}

const set_lessons = (lessons, array) => {
    let hours_of_lessons = lessons.map(lesson => {
        var today = Date.now();
        var date = lesson.date.slice(0, -1)
        var newDate = new Date(date);
        if (today < newDate) {
            return (
                {
                    date: [newDate],
                    text: 'שיעור שלי',
                    id: 'שיעור'
                }
            )
        }
        else {
            return null;
        }
    })
    hours_of_lessons.forEach(hour => {
        array.push(hour);
    });
    return array;
}

const arrange_hours_array = (hours, setNoAvailableDates) => {
    var dates = {};
    var filtered_hours = hours.filter(function (el) {
        return el != null;
    });
    if (filtered_hours && filtered_hours.length > 0 && !hasNull(filtered_hours)) {
        for (var x = 0; x < filtered_hours.length; x++) {
            var teacher_name = filtered_hours[x].text;
            var teacher_id = filtered_hours[x].id;
            var teacher = { teacher_id: teacher_id, teacher_name: teacher_name }
            dates[filtered_hours[x].date] = teacher;
        };
        setNoAvailableDates(false)
    }
    else {
        setNoAvailableDates(true)
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

const set_available_hours = (selectedCourse, setHoursOptions, setNoAvailableDates, studentID, lessons) => {
    get_available_hours_list(selectedCourse).then((dates) => {
        if (dates) {
            HOURS_AVAILABLE_GLOBAL = { ...make_available_hours_list(dates, setNoAvailableDates, studentID, lessons) };
            setHoursOptions(HOURS_AVAILABLE_GLOBAL);
        } else {
            console.log(dates);
        }
    })
}

//after click choose lesson functions

const delete_hours_from_teacher = async (lessonHour) => {
    var teacherSelectedID = Object.values(lessonHour)[1].teacher_id;
    var hour = Object.values(lessonHour)[0] + "Z";
    var hours = [];
    hours.push(hour);
    var data = { hours_available: hours }
    return await axios.post(get_mongo_api(`teachers/delete/hoursAvailable/${teacherSelectedID}`), data).then((response => {
        if (response.data.success) {
        }
        else {
            console.log('teachers/delete/hoursAvailable failure message', response.data.success);
        }
        return response.data.success;
    }))
}

const add_lesson_to_student = async (id, courseID) => {
    var data = { course_id: courseID }
    return await axios.post(get_mongo_api(`students/update/newLessons/${id}`), data).then((response => {
        if (response.data.success) {
        }
        else {
            console.log('teachers/delete/hoursAvailable failure message', response.data.success);
        }
        return response.data;
    }))
}

const add_lesson = async (eachDateSelected, selectedCourseID, student) => {
    const course = student.courses.find(course => course.course_id === selectedCourseID);
    var courseSelected = { course_id: selectedCourseID, course_name: course.course_name };
    var teacherSelected = Object.values(eachDateSelected)[1];
    var onlyDateSelected = Object.values(eachDateSelected)[0] + "Z";
    var thisStudent = { student_id: student._id, student_name: student.name }
    var data = {
        course: courseSelected,
        date: onlyDateSelected,
        teacher: teacherSelected,
        student: thisStudent,
        status: "waiting"
    }
    return await axios.post(get_mongo_api(`lessons/add/`), data).then((response => {
        if (response.data.success) {
        }
        else {
            console.log('lessons/add failure message', response.data.message);
        }
        return response.data;
    }))
}

const make_courses_option = (arr_of_courses) => {
    if (arr_of_courses && Array.isArray(arr_of_courses) && arr_of_courses.length > 0) {
        let options = arr_of_courses.map(course_obj => {
            var number = parseInt(course_obj.hours_able_to_book);
            if (number > 0) {
                return (
                    {
                        key: course_obj.course_id,
                        value: course_obj.course_id,
                        text: course_obj.course_name
                    }
                )
            }
            else { return null; }
        })
        var filtered_options = options.filter(function (el) {
            return el != null;
        });
        return filtered_options;
    }
}


//still needs to think about 2 teachers at the same time
export default function BookHours({ _id, selectedCourseID, setSelectedCourse, hours_options, setHoursOptions, student, lessons }) {
    const [courses_options, loading2] = useAsyncHook(`students/${_id}/courses`, make_courses_option);
    const [isTeacher] = useState(false);
    const [no_available_dates, setNoAvailableDates] = useState(true);

    const sendHours = (dateSelected) => {
        if (dateSelected !== undefined && dateSelected && selectedCourseID) {
            var trueReturnValueCounter = 0;
            var data = { course_id: selectedCourseID, student_id: _id };
            get_hours_available_to_book(data).then((get_hours_available_to_book_response) => {
                if (get_hours_available_to_book_response.data.success) {
                    if (get_hours_available_to_book_response.data.message >= Object.entries(dateSelected).length) {
                        Object.entries(dateSelected).forEach(oneDateSelected => {
                            add_lesson(oneDateSelected, selectedCourseID, student).then((add_lesson_response) => {
                                if (add_lesson_response.success) {
                                    add_lesson_to_student(_id, selectedCourseID).then((add_lesson_to_student) => {
                                        if (add_lesson_to_student.success) {
                                            delete_hours_from_teacher(oneDateSelected).then((delete_hours_success) => {
                                                if (delete_hours_success) {
                                                    trueReturnValueCounter++;
                                                    if (trueReturnValueCounter === Object.entries(dateSelected).length) {
                                                        trueReturnValueCounter === 1 ? alert('השיעור נוסף בהצלחה') : alert(trueReturnValueCounter + 'השיעורים נוספו בהצלחה ');
                                                        window.location.reload(true);
                                                    }
                                                    else {
                                                        console.log('problem in delete_hours_from_teacher', trueReturnValueCounter);
                                                    }
                                                } else {
                                                    console.log('problem in delete_hours_from_teacher', delete_hours_success);
                                                }
                                            })
                                        } else {
                                            console.log('problem in add_lesson_to_student', add_lesson_to_student.message);
                                        }
                                    })
                                } else {
                                    console.log('problem in add_lesson', add_lesson_response.message);
                                    alert(add_lesson_response.message);
                                }
                            })
                        });
                    } else {
                        alert('אין באפשרותך לבחור יותר ממספר שעות החונכות שנותרו לך לקבוע');
                    }
                } else {
                    console.log('problem in get_hours_available_to_book', get_hours_available_to_book_response.data.message);
                }
            })
        }
    }

    useEffect(() => {
        if (selectedCourseID && selectedCourseID !== null) {
            setSelectedCourse(selectedCourseID);
            set_available_hours(selectedCourseID, setHoursOptions, setNoAvailableDates, _id, lessons);
        }
        else {
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedCourseID, _id, lessons]);

    return (
        (!loading2 && courses_options && courses_options.length > 0) ?
            <div className="studentCalendar">
                <Dropdown direction="right" placeholder='בחר קורס' defaultValue={selectedCourseID} scrolling search selection options={courses_options} onChange={(e, { value }) => { setSelectedCourse(value) }} />
                {(selectedCourseID && selectedCourseID !== null) ?
                    (hours_options && !no_available_dates) ?
                        <Calendar
                            isTeacher={isTeacher}
                            datesDict={hours_options}
                            confirmHandler={(dateSelected) => sendHours(dateSelected)} />
                        : <div> <label>  לא קיימות שעות חונכות פנויות עבור קורס זה </label> </div>
                    : <div> <label>  יש לבחור קורס  </label> </div>}
            </div>
            : 'אין אפשרות לקבוע שעת חונכות כי לא נותרו לך שעות חונכות במערכת'
    )
}
