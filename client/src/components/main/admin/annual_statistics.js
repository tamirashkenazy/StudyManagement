import React from 'react';
import { lighten, makeStyles, withStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import { Typography } from '@material-ui/core';


const BorderLinearProgress = withStyles({
  root: {
    height: "4rem",
    backgroundColor: lighten('#448cb4', 0.4),
    borderRadius: "20px",
  },
  bar: {
    backgroundColor: '#164d68',
  },
})(LinearProgress);

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  margin: {
    margin: theme.spacing(1),
  },
  progressLabel: {
    position: "absolute",
    zIndex: 1,
    color: "whitesmoke",
    padding: "1.2rem",
    width: "67%"
  }
}));

const AnnualStatisticsBar = ({ percentage }) => {
  const classes = useStyles();
  return (
    <BorderLinearProgress
      className={classes.margin}
      variant="determinate"
      color="secondary"
      value={percentage}
    />
  )
}

const AnnualStatisticsText = ({ percentage }) => {
  return (
    <Typography variant="h3" color="inherit">תקציב כללי: {percentage}%</Typography>

  )
}

export const AnnualStatistics = ({ annual_budget, sum_lessons }) => {
  const mainClasses = useStyles();
  let percentage = Math.round(sum_lessons * 10000.0 / annual_budget) / 100
  return (
    <div style={{ color: "#164d68" }}>
      <AnnualStatisticsText percentage={percentage} />
      <Typography variant="h4" color="inherit" className={mainClasses.progressLabel}>{sum_lessons}/{annual_budget}</Typography>
      <AnnualStatisticsBar percentage={percentage} />
    </div>
  )
}