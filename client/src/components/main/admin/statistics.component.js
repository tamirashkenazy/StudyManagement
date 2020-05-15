import React from 'react';
import {StatisticsPieChart} from '../utils/charts'
import Grid from '@material-ui/core/Grid';


const convert_to_percent = (pie) => {
    var sum_of_labels = 0
    for(var i in pie){
        sum_of_labels += pie[i].sum
    }
    for(i in pie){
        pie[i].sum = (pie[i].sum / sum_of_labels * 100)
    }
    return pie;
}


const to_data_points = (arr_to_pie) => {
    var pie = []
    for(var i in arr_to_pie){
        pie.push({label : arr_to_pie[i].name, y: arr_to_pie[i].sum})
    }
    return pie
}


export const Statistics = (lessons_pie, students_pie, teachers_pie) => {
    lessons_pie = to_data_points(lessons_pie)
    students_pie = to_data_points(students_pie)
    teachers_pie = to_data_points(teachers_pie)

    lessons_pie = convert_to_percent(lessons_pie)
    return (
        <Grid container spacing={2}  direction="column" >
            <Grid item xs >
                <StatisticsPieChart title={"חלוקת שיעורים"} showPercent={true} data_points={lessons_pie} theme={"light1"} />
            </Grid>
            <Grid item xs >
                <StatisticsPieChart title={"מספר סטודנטים בכל קורס"} showPercent={false} data_points={students_pie} theme={"dark2"} />
            </Grid>
            <Grid item xs >
                <StatisticsPieChart title={"מספר המורים בכל קורס"} data_points={teachers_pie} theme={"light1"} />
            </Grid>
        </Grid>
    )
}
