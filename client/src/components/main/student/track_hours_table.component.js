import React from 'react';
import get_mongo_api from '../../mongo/paths.component'
import GenericTable from '../utils/generic_table.component'
import EventIcon from '@material-ui/icons/Event';
import UpdateIcon from '@material-ui/icons/Update';
import IconButton from '@material-ui/core/IconButton';
import axios from 'axios'

const get_hours_available_to_book = async data => {
    return functionWithPromise(data);
}

const functionWithPromise = data => { //a function that returns a promise
    return axios.post(get_mongo_api(`students/availableHours`), data).then((response => {
        return Promise.resolve(response)
    }))
}

const make_rows_of_hours_table = (student, setOpenedPopups, setSelectedCourse, getOpenedPopup) => {
    if (student.courses && student.courses.length > 0) {
        let options = student.courses.map(course_obj => {
            // var data = { course_id: course_obj.course_id, student_id: id };
            let remaining_hours = 0;
            var scheduleDisabled = (remaining_hours > 0) ? false : true;
            var historyDisabled = (course_obj.hours_already_done > "0") ? false : true;
            return (
                {
                    "שם הקורס": course_obj.course_name,
                    "שעות שאושרו": course_obj.approved_hours,
                    "שעות שבוצעו": course_obj.hours_already_done,
                    "היסטוריה": <IconButton disabled={historyDisabled} className="history" onClick={() => { setSelectedCourse(course_obj.course_id); setOpenedPopups(Object.assign({}, getOpenedPopup(false, false, true, false))) }}><UpdateIcon className="UpdateIcon" /></IconButton>,
                    "קביעת שיעור": <IconButton disabled={scheduleDisabled} className="schedule" onClick={() => { setSelectedCourse(course_obj.course_id); setOpenedPopups(Object.assign({}, getOpenedPopup(false, true, false, false))) }}><EventIcon className="EventIcon" /> </IconButton>
                }
            )
        })
        return options;
    }
    else {
        return [{ "אין מידע בנוגע למעקב השעות": "" }];
    }
}

export default function TrackHoursTable({student, setOpenedPopups, setSelectedCourse, getOpenedPopup }) {
    const table_rows = make_rows_of_hours_table( student, setOpenedPopups, setSelectedCourse, getOpenedPopup);

    if (table_rows) {
        return (
            <GenericTable table_data={{ data: table_rows, title: "מעקב שעות אישי" }} />
        )
    } else {
        return (
            <GenericTable table_data={{ data: [{ "אין מידע בנוגע למעקב שעות אישי": "" }], title: "מעקב שעות אישי" }} />
        )
    }
}

