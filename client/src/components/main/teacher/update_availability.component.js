import React, { useState } from 'react';
import axios from 'axios'
import { Calendar } from '../utils/calendar/calendar';
import get_mongo_api, { useAsyncHook } from '../../mongo/paths.component'

const make_available_hours_list = (arr_of_hours) => {
    if (arr_of_hours && arr_of_hours !== undefined && arr_of_hours.length > 0) {
        let datesDict = arr_of_hours.map(date_obj => {
            var date = date_obj.split("T");
            var hour = date[1].slice(0, 5);
            return (
                {
                    date: [new Date(date[0] + " " + hour)],
                    text: 'פנוי'
                }
            )
        })
        var dates = {};
        for (var x = 0; x < datesDict.length; x++){
            dates[datesDict[x].date] = datesDict[x].text;
        };
        return dates;
    }
}

export default function UpdateAvailability(props) {
    const [hours_available, loading] = useAsyncHook(`teachers/${props.id}/hoursAvailable`, make_available_hours_list);
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

    const [isTeacher] = useState(true);

    return (
        !loading &&
        <div className="teacherCalendar">
            <Calendar
                isTeacher={isTeacher}
                datesDict={hours_available}
                confirmHandler={(selectedHours) => sendHours(selectedHours, props.id)} />
        </div>
    )
}