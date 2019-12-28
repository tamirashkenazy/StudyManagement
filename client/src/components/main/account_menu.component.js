import React, {useState} from 'react'
import {useHistory} from 'react-router-dom'
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import AccountCircle from '@material-ui/icons/AccountCircle';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import {Sync, CreateOutlined} from '@material-ui/icons';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import {useStyles, StyledMenu, StyledMenuItem} from './styles'

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import {SignupForm} from '../signup/signupForm.component'

export default function AccountMenu(props) {
  const [open, setOpen] = React.useState(false);
  const handleDialogClickOpen = () => { setOpen(true);};
  const handleDialogClose = () => { setOpen(false); };
  
  let history = useHistory();
  // console.log(JSON.stringify(props))
  function onLogOut() {
    history.push("/");
  }

  function onChangeRole() {
    history.push({
      pathname: `/main/${props.next_role}`, 
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


  const accountMenuSection = () => {
    return (  
    <>
      <IconButton className={classes.menuButton} aria-label="account of current user" aria-controls="account-appbar" aria-haspopup="true" color="inherit" onClick={handleMenu}>
        <AccountCircle  fontSize="large" />
      </IconButton>

      <StyledMenu  id="account-appbar" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
          {(props.userDetails.isStudent && props.userDetails.isTeacher) 
          ? 
          <StyledMenuItem onClick={onChangeRole}>
            <ListItemIcon >
              <Sync fontSize="large" />
            </ListItemIcon>
            <ListItemText primary="החלף תפקיד" />
          </StyledMenuItem> 
          : 
          <></>}

          <StyledMenuItem onClick={handleDialogClickOpen}>
            <ListItemIcon>
                <CreateOutlined fontSize="large" />
            </ListItemIcon>
            <ListItemText primary="עדכון פרטים" />
          </StyledMenuItem>

          <StyledMenuItem>
            <ListItemIcon>
                <HelpOutlineIcon fontSize="large" />
            </ListItemIcon>
            <ListItemText primary="עזרה" />
          </StyledMenuItem>

          <StyledMenuItem onClick={onLogOut}>
            <ListItemIcon>
                <ExitToAppIcon fontSize="large" />
            </ListItemIcon>
            <ListItemText primary="יציאה" />
          </StyledMenuItem>

      </StyledMenu>
      <div  style={{margin : "1%", alignItems:"right", alignContent:"right"}}>
        {props.userDetails.first_name} <br/>{props.userDetails.last_name}
      </div>
    </>
    )
  }




  const fromListToOpterationsInNavBar = props.navbar_operations_by_role.map(menu_item=>
    <StyledMenuItem style={{marginRight : "6%"}} onClick={menu_item.on_click} key={menu_item.key}>
          <ListItemIcon>
              {menu_item.icon}
          </ListItemIcon>
          <h4>
            {menu_item.header}
          </h4>
        </StyledMenuItem>
  )
    //   <>
    //   <StyledMenuItem style={{marginRight : "6%"}} onClick={()=>console.log("update your zminut")}>
    //     <ListItemIcon>
    //         <EventAvailableOutlinedIcon fontSize="large" style={{color:"white"}} />
    //     </ListItemIcon>
    //     <h4>
    //       עדכון זמינות
    //     </h4>
    //   </StyledMenuItem>

    //   <StyledMenuItem style={{marginRight : "6%"}}  onClick={()=>console.log("choose courser to teach ")}>
    //     <ListItemIcon>
    //       <ImportContactsSharpIcon fontSize="large" style={{color:"white"}} />
    //     </ListItemIcon>
    //     <h4>
    //       בחירת קורסים להוראה
    //     </h4>
    //   </StyledMenuItem>
    // </>

  return (
    <Toolbar variant="dense" className={classes.toolbar}>
      {accountMenuSection()}
      <Dialog open={open} onClose={handleDialogClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Subscribe</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To subscribe to this website, please enter your email address here. We will send updates
            occasionally.
          </DialogContentText>
          <SignupForm user={props.userDetails}/>  
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDialogClose} color="primary">
            Subscribe
          </Button>
        </DialogActions>
      </Dialog>
      {fromListToOpterationsInNavBar}
    </Toolbar>
  )
}

