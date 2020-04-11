import React from 'react';
import {StatisticsPieChart} from '../utils/charts'
import Grid from '@material-ui/core/Grid';

const data_points1 = [
    {y:20, label:"קורס1"},
    {y:30, label:"קורס2"},
    {y:80, label:"קורס3"},
    {y:10, label:"קורס4"},
    {y:5, label:"קורס5"}
]

export const Statistics = () => {
    return (
        <Grid container spacing={2}  direction="column" >
            <Grid item xs >
                <StatisticsPieChart title={"שיעורים בלה1"} data_points={data_points1} theme={"dark2"} />
            </Grid>
            <Grid item xs >
                <StatisticsPieChart title={"שיעורים בלה1"} data_points={data_points1} theme={"light1"} />
            </Grid>
        </Grid>
    )
}
