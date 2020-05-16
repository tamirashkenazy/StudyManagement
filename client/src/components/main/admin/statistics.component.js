import React from 'react';
import {StatisticsPieChart} from '../utils/charts'
import Grid from '@material-ui/core/Grid';


const convert_to_percent = (data_points_arr) => {
    let sum_of_labels = 0
    data_points_arr.forEach(data_point_obj=>{
        sum_of_labels += data_point_obj.y
    })
    data_points_arr.forEach(pie_obj=>
        pie_obj.y = (pie_obj.y * 100 / sum_of_labels).toFixed(2)
    )
    return data_points_arr;
}


const to_data_points = (arr_to_pie) => {
    let pie = []
    arr_to_pie.forEach(data_obj => {
        pie.push({label : data_obj.name, y: data_obj.sum})
    })
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
                <StatisticsPieChart title={"חלוקת שיעורים"} label_suffix="%" data_points={lessons_pie} theme={"light1"} />
            </Grid>
            <Grid item xs >
                <StatisticsPieChart title={"מספר סטודנטים בכל קורס"} label_suffix=" סטודנטים " data_points={students_pie} theme={"dark2"} />
            </Grid>
            <Grid item xs >
                <StatisticsPieChart title={"מספר המורים בכל קורס"} label_suffix=" מורים " data_points={teachers_pie} theme={"light1"} />
            </Grid>
        </Grid>
    )
}
