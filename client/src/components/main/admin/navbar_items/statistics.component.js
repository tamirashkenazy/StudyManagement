import React from 'react';
import { StatisticsPieChart } from '../../utils/charts'
import Carousel from 'react-bootstrap/Carousel'
import { makeStyles } from '@material-ui/core/styles';
import '../../../../styles/stats.scss';

const useStyles = makeStyles({
    firstItem: {
        padding: "0 5%",
    },
    secondItem: {
        padding: "0 19%",
    },
    thirdItem: {
        padding: "0 19%",
    }
});


const convert_to_percent = (data_points_arr) => {
    let sum_of_labels = 0
    data_points_arr.forEach(data_point_obj => {
        sum_of_labels += data_point_obj.y
    })
    if (sum_of_labels > 0) {
        data_points_arr.forEach(pie_obj =>
            pie_obj.y = (pie_obj.y * 100 / sum_of_labels).toFixed(2)
        )
    } else {
        return null
    }
    return data_points_arr;
}


const to_data_points = (arr_to_pie) => {
    let pie = []
    arr_to_pie.forEach(data_obj => {
        pie.push({ label: data_obj.name, y: data_obj.sum })
    })
    return pie
}


export const Statistics = (lessons_pie, students_pie, teachers_pie) => {
    lessons_pie = to_data_points(lessons_pie)
    students_pie = to_data_points(students_pie)
    teachers_pie = to_data_points(teachers_pie)
    lessons_pie = convert_to_percent(lessons_pie)
    const classes = useStyles();

    return (
        // <Grid container spacing={2}  direction="column" >
        //     {lessons_pie &&  Array.isArray(lessons_pie) && lessons_pie.length>0 && <Grid item xs >
        //         <StatisticsPieChart title={"חלוקת שיעורים"} label_suffix="%" data_points={lessons_pie} theme={"light1"} />
        //     </Grid>}
        //     {students_pie &&  Array.isArray(students_pie) && students_pie.length>0 && <Grid item xs >
        //         <StatisticsPieChart title={"מספר סטודנטים בכל קורס"} label_suffix=" סטודנטים " data_points={students_pie} theme={"dark2"} />
        //     </Grid>}
        //     { teachers_pie &&  Array.isArray(teachers_pie) && teachers_pie.length>0 && <Grid item xs >
        //         <StatisticsPieChart title={"מספר המורים בכל קורס"} label_suffix=" מורים " data_points={teachers_pie} theme={"light1"} />
        //     </Grid> }
        // </Grid>
        <Carousel interval={null} className={classes.carousel}>
            {/* <Carousel.Item> */}
            {lessons_pie && Array.isArray(lessons_pie) && lessons_pie.length > 0 &&
                //  <Grid item xs >
                <Carousel.Item className={classes.firstItem}>
                    <StatisticsPieChart title={"חלוקת שיעורים"} label_suffix="%" data_points={lessons_pie} theme={"light1"} />
                </Carousel.Item>}
            {/* </Grid>} */}
            {students_pie && Array.isArray(students_pie) && students_pie.length > 0 &&
                //  <Grid item xs >
                <Carousel.Item className={classes.secondItem}>
                    <StatisticsPieChart title={"מספר סטודנטים בכל קורס"} label_suffix=" סטודנטים " data_points={students_pie} theme={"light1"} />
                </Carousel.Item>}
            {/* </Grid>} */}
            {teachers_pie && Array.isArray(teachers_pie) && teachers_pie.length > 0 &&
                // <Grid item xs >
                <Carousel.Item className={classes.thirdItem}>
                    <StatisticsPieChart title={"מספר המורים בכל קורס"} label_suffix=" מורים " data_points={teachers_pie} theme={"light1"} />
                </Carousel.Item>}
            {/* </Grid>} */}
            {/* </Grid> */}
            {/* </Carousel.Item> */}
        </Carousel>
    )
}
