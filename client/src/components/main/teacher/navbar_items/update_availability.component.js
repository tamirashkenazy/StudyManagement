import React, { useState } from 'react';
import axios from 'axios'
import { Calendar } from '../../utils/calendar/calendar';
import get_mongo_api, { useAsyncHook } from '../../../mongo/paths.component'

const make_available_hours_list = (arr_of_hours, lessons) => {
    if (arr_of_hours && arr_of_hours !== undefined &&Array.isArray(arr_of_hours) && arr_of_hours.length > 0) {
        let datesDict = arr_of_hours.map(date_obj => {
            var date = date_obj.slice(0, -1)
            return (
                {
                    date: [new Date(date)],
                    text: 'פנוי'
                }
            )
        })
        var dates = {};
        var all_hours = [];
        if (lessons && lessons !== undefined && Array.isArray(lessons) && lessons.length > 0) {
            all_hours = set_lessons(lessons, datesDict);
        }
        else {
            all_hours = datesDict;
        }
        var filtered_hours = all_hours.filter(function (el) {
            return el != null;
        });
        for (var x = 0; x < filtered_hours.length; x++) {
            dates[filtered_hours[x].date] = filtered_hours[x].text;
        };
        return dates;
    }
}

const set_lessons = (lessons, array) => {
    let hours_of_lessons = lessons.map(lesson => {
        var today = Date.now();
        var date = lesson.date.slice(0, -1)
        var newDate = new Date(date);
        if (today < newDate && lesson.status !== "canceled" ) {
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

export default function UpdateAvailability({ id, lessons }) {
    const [hours_available, loading] = useAsyncHook(`teachers/hoursAvailable/byID/${id}`, make_available_hours_list, lessons);
    const [isTeacher] = useState(true);

    const sendHours = (selectedHours, id) => {
        if (Array.isArray(selectedHours) && selectedHours.length > 0) {
            axios.post(get_mongo_api(`teachers/add/hoursAvailable/${id}`), { dates: selectedHours }).then(response => {
                if (!response.data.success) {
                    alert(response.data.message);
                } else {
                    alert(response.data.message);
                    window.location.reload(true);

                }
            })
        }
    }

    return (
        !loading &&
        <div className="teacherCalendar">
            <div> <label>  נא לבחור את השעות הפנויות עבורך על מנת שתלמידים יוכלו לקבוע עמך שיעור </label> </div>
            <Calendar
                isTeacher={isTeacher}
                datesDict={hours_available}
                maxNumber={1000}
                confirmHandler={(selectedHours) => sendHours(selectedHours, id)} />
        </div>
    )
}
