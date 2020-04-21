import React,{ useState } from 'react';
import axios from 'axios'
import get_mongo_api from '../../mongo/paths.component'
import { Calendar } from '../utils/calendar/calendar';


export default function UpdateAvailability(props) {

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

    const [isTeacher, setIsTeacher] = useState(true);

    //get Dates saved as avaqilability in teacher (Michael func). For example: 
    const datesDict = {
        [new Date('2020 04 22 12:00')] : 'פנוי',
        [new Date('2020 04 24 13:00')] : 'פנוי',
        [new Date('2020 04 25 18:00')] : 'פנוי',
      }

    return (
        <div className="teacherCalendar"> 
        <Calendar 
        isTeacher={isTeacher} 
        datesDict={datesDict} 
        confirmHandler={(selectedHours) => sendHours(selectedHours, props.id)} />
        </div>
    )
}