import React from 'react';
import GenericTable from '../../utils/generic_table.component'
import EventIcon from '@material-ui/icons/Event';
import UpdateIcon from '@material-ui/icons/Update';
import IconButton from '@material-ui/core/IconButton';

const make_rows_of_hours_table = (student, setOpenedPopups, setSelectedCourse, getOpenedPopup) => {
    if (student.courses && student.courses.length > 0) {
        let options = student.courses.map(course_obj => {
            var hours_done = parseInt(course_obj.hours_already_done);
            var hours_remain = parseInt(course_obj.hours_able_to_book);
            var scheduleDisabled = (hours_remain > 0) ? false : true;
            var historyDisabled = (hours_done > 0) ? false : true;
            return (
                {
                    "שם הקורס": course_obj.course_name,
                    "שעות שאושרו": course_obj.approved_hours,
                    "שעות שנותרו לשיבוץ": course_obj.hours_able_to_book,
                    "שעות שבוצעו": course_obj.hours_already_done,
                    "היסטוריה": <IconButton disabled={historyDisabled} className="history" onClick={() => { setSelectedCourse(course_obj.course_id); setOpenedPopups(getOpenedPopup(2, 4)) }}><UpdateIcon className="UpdateIcon" /></IconButton>,
                    "קביעת שיעור": <IconButton disabled={scheduleDisabled} className="schedule" onClick={() => { setSelectedCourse(course_obj.course_id); setOpenedPopups(getOpenedPopup(1, 4)) }}><EventIcon className="EventIcon" /> </IconButton>
                }
            )
        })
        return options;
    }
    else {
        return [{ "אין מידע בנוגע למעקב השעות": "" }];
    }
}

export default function TrackHoursTable({student, setOpenedPopups, setSelectedCourse, getOpenedPopup,openedPopups }) {
    const table_rows = make_rows_of_hours_table( student, setOpenedPopups, setSelectedCourse, getOpenedPopup,openedPopups);

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

