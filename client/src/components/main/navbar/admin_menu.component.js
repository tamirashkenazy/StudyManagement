import React, {useState} from 'react'
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import AccountCircle from '@material-ui/icons/AccountCircle';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import {useStyles, StyledMenu, StyledMenuItem} from './appBarMenu.styles'
import {useHistory} from 'react-router-dom'


export default function AdminMenu({userDetails, navbar_operations_by_role}) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenu = event => {
      setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
      setAnchorEl(null);
  };
  let history = useHistory();
  function onLogOut() {
    history.push("/");
  }
  const adminMenuSection = () => {
    return (  
    <>
      <IconButton className={classes.menuButton} aria-label="account of current user" aria-controls="account-appbar" aria-haspopup="true" color="inherit" onClick={handleMenu}>
        <AccountCircle  fontSize="large" />
      </IconButton>

      <StyledMenu  id="account-appbar" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
          <StyledMenuItem onClick={onLogOut}>
            <ListItemIcon>
                <ExitToAppIcon fontSize="large" />
            </ListItemIcon>
            <ListItemText primary="יציאה" />
          </StyledMenuItem>

      </StyledMenu>
      <div  style={{margin : "1%", textAlign:"right"}}>
      שלום<br/> {userDetails.first_name} {userDetails.last_name}
      </div>
    </>
    )
  }

  const fromListToOpterationsInNavBar = navbar_operations_by_role.map(menu_item=>
    <StyledMenuItem style={{marginRight : "6%"}} onClick={menu_item.on_click} key={menu_item.key}>
          <ListItemIcon>
              {menu_item.icon}
          </ListItemIcon>
          <h4>
            {menu_item.header}
          </h4>
        </StyledMenuItem>
  )

  return (
    <Toolbar variant="dense" className={classes.toolbar}>
      {adminMenuSection()}
      {fromListToOpterationsInNavBar}
    </Toolbar>
  )
}
