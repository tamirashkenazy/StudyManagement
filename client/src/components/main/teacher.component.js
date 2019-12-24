import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import {useStyles} from './styles'
import AccountMenu from './account_menu.component'

export default function Teacher(props) {
    const state = props.history.location.state
    console.log(JSON.stringify(state));

    const classes = useStyles();
    return (
        <div>
            <AppBar position="static" className={classes.AppBar} >
                <AccountMenu userDetails={state}/>
            </AppBar> 
        <h5>
          Teacher
        </h5>
        </div>
    )
}
