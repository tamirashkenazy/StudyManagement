import React, { useState, useEffect } from 'react';
import axios from 'axios'
import { Dropdown } from 'semantic-ui-react'
import get_mongo_api, { useAsyncHook } from '../../../mongo/paths.component'
import { Calendar } from '../../utils/calendar/calendar';

// set up Calendar functions
var HOURS_AVAILABLE_GLOBAL = {};

const get_hours_available_to_book = async (data, id) => {
    let response = await axios.post(get_mongo_api(`students/${id}/hoursToBook/`), data);
    if  (response.data.success) {
        let get_hours_available_to_book_response = response.data;
        return get_hours_available_to_book_response;
    }else{
        return null
    }
}

const hasNull = (target) => {
    for (var member in target) {
        if (target[member] == null)
            return true;
    }
    return false;
}

const make_available_hours_list_per_teacher = (teacherName, teacherId, arr_of_hours, lessons) => {
    if (arr_of_hours && arr_of_hours !== undefined && Array.isArray(arr_of_hours) && arr_of_hours.length > 0) {
        let selectedTeacher = arr_of_hours.filter(dates_per_teacher => dates_per_teacher.teacher_id === teacherId);
        let hours_per_teacher = selectedTeacher[0].hours_available.map(hour_available => {
            var date = hour_available.date.slice(0, -1)
            var newDate = new Date(date);
            var today = Date.now();
            var teacher_count = hour_available.left_hours;
            if (today < newDate) {
                return (
                    {
                        date: [newDate],
                        text: teacherName,
                        id: teacherId,
                        count: teacher_count
                    }
                )
            }
            else {
                return null;
            }

        })
        var dates = {};
        var all_hours = [];
        if (lessons && lessons !== undefined && Array.isArray(lessons) && lessons.length > 0) {
            all_hours = set_lessons(lessons, hours_per_teacher);
        }
        else {
            all_hours = hours_per_teacher;
        }
        var filtered_hours = all_hours.filter(function (el) {
            return el != null;
        });
        for (var x = 0; x < filtered_hours.length; x++) {
            var teacher_name = filtered_hours[x].text;
            var teacher_id = filtered_hours[x].id;
            var teacher_count = filtered_hours[x].count;
            var teacher = { teacher_id: teacher_id, teacher_name: teacher_name, teacher_count: teacher_count }
            dates[filtered_hours[x].date] = teacher;
        };
    }
    return dates;
}

const make_available_hours_list = (arr_of_dates, setNoAvailableDates, studentID, lessons, setTeachers) => {
    var dates = {};
    var teachers = [];
    var allTeachers = { key: 0, value: "", text: "כל המורים" }
    teachers.push(allTeachers);
    if (arr_of_dates && arr_of_dates !== undefined && Array.isArray(arr_of_dates) && arr_of_dates.length > 0) {
        let hours = [];
        arr_of_dates.forEach(dates_per_teacher => {
            if (dates_per_teacher.teacher_id !== studentID) {
                var teacher_name = dates_per_teacher.teacher_name;
                var teacher_id = dates_per_teacher.teacher_id;
                var teacher_value = teacher_id + " " + teacher_name;
                var teacher = { key: teacher_id, value: teacher_value, text: teacher_name };
                let hours_per_teacher = dates_per_teacher.hours_available.map(hour_available => {
                    var today = Date.now();
                    var date = hour_available.date.slice(0, -1)
                    var newDate = new Date(date);
                    var teacher_count = hour_available.left_hours; 
                    if (today < newDate) {
                        const result = teachers.find(({ key }) => key === teacher_id);
                        if (!result) {
                            teachers.push(teacher);
                        }
                        return (
                            {
                                date: [newDate],
                                text: teacher_name,
                                id: teacher_id,
                                count: teacher_count
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

        if (lessons && lessons !== undefined && Array.isArray(lessons) && lessons.length > 0) {
            all_hours = set_lessons(lessons, hours);
        }
        else {
            all_hours = hours;
        }
        dates = arrange_hours_array(all_hours, setNoAvailableDates);
    }
    setTeachers(teachers);
    return dates;
}

const set_lessons = (lessons, array) => {
    let hours_of_lessons = lessons.map(lesson => {
        var today = Date.now();
        var date = lesson.date.slice(0, -1)
        var newDate = new Date(date);
        if (today < newDate && lesson.status !== "canceled") {
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
    if (filtered_hours && Array.isArray(filtered_hours) && filtered_hours.length > 0 && !hasNull(filtered_hours)) {
        for (var x = 0; x < filtered_hours.length; x++) {
            var teacher_name = filtered_hours[x].text;
            var teacher_id = filtered_hours[x].id;
            var teacher_count = filtered_hours[x].count;
            var teacher = { teacher_id: teacher_id, teacher_name: teacher_name, teacher_count: teacher_count }
            dates[filtered_hours[x].date] = teacher;
        };
        setNoAvailableDates(false)
    }
    else {
        setNoAvailableDates(true)
    }
    return dates;
}

async function get_available_hours_list(selectedCourse) {
    if (selectedCourse) {
        let response = await axios.get(get_mongo_api(`teachers/hoursAvailable/allTeachers/${selectedCourse}`));
        if (response.data.success) {
            let get_available_hours_list = response.data.message;
            return get_available_hours_list;
        } else {
            return null
        }

    }
}

// async function get_available_hours_list_per_teacher(teacherID) {
//     if (teacherID) {
//         let response = await axios.get(get_mongo_api(`teachers/hoursAvailable/byID/${teacherID}`));
//         if (response.data.success) {
//             let get_available_hours_list_per_teacher = response.data.message;
//             return get_available_hours_list_per_teacher;
//         } else {
//             return null
//         }

//     }
// }

const set_available_hours = (selectedCourse, setHoursOptions, setNoAvailableDates, studentID, lessons, setTeachers, setDates) => {
    get_available_hours_list(selectedCourse).then((dates) => {
        if (dates) {
            setDates(dates);
            HOURS_AVAILABLE_GLOBAL = make_available_hours_list(dates, setNoAvailableDates, studentID, lessons, setTeachers);
            setHoursOptions(HOURS_AVAILABLE_GLOBAL);
        }
    })
}

const set_available_hours_per_teacher = (teacher, setHoursOptions, lessons, dates) => {
    HOURS_AVAILABLE_GLOBAL = {};
    var teacherSep = teacher.split(' ');
    var teacher_id = teacherSep[0];
    var teacher_name = String(teacherSep[1] + " " + teacherSep[2]);
    HOURS_AVAILABLE_GLOBAL = make_available_hours_list_per_teacher(teacher_name, teacher_id, dates, lessons);
    setHoursOptions(HOURS_AVAILABLE_GLOBAL);
}

//after click choose lesson functions

const delete_hours_from_teacher = async (lessonHours) => {
    let data = [];
    let arr_of_dates = Object.entries(lessonHours).map((date_string) => {
        let teacher_id = date_string[1].teacher_id;
        let hour = date_string[0] + "Z";
        var oneObject = { teacher_id: teacher_id, hour_available: hour }
        return oneObject
    })

    arr_of_dates.forEach(date => {
        const result = data.find(({ teacher_id }) => teacher_id === date.teacher_id);
        if (result) {
            const index = data.indexOf(result);
            if (index > -1) {
                let oldHour = result.hours_available;
                let newHours = [];
                newHours.push(oldHour);
                newHours.push(date.hour_available);
                var merged = [].concat.apply([], newHours);
                let rebuiltData = { teacher_id: result.teacher_id, hours_available: merged }
                data.splice(index, 1)
                data.push(rebuiltData)
            }
        } else {
            let newData = { teacher_id: date.teacher_id, hours_available: [date.hour_available] }
            data.push(newData)
        }
    });

    let response = await axios.post(get_mongo_api(`teachers/update/addlessons`), data);
    let delete_hours_response = response.data;
    return delete_hours_response;
}

const add_lesson_to_student = async (studentID, courseID, lessonsNumber) => {
    var data = { course_id: courseID, number_of_hours: lessonsNumber }
    let response = await axios.post(get_mongo_api(`students/update/newLessons/${studentID}`), data);
    let add_lesson_to_student_response = response.data;
    return add_lesson_to_student_response;
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
    let response = await axios.post(get_mongo_api(`lessons/add/`), data);
    let add_lesson_response = response.data;
    return add_lesson_response;
}

//dropdown selection

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

export default function BookHours({ _id, selectedCourseID, setSelectedCourse, hours_options, setHoursOptions, student, lessons }) {
    const [courses_options, loading2] = useAsyncHook(`students/${_id}/courses`, make_courses_option);
    const [isTeacher] = useState(false);
    const [no_available_dates, setNoAvailableDates] = useState(true);
    const [maxNumber, setMaxNumber] = useState(0);
    const [teacherFilter, setTeacherFilter] = useState("");
    const [teachers, setTeachers] = useState([]);
    const [datesAllTeachers, setDates] = useState([]);
    
    const sendHours = (dateSelected) => {
        if (dateSelected !== undefined && dateSelected && selectedCourseID) {
            var trueReturnValueCounter = 0;
            var data = { course_id: selectedCourseID };
            get_hours_available_to_book(data, _id).then((get_hours_available_to_book_response) => {
                if (get_hours_available_to_book_response.success) {
                    let allowedNumber = get_hours_available_to_book_response.message;
                    let selectedDatesNumber = Object.entries(dateSelected).length;
                    if (allowedNumber >= selectedDatesNumber) {
                        delete_hours_from_teacher(dateSelected).then((delete_hours_response) => {
                            if (delete_hours_response.success) {
                                add_lesson_to_student(_id, selectedCourseID, selectedDatesNumber).then((add_lesson_to_student_response) => {
                                    if (add_lesson_to_student_response.success) {
                                        Object.entries(dateSelected).forEach(oneDateSelected => {
                                            add_lesson(oneDateSelected, selectedCourseID, student).then((add_lesson_response) => {
                                                if (add_lesson_response.success) {
                                                    trueReturnValueCounter++;
                                                    if (trueReturnValueCounter === selectedDatesNumber) {
                                                        trueReturnValueCounter === 1 ? alert('השיעור נוסף בהצלחה') : alert(trueReturnValueCounter + ' השיעורים נוספו בהצלחה ');
                                                        window.location.reload(true);
                                                    }
                                                    else { }
                                                } else {
                                                    var teacherSelected = Object.values(oneDateSelected)[1];
                                                    var onlyDateSelected = Object.values(oneDateSelected)[0];
                                                    var date = new Date(onlyDateSelected);
                                                    alert(" לא נקבע לך שיעור עם " + teacherSelected + " ב" + date + " \n כי " + add_lesson_response.message);
                                                    window.location.reload(true);
                                                }
                                            })
                                        })
                                    } else {
                                        alert(add_lesson_to_student_response.message + "ולכן לא נקבע אף שיעור");
                                        window.location.reload(true);
                                    }
                                })
                            } else {
                                alert(delete_hours_response.message + "ולכן לא נקבע אף שיעור");
                                window.location.reload(true);
                            }
                        });
                    } else {
                        alert('אין באפשרותך לבחור יותר ממספר שעות החונכות שנותרו לך לקבוע');
                    }
                } else {
                    alert(get_hours_available_to_book_response.message + "ולכן לא נקבע אף שיעור");
                    window.location.reload(true);
                }
            })
        }
    }

    useEffect(() => {
        if (selectedCourseID && selectedCourseID !== null) {
            setSelectedCourse(selectedCourseID);
            if (teacherFilter === "" || teacherFilter === null) {
                set_available_hours(selectedCourseID, setHoursOptions, setNoAvailableDates, _id, lessons, setTeachers,setDates);
            }
            else {
                set_available_hours_per_teacher(teacherFilter, setHoursOptions, lessons, datesAllTeachers);
            }
            var data = { course_id: selectedCourseID };
            get_hours_available_to_book(data, _id).then((get_hours_available_to_book_response) => {
                if (get_hours_available_to_book_response.success) {
                    setMaxNumber(get_hours_available_to_book_response.message);
                }
            })
        }
        else {
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedCourseID, _id, lessons, teacherFilter]);

    return (
        (!loading2 && courses_options && Array.isArray(courses_options) && courses_options.length > 0) ?
            <div className="studentCalendar"  >
                <Dropdown direction="right" placeholder='בחר קורס' defaultValue={selectedCourseID} scrolling search selection options={courses_options} onChange={(e, { value }) => { setSelectedCourse(value) }} />
                {(selectedCourseID && selectedCourseID !== null) ?
                    hours_options ?
                        !no_available_dates ?
                            <>
                                <Dropdown
                                    style={{ marginRight: "2rem" }}
                                    placeholder='סינון לפי מורה'
                                    scrolling search selection
                                    options={teachers}
                                    onChange={(e, { value }) => { setTeacherFilter(value) }}
                                />
                                 <div> <label>  בקורס זה נותרו לך לבחור {maxNumber} שעות </label> </div>
                                <Calendar
                                    isTeacher={isTeacher}
                                    datesDict={hours_options}
                                    maxNumber={maxNumber}
                                    confirmHandler={(dateSelected) => sendHours(dateSelected)} /> </>
                            : <div> <label>  לא קיימות שעות חונכות פנויות עבור קורס זה </label> </div>
                        : <div> <label>  טוען מידע  </label> </div>
                    : <div> <label>  יש לבחור קורס  </label> </div>}
            </div>
            : <div> <label>  אין אפשרות לקבוע שעת חונכות כי לא אושרו/נותרו לך שעות חונכות במערכת  </label> </div>
    )
}
