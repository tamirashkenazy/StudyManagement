import React from 'react';
import GenericTable from '../../utils/generic_table.component'
import Button from '@material-ui/core/Button';
import axios from 'axios'
import get_mongo_api from '../../../mongo/paths.component'
import { useAsyncHook } from '../../../mongo/paths.component'
import Tooltip from 'react-bootstrap/Tooltip'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import '../../../../styles/tooltip.scss';

const status_to_hebrew = {
    "cancel": { text: "בטל", color: "secondary" },
    "report": { text: "דווח", color: "primary" },
    "done": { text: "בוצע", color: "default" },
    "waiting": { text: "ממתין", color: "default" },
    "canceled": { text: "בוטל", color: "secondary" },
    "happening": { text: "מתקיים", color: "primary" }
}
function renderTooltip(tooltipText) {
    return (
        <Tooltip id="button-tooltip" className="my-tooltip" style={{ backgroundColor: "#fff" }}>
            ניתן לבטל שיעור עד  {tooltipText} שעות לפני שהתחיל
        </Tooltip>
    );
}

const getUser = async (_id) => {
    return await axios.get(get_mongo_api(`users/${_id}`)).then((response => {
        if (response.data.success) {
            return response.data.message;
        }
        else {
            return false;
        }
    }))
}

const getTeacher = async (_id) => {
    return await axios.get(get_mongo_api(`teachers/byID/${_id}`)).then((response => {
        if (response.data.success) {
            return response.data.message;
        }
        else {
            return false;
        }
    }))
}

const update_teacher_and_user = async (func1, func2) => {
    return axios.all([func1, func2]).then(axios.spread((...responses) => {
        const responseOne = responses[0]
        const responseTwo = responses[1]
        if (responseOne && responseTwo) {
            return [responseOne, responseTwo];
        }
        else if (responseOne || responseTwo) {
            console.log('responseOne', responseOne);
            console.log('responseTwo', responseTwo);
            return false;
        }
        else {
            console.log('responseOne && responseTwo = false');
            return false;
        }
    })).catch(errors => {
        console.log('errors in update_teacher_and_student', errors);
    })
}

const onClickUser = (selectedTeacherID, setCardOpen, setUser, setTeacher) => {
    update_teacher_and_user(getTeacher(selectedTeacherID), getUser(selectedTeacherID)).then((returnValue) => {
        if (returnValue) {
            let user = returnValue[1];
            let teacher = returnValue[0];
            setUser(user);
            setTeacher(teacher);
            setCardOpen(true);
        } else {
            console.log('problem in update_teacher_and_user', returnValue);
        }
    })
}

const updateStatusLesson = async (data) => {
    return await axios.post(get_mongo_api(`lessons/updateStatus`), data).then((response => {
        return response.data;
    }))
}


const cancelStudent = async (courseID, id) => {
    var data = { course_id: courseID }
    return await axios.post(get_mongo_api(`students/update/lessonCancelled/${id}`), data).then((response => {
        return response.data;
    }))
}

const cancelTeacher = async (teacherID, dateSelected) => {
    var data = { teacher_id: teacherID, date: dateSelected }
    return await axios.post(get_mongo_api(`teachers/update/lessonCancelled`), data).then((response => {
        return response.data;
    }))
}

const updateStatusStudent = async (courseID, id) => {
    var data = { course_id: courseID }
    return await axios.post(get_mongo_api(`students/update/courseHours/${id}`), data).then((response => {
        return response.data;
    }))
}

const updateStatusTeacher = async (id, courseID) => {
    var data = { course_id: courseID, teachingHours: 1 }
    return await axios.post(get_mongo_api(`teachers/update/teachingHours/${id}`), data).then((response => {
        return response.data;
    }))
}

const sendNotification = async (lesson) => {
    var data = { lesson: lesson, canceled: lesson.student.student_name }
    return await axios.post(get_mongo_api(`users/sendNotification/lessonCanceled`), data).then((response => {
        return response.data;
    }))
}

const update_status = async (func1, func2, func3) => {
    return axios.all([func1, func2, func3]).then(axios.spread((...responses) => {
        const responseOne = responses[0]
        const responseTwo = responses[1]
        const responseThree = responses[2]
        if (responseOne.success && responseTwo.success && responseThree.success) {
            return responseThree;
        }
        else if (responseOne.success || responseTwo.success || responseThree.success) {
            console.log('responseOne', responseOne.message);
            console.log('responseTwo', responseTwo.message);
            console.log('responseTwo', responseThree.message);
            return false;
        }
        else {
            console.log('responseOne && responseTwo && responseThree = false');
            return false;
        }
    })).catch(errors => {
        console.log('errors in update_status', errors);
    })
}

const onClickStatus = (status, lesson) => {
    let teacherID = lesson.teacher.teacher_id;
    let studentID = lesson.student.student_id;
    let courseID = lesson.course.course_id
    let data = {
        teacher_id: teacherID,
        student_id: lesson.student.student_id,
        date: lesson.date,
        status: status
    }
    switch (status) {
        case "report":
            data.status = "done";
            updateStatusLesson(data).then((returnValue) => {
                if (returnValue.success) {
                    update_status(updateStatusTeacher(teacherID, courseID), updateStatusStudent(courseID, studentID), sendNotification(lesson)).then((response) => {
                        if (response) {
                            if (response.success) {
                                alert(returnValue.message);
                                window.location.reload(true)
                            }
                        }
                        else {
                            console.log('problem in update_status', returnValue);
                            alert('אירעה שגיאה במהלך ביטול השיעור');
                            window.location.reload(true);
                        }
                    })
                } else {
                    alert(returnValue.message);
                    window.location.reload(true);
                    console.log('problem in update_status', returnValue.message);
                }
            })
            break;
        case "cancel":
            data.status = "canceled";
            updateStatusLesson(data).then((returnValue) => {
                if (returnValue.success) {
                    update_status(cancelStudent(courseID, studentID), cancelTeacher(teacherID, lesson.date), sendNotification(lesson)).then((returnValue) => {
                        if (returnValue) {
                            if (returnValue.success) {
                                alert(returnValue.message);
                                window.location.reload(true)
                            }
                        }
                        else {
                            console.log('problem in update_status', returnValue);
                            alert('אירעה שגיאה במהלך ביטול השיעור');
                            window.location.reload(true);
                        }
                    })
                } else {
                    alert(returnValue.message);
                    window.location.reload(true);
                    console.log('problem in update_status', returnValue.message);
                }
            })
            break;
        case "done":
            break;
        case "waiting":
            break;
        case "canceled":
            break;
        case "happening":
            break;
        default:
    }

};

const check_status = (status, lessonDate, hoursBeforeCancel) => {
    if (status === "waiting") {
        var today = Date.now();
        var validDateToCancel = new Date();
        validDateToCancel.setHours(validDateToCancel.getHours() + hoursBeforeCancel);
        if (validDateToCancel < lessonDate) { //lesson in the future - can cancel
            return "cancel";
        } else if (today > lessonDate) { //lesson in the past -can report
            return "report";
        } else { // too late to cancel
            return "happening";
        }
    } else {
        return status;
    }
}

const make_rows_of_lesson_table = (lessons, args) => {
    const { setCardOpen, setUser, setTeacher, hoursBeforeCancel } = args;
    if (lessons && Array.isArray(lessons) && lessons.length > 0) {
        let options = lessons.map(lesson => {
            let day = lesson.date.slice(8, 10);
            let month = lesson.date.slice(5, 7);
            let hour = lesson.date.slice(11, 16);
            let shortMonth = month.startsWith(0) ? month.slice(1, 2) : month;
            let shortDay = day.startsWith(0) ? day.slice(1, 2) : day;
            var lessonDate = new Date(lesson.date);
            var status = check_status(lesson.status, lessonDate, hoursBeforeCancel);
            let done = status === "done" || status === "canceled" || status === "happening" ? true : false;
            if (status === "canceled") {
                return null;
            } else {
                return (
                    {
                        "שם הקורס": lesson.course.course_name,
                        "תאריך": shortMonth + " / " + shortDay,
                        "שעה": hour,
                        "מורה": <Button onClick={() => onClickUser(lesson.teacher.teacher_id, setCardOpen, setUser, setTeacher)}>{lesson.teacher.teacher_name}</Button>,
                        "סטטוס": status === "cancel" ? <OverlayTrigger
                            overlay={renderTooltip(hoursBeforeCancel)}>
                            <Button className="status" disabled={done} color={status_to_hebrew[status].color} onClick={(e) => { if (window.confirm('האם לעדכן את הסטטוס?')) onClickStatus(status, lesson) }}>{status_to_hebrew[status].text} </Button>
                        </OverlayTrigger> : <Button className="status" disabled={done} color={status_to_hebrew[status].color} onClick={(e) => { if (window.confirm('האם לעדכן את הסטטוס?')) onClickStatus(status, lesson) }}>{status_to_hebrew[status].text} </Button>
                    }
                )
            }
        });
        var filtered_options = options.filter(function (el) {
            return el != null;
        });
        return filtered_options;
    }
}

export default function LessonsTable({ setCardOpen, setUser, setTeacher, lessons }) {
    const [hoursBeforeCancel, isLoading_hoursBeforeCancel] = useAsyncHook(`constants/min_hours_before_cancel`)
    const args = { setCardOpen, setUser, setTeacher, hoursBeforeCancel };
    const table_rows = make_rows_of_lesson_table(lessons, args);
    if ((table_rows &&  table_rows.length > 0)  && !isLoading_hoursBeforeCancel) {
        return (
            <GenericTable table_data={{ data: table_rows, title: "שיעורים" }} />
        )
    } else {
        return (
            <GenericTable table_data={{ data: [{ "אין מידע בנוגע לשיעורים": "" }], title: "שיעורים" }} />
        )

    }
}