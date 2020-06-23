import React, { useState, useEffect } from 'react';
import GenericTable from '../utils/generic_table.component'
import Button from '@material-ui/core/Button';
import axios from 'axios'
import get_mongo_api from '../../mongo/paths.component'

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
        else {
            return false;
        }
    })).catch(() => {
        return false;
    })
}

const onClickUser = (selectedTeacherID, setCardOpen, setUser, setTeacher) => {
    update_teacher_and_user(getTeacher(selectedTeacherID), getUser(selectedTeacherID)).then((returnValue) => {
        if (returnValue) {
            let user1 = returnValue[1];
            let teacher1 = returnValue[0];
            setUser(user1);
            setTeacher(teacher1);
            setCardOpen(true);
        }
    })
}


const make_rows_of_lessons_history = (lessons, args) => {
    const { setCardOpen, setUser, setTeacher } = args;
    if (lessons && Array.isArray(lessons) && lessons.length > 0) {
        let table = lessons.map(lesson => {
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
                    "מורה": <Button onClick={() => onClickUser(lesson.teacher.teacher_id, setCardOpen, setUser, setTeacher)}>{lesson.teacher.teacher_name}</Button>,
                }
            )
        });
        return table;
    }
}

/**
 * history dialog of the lessons of the same course
 */
export default function History({ _id, courseID, setCardOpen, setUser, setTeacher }) {
    const args = { setCardOpen, setUser, setTeacher };
    const [data, setData] = useState(null);
    const [table_rows, setTable] = useState(null)
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (courseID !== null) {
            let obj = {
                status: "done",
                course_id: courseID,
                student_id: _id
            };
            setData(obj)
            async function getDataFromAPI(data) {
                var table = [];
                const response = await axios.post(get_mongo_api(`lessons/ByStatusCourseAndStudent/`), data).then(response => {
                    if (response.data.success) {
                        return response.data.message
                    } else {
                        return null
                    }
                })
                if (typeof response !== 'string' && response !== null) {
                    table = make_rows_of_lessons_history(response, args)
                }
                setTable(table)
                setLoading(false);
            }
            getDataFromAPI(obj);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [courseID, _id]);

    if (table_rows && !loading && data) {
        return (
            <GenericTable table_data={{ data: table_rows, title: "היסטוריית שיעורים" }} />
        )
    } else {
        return (
            <GenericTable table_data={{ data: [{ "אין מידע בנוגע להיסטוריית שיעורים": "" }], title: "היסטוריית שיעורים" }} />
        )

    }
}