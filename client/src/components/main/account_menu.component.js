import React, {useState} from 'react'
import {useHistory} from 'react-router-dom'
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import AccountCircle from '@material-ui/icons/AccountCircle';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import {Sync, CreateOutlined} from '@material-ui/icons';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import {useStyles, StyledMenu, StyledMenuItem} from './styles'

export default function AccountMenu(props) {
  let history = useHistory();
  console.log(JSON.stringify(props))
  function onLogOut() {
    history.push("/");
  }

  function onUpdateDetails() {
    history.push({
      pathname: '/signup', 
      state: props.userDetails
    });
  }

  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenu = event => {
      setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
      setAnchorEl(null);
  };
  const AccountMenuBar = () => {
    // return (
      
    // )
  }

  return (
    <Toolbar variant="dense" className={classes.toolbar}>
    <IconButton
        className={classes.menuButton}
        aria-label="account of current user"
        aria-controls="account-appbar"
        aria-haspopup="true"
        color="inherit"
        onClick={handleMenu}
    >
      <AccountCircle  fontSize="large" />
    </IconButton>

    <StyledMenu 
        id="account-appbar"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <StyledMenuItem>
            <ListItemIcon>
                <Sync fontSize="medium" />
            </ListItemIcon>
            <ListItemText primary="החלף תפקיד" />
        </StyledMenuItem>

        <StyledMenuItem onClick={onUpdateDetails}>
            <ListItemIcon>
                <CreateOutlined fontSize="medium" />
            </ListItemIcon>
            <ListItemText primary="עדכון פרטים" />
        </StyledMenuItem>
        <StyledMenuItem>
            <ListItemIcon>
                <HelpOutlineIcon fontSize="medium" />
            </ListItemIcon>
            <ListItemText primary="עזרה" />
        </StyledMenuItem>
        <StyledMenuItem onClick={onLogOut}>
            <ListItemIcon>
                <ExitToAppIcon fontSize="medium" />
            </ListItemIcon>
            <ListItemText primary="יציאה" />
        </StyledMenuItem>
    </StyledMenu>
  <Typography variant="h4">
            שלום  {props.userDetails.first_name} {props.userDetails.last_name}
    </Typography>
</Toolbar>
  )
}

