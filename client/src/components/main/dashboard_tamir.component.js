import React, {useEffect, useState} from 'react'
import {useHistory} from 'react-router-dom'
import axios from 'axios'
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

export default function Main(props) {
    let history = useHistory();

    const [userDetails, setUserDetails] = useState({ first_name: "", last_name: "" });
    const [isLoading, setIsLoading] = useState(true)
    function onLogOut() {
        history.push("/");
    }

    const fetchDataById = async (_id) => {
        axios.get(`http://localhost:5000/users/${_id}`).then((response=>{
            if (response.data.success) {
                let user = response.data.user
                console.log(JSON.stringify(response.data.user));
                setUserDetails({ first_name: user.first_name, last_name: user.last_name })
                setIsLoading(false)
            } else {

            }
        }))
    }

    useEffect(()=>{
        const _id = props.location.state._id;
        console.log("id: " + (_id));
        fetchDataById(_id)
    },[]);
    const useStyles = makeStyles(theme => ({
        toolbar: {
          flexGrow: 1,
          color : "black",
          backgroundColor : "gray",
          alignItems : "right",
          direction : "rtl"
        },
        menuButton: {
          marginRight: theme.spacing(2),

        },
      }));
    const classes = useStyles();
    return (
        !isLoading ? 
        <AppBar position="static"  >
            <Toolbar variant="dense" className={classes.toolbar}>
                <IconButton edge="start" className={classes.menuButton} aria-label="menu">
                <MenuIcon />
                </IconButton>
                <Typography variant="h6" color="black">
                Photos
                </Typography>
            </Toolbar>
        </AppBar> 
        : 
        <></>
    )
}
