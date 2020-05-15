import React from 'react';
import GenericTable from '../utils/generic_table.component'
import Button from '@material-ui/core/Button';
import UserCard from '../utils/card.component'
import axios from 'axios'
import get_mongo_api, { useAsyncHook } from '../../mongo/paths.component'
import { Dialog_generator } from '../utils//utils'

const status_to_hebrew = {
    "cancel": { text: "בטל", color: "secondary" },
    "report": { text: "דווח", color: "primary" },
    "done": { text: "בוצע", color: "default" }
}

var user = null;
var teacher = null;
let isCardOpen = false;

const getUser = async (_id) => {
    await axios.get(get_mongo_api(`users/${_id}`)).then((response => {
        if (response.data.success) {
            console.log(response.data.message);
            return user;
        }
    }))
}

const getTeacher = async (_id) => {
    await axios.get(get_mongo_api(`teachers/byID/${_id}`)).then((response => {
        if (response.data.success) {
            console.log(response.data.message);
            return user;
        }
    }))
}

const onClickUser = async (selectedTeacher) => {
    console.log("onClickUserPopup");
    user = getUser(selectedTeacher.teacher_id);
    teacher = getTeacher(selectedTeacher.teacher_id);
    // const teacher =  teacher
    console.log(user);
    console.log(teacher);
    isCardOpen = !isCardOpen;
    return isCardOpen;
}

const onClickStatus = () => {
    console.log("onClickStatus");
    //
};

const make_rows_of_courses_requests = (lessons) => {
    if (lessons && Array.isArray(lessons) && lessons.length > 0) {
        let options = lessons.map(lesson => {
            let done = lesson.status === "done" ? true : false;
            let day = lesson.date.slice(8, 10);
            let month = lesson.date.slice(5, 7);
            let hour = lesson.date.slice(11, 16);
            let shortMonth = month.startsWith(0) ? month.slice(1, 2) : month;
            let shortDay = day.startsWith(0) ? day.slice(1, 2) : day;
            return (
                {
                    "שם הקורס": lesson.course.course_name,
                    "תאריך": shortMonth + " / " + shortDay,
                    "שעה": hour,
                    "מורה": <Button onClick={() => onClickUser(lesson.teacher)}>{lesson.teacher.teacher_name}</Button>,
                    "סטטוס": <Button disabled={done} color={status_to_hebrew[lesson.status].color} variant="contained" onClick={() => onClickStatus(lesson.status)}>{status_to_hebrew[lesson.status].text} </Button>
                }
            )
        });
        return options
    } else {
        return ([{
            "אין שיעורים" : ""
        }])
    }
}

export default function LessonsTable({id}) {
    const [table_rows, loading] = useAsyncHook(`lessons/byStudentId/${id}`, make_rows_of_courses_requests);

    if (!loading && table_rows) {
        return (
            <>
            <GenericTable table_data={{ data: table_rows, title: "שיעורים" }} />
            {Dialog_generator(isCardOpen, () => { isCardOpen = false }, "כרטיס מורה","person_pin", {}, () => <UserCard user={user} teacher={teacher}></UserCard>)}
        </>
        )
    } else {
        return <div>
        loading</div>
    }
        
}
