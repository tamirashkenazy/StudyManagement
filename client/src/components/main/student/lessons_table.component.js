import React, { useState } from 'react';
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

const getUser = async (_id) => {
    return await axios.get(get_mongo_api(`users/${_id}`)).then((response => {
        if (response.data.success) {
            console.log(response.data.message);
            return response.data.message;
        }
    }))
}

const getTeacher = async (_id) => {
    return await axios.get(get_mongo_api(`teachers/byID/${_id}`)).then((response => {
        if (response.data.success) {
            console.log(response.data.message);
            return response.data.message;
        }
    }))
}

const onClickUser = async (selectedTeacher, func) => {
    console.log("onClickUserPopup");
    let user1 = await getUser(selectedTeacher.teacher_id);
    let teacher1 = await getTeacher(selectedTeacher.teacher_id);
    // const teacher =  teacher
    let user = await user1;
    let teacher = await teacher1;
    await console.log('user', user);
    await console.log('teacher', teacher);
    await func(true);
}

const onClickStatus = () => {
    console.log("onClickStatus");
    //
};

const make_rows_of_courses_requests = (lessons, func) => {
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
                    "מורה": <Button onClick={() => onClickUser(lesson.teacher, func)}>{lesson.teacher.teacher_name}</Button>,
                    "סטטוס": <Button disabled={done} color={status_to_hebrew[lesson.status].color} variant="contained" onClick={() => onClickStatus(lesson.status)}>{status_to_hebrew[lesson.status].text} </Button>
                }
            )
        });
        return options
    }
}

export default function LessonsTable({id}) {
    const [isCardOpen, setCardOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [teacher, setTeacher] = useState(null);
    const [table_rows, loading] = useAsyncHook(`lessons/byStudentId/${id}`, make_rows_of_courses_requests, setCardOpen);
     if (!loading && table_rows) {
         return (
            <>
            <GenericTable table_data={{ data: table_rows, title: "שיעורים" }} />
            {isCardOpen && teacher && user ? <> {Dialog_generator(isCardOpen, () => setCardOpen(false), "כרטיס מורה", "person_pin", {}, () => <UserCard user={user} teacher={teacher}></UserCard>)} </> : null}
            </>
         )

     } else {
         return (
            <GenericTable table_data={{ data: [{"אין מידע בנוגע לשיעורים" : ""}], title: "שיעורים" }} />
         )

     }
}
