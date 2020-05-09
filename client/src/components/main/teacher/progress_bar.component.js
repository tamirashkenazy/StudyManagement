import React, { useState, useEffect } from 'react';
import axios from 'axios'
import get_mongo_api from '../../mongo/paths.component'
import LinearProgress from '@material-ui/core/LinearProgress';


export default function ProgressBar(id) {
    const [numHours, setNumHours] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function getDataFromAPI() {
            var numberOfHours = 0;
            const response = await axios.get(get_mongo_api(`lessons/byTeacherId/${id}`)).then(response => {
                if (response.data.success === true) {
                    return response.data.message
                } else {
                    return null
                }
            })
            if (typeof response !== 'string') {
                response.forEach(lesson => {
                    if (lesson.status === "done") {
                        numberOfHours++
                    }
                });
            }
            setNumHours(numberOfHours);
            setLoading(false);
        }
        getDataFromAPI()

    }, [id]);


    return (
        !loading &&
        <div className="progressBar">
            <LinearProgress variant="determinate" value={numHours} />
            <div className="progressBarTitle">
                <h1>  שעות הועברו החודש </h1>
                <h1 className="number"> {numHours} </h1>
            </div>
        </div>
    );
}

