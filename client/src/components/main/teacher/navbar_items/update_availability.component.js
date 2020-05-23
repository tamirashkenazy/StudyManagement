import React, { useState } from 'react';
import axios from 'axios'
import { Calendar } from '../../utils/calendar/calendar';
import get_mongo_api, { useAsyncHook } from '../../../mongo/paths.component'

const make_available_hours_list = (arr_of_hours, lessons) => {
    if (arr_of_hours && arr_of_hours !== undefined && arr_of_hours.length > 0) {
        let datesDict = arr_of_hours.map(date_obj => {
            return (
                {
                    date: [new Date(date_obj).toUTCString()],
                    text: 'פנוי'
                }
            )
        })
        var dates = {};
        var all_hours = [];
        if (lessons && lessons !== undefined && lessons.length > 0) {
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
        var date = new Date(lesson.date);
        if (today < date) {
            var singleDate = lesson.date.split("T");
            var dateFormat = singleDate[0].replace("-", " ")
            var singleHour = singleDate[1].slice(0, 5);
            return (
                {
                    date: [new Date(dateFormat + " " + singleHour)],
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
    const [hours_available, loading] = useAsyncHook(`teachers/${id}/hoursAvailable`, make_available_hours_list, lessons);
    console.log('hours_available: ', hours_available);
    const [isTeacher] = useState(true);

    const sendHours = (selectedHours, id) => {
        if (selectedHours.length > 0) {
            console.log(selectedHours);
            axios.post(get_mongo_api(`teachers/add/hoursAvailable/${id}`), { dates: selectedHours }).then(response => {
                if (!response.data.success) {
                    console.log(response.data.message)
                    console.log(selectedHours)
                } else {
                    alert(response.data.message)
                    console.log(selectedHours)
                    window.location.reload(true)
                }
            })
        }
    }

    return (
        !loading &&
        <div className="teacherCalendar">
            <Calendar
                isTeacher={isTeacher}
                datesDict={hours_available}
                confirmHandler={(selectedHours) => sendHours(selectedHours, id)} />
        </div>
    )
}
