import React from 'react';
// import { useAsyncHook } from '../../mongo/paths.component'
import GenericTable from '../utils/generic_table.component'
import EventIcon from '@material-ui/icons/Event';
import UpdateIcon from '@material-ui/icons/Update';
import IconButton from '@material-ui/core/IconButton';

const getOpenedPopup = (is_open_request_hours, is_open_book_class,is_open_history_popup) => {
    return (
        { request_hours_popup: is_open_request_hours, book_class_popup: is_open_book_class, history_popup: is_open_history_popup }
    )
}

const make_rows_of_courses_requests = (student,setOpenedPopups) => {

    if (student.courses && student.courses.length > 0) {
        let options = student.courses.map(course_obj => {
            var remaining_hours = course_obj.approved_hours - course_obj.hours_already_done;
            var scheduleDisabled = (remaining_hours !== 0) ? false : true;
            var historyDisabled = (course_obj.hours_already_done === "0") ? false : true; //needs to change to NOT ZERO (! instead of the first =)
            return (
                {
                    "שם הקורס": course_obj.course_name,
                    "שעות שאושרו": course_obj.approved_hours,
                    "שעות שבוצעו": course_obj.hours_already_done,
                    "היסטוריה": <IconButton disabled={historyDisabled} className="history" onClick={()=>setOpenedPopups(Object.assign({}, getOpenedPopup(false, false,true)))}><UpdateIcon className="UpdateIcon" /></IconButton> ,
                    "קביעת שיעור": <IconButton disabled={scheduleDisabled} className="schedule" onClick={()=>setOpenedPopups(Object.assign({}, getOpenedPopup(false, true,false)))}><EventIcon className="EventIcon" /> </IconButton>
                }
            )
        })
        return options
    }
    else {
        return [{"אין מידע בנוגע למעקב השעות": ""}]
    }
}

export default function TrackHoursTable({student,setOpenedPopups}) {
    const table_rows = make_rows_of_courses_requests(student,setOpenedPopups);
    // const [table_rows, loading] = useAsyncHook(`students/byID/${id}`, make_rows_of_courses_requests, setOpenedPopups);

    return (
        // !loading && table_rows &&
        <GenericTable table_data={{ data: table_rows, title: "מעקב שעות אישי" }} />
        )
}

