import React, { useState } from 'react';
import axios from 'axios'
import { Calendar } from '../../utils/calendar/calendar';
import get_mongo_api, { useAsyncHook } from '../../../mongo/paths.component'

const make_available_hours_list = (arr_of_hours, lessons) => {
    if (arr_of_hours && arr_of_hours !== undefined && Array.isArray(arr_of_hours) && arr_of_hours.length > 0) {
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
        if (today < newDate && lesson.status !== "canceled") {
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

const two_functions_parallel = async (func1, func2) => {
    return axios.all([func1, func2]).then(axios.spread((...responses) => {
        const responseOne = responses[0]
        const responseTwo = responses[1]
        if (responseOne && responseTwo) {
            return true;
        }
        else {
            return false;
        }
    })).catch(() => {
        return false;
    })
}

const addHoursAvailable = async (id, addHours) => {
    if (addHours && Array.isArray(addHours) && addHours.length > 0) {
        var data = { dates: addHours };
        return await axios.post(get_mongo_api(`teachers/add/hoursAvailable/${id}`), data).then((response => {
            if (response.data.success) {
                return response.data.success;
            }
            else {
                return false;
            }
        }))
    }
    return true;
}

const deleteHoursAvailable = async (id, deleteHours) => {
    if (deleteHours && Array.isArray(deleteHours) && deleteHours.length > 0) {
        var data = { hours_available: deleteHours };
        return await axios.post(get_mongo_api(`teachers/delete/hoursAvailable/${id}`), data).then((response => {
            if (response.data.success) {
                return response.data.success;
            }
            else {
                return false;
            }
        }))
    }
    return true;
}

export default function UpdateAvailability({ id, lessons }) {
    const [hours_available, loading] = useAsyncHook(`teachers/hoursAvailable/byID/${id}`, make_available_hours_list, lessons);
    const [isTeacher] = useState(true);

    const sendHours = (addHours, deleteHours, id) => {
        if ((Array.isArray(addHours) && addHours.length > 0) || (Array.isArray(deleteHours) && deleteHours.length > 0)) {
            two_functions_parallel(addHoursAvailable(id, addHours), deleteHoursAvailable(id, deleteHours)).then((returnValue) => {
                if (returnValue) {
                    alert("השעות עודכנו בהצלחה");
                    window.location.reload(true);
                } else {
                    alert('אירעה שגיאה במהלך עדכון השעות');
                    window.location.reload(true);
                }
            })
        }
    }

    return (
        !loading &&
        <div className="teacherCalendar">
            <div> <label>  נא לבחור את השעות הפנויות עבורך על מנת שתלמידים יוכלו לקבוע עמך שיעור </label> </div>
            <div> <label>  על מנת למחוק שעה פנויה, אנא לחץ עליה ולאחר מכן לחץ על עדכן </label> </div>
            <Calendar
                isTeacher={isTeacher}
                datesDict={hours_available}
                maxNumber={1000}
                confirmHandler={(addHours, deleteHours) => sendHours(addHours, deleteHours, id)} />
        </div>
    )
}
