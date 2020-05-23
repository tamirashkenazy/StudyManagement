import React from 'react';
import GenericTable from '../utils/generic_table.component'
import Button from '@material-ui/core/Button';
import axios from 'axios'
import get_mongo_api from '../../mongo/paths.component'

const status_to_hebrew = {
    "cancel": { text: "בטל", color: "secondary" },
    "done": { text: "בוצע", color: "default" },
    "waiting": { text: "ממתין", color: "default" },
    "canceled": { text: "בוטל", color: "secondary" },
    "happening": { text: "מתקיים", color: "primary" }
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

const getStudent = async (_id) => {
    return await axios.get(get_mongo_api(`students/byID/${_id}`)).then((response => {
        if (response.data.success) {
            return response.data.message;
        }
        else {
            return false;
        }
    }))
}

const update_student_and_user = async (func1, func2) => {
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
        console.log('errors in update_student_and_user', errors);
    })
}


const onClickUser = (selectedStudentID, setCardOpen, setUser, setStudent) => {
    update_student_and_user(getStudent(selectedStudentID), getUser(selectedStudentID)).then((returnValue) => {
        if (returnValue) {
            let user = returnValue[1];
            let student = returnValue[0];
            setUser(user);
            setStudent(student);
            setCardOpen(true);
        } else {
            console.log('problem in update_student_and_user', returnValue);
        }
    })
}

const updateStatus = async (data) => {
    return await axios.post(get_mongo_api(`lessons/updateStatus`), data).then((response => {
        return response;
    }))
}

const onClickStatus = (status, lesson) => {
    var data = {
        teacher_id: lesson.teacher.teacher_id,
        student_id: lesson.student.student_id,
        date: lesson.date,
        status: status
    }
    switch (status) {
        case "cancel":
            data.status = "canceled";
            updateStatus(data).then((response) => {
                alert(response.data.message);
                window.location.reload(true)
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

const check_status = (status, lessonDate) => {
    if (status === "waiting") {
        var today = Date.now();
        var tomorrow = new Date();
        tomorrow.setDate(new Date().getDate() + 1);
        if (tomorrow < lessonDate) { //lesson in the future
            return "cancel";
        } else if (today > lessonDate) { //lesson in the past
            return "report";
        } else { // too late to cancel
            return "happening";
        }
    }
}

const make_rows_of_lessons = (lessons, args) => {
    const { setCardOpen, setUser, setStudent } = args;
    if (lessons && Array.isArray(lessons) && lessons.length > 0) {
        let options = lessons.map(lesson => {
            let day = lesson.date.slice(8, 10);
            let month = lesson.date.slice(5, 7);
            let hour = lesson.date.slice(11, 16);
            let shortMonth = month.startsWith(0) ? month.slice(1, 2) : month;
            let shortDay = day.startsWith(0) ? day.slice(1, 2) : day;
            var lessonDate = new Date(lesson.date);
            var status = check_status(lesson.status, lessonDate);
            let done = lesson === "done" || lesson === "canceled" || status === "happening" ? true : false;
            if (lesson.status === "canceled") {
                return null;
            } else {
                return (
                    {
                        "שם הקורס": lesson.course.course_name,
                        "תאריך": shortMonth + " / " + shortDay,
                        "שעה": hour,
                        "תלמיד": <Button onClick={() => onClickUser(lesson.student.student_id, setCardOpen, setUser, setStudent)}>{lesson.student.student_name}</Button>,
                        "סטטוס": <Button disabled={done} color={status_to_hebrew[status].color} onClick={(e) => { if (window.confirm('האם לעדכן את הסטטוס?')) onClickStatus(status, lesson) }}>{status_to_hebrew[status].text} </Button>
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
    const args = { setCardOpen, setUser, setTeacher };
    const table_rows = make_rows_of_lessons(lessons, args);
    if (table_rows) {
        return (
            <GenericTable table_data={{ data: table_rows, title: "שיעורים" }} />
        )

    } else {
        return (
            <GenericTable table_data={{ data: [{ "אין מידע בנוגע לשיעורים": "" }], title: "שיעורים" }} />
        )

    }
}
