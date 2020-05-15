import React from 'react';
import GenericTable from '../utils/generic_table.component'
import Button from '@material-ui/core/Button';
import UserCard from '../utils/card.component'
import axios from 'axios'
import get_mongo_api, { useAsyncHook } from '../../mongo/paths.component'
import { Dialog_generator } from '../utils//utils'

var user = null;
var teacher = null;
let isCardOpen = false;

const getUser = async (_id) => {
    return await axios.get(get_mongo_api(`users/${_id}`)).then((response => {
        if (response.data.success) {
            console.log(response.data.message);
            return user;
        }
    }))
}

const getTeacher = async (_id) => {
    return await axios.get(get_mongo_api(`teachers/byID/${_id}`)).then((response => {
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


const make_rows_of_courses_requests = (lessons) => {
    if (lessons && Array.isArray(lessons) && lessons.length > 0) {
        let options = lessons.map(lesson => {
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
                }
            )
        });
        return options
    }
}

export default function History(id,courseID) {
    const [table_rows, loading] = useAsyncHook(`lessons/byStudentId/${id}`, make_rows_of_courses_requests);

    return (
        !loading && table_rows &&
        <>
            <GenericTable table_data={{ data: table_rows, title: "היסטוריית שיעורים" }} />
            {Dialog_generator(isCardOpen, () => { isCardOpen = false }, "כרטיס מורה","person_pin", {}, () => <UserCard user={user} teacher={teacher}></UserCard>)}
        </>
    )
}
