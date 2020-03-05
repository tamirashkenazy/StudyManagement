import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import { withStyles } from '@material-ui/core/styles';
export const useStylesAppBar = makeStyles(theme => ({
    AppBar : {
        backgroundColor : "#37474f", //#01579b //#37474f
        alignItems : "right",
        direction : "rtl",
    },
    toolbar: { 
        flexGrow: 1,
        alignItems : "right",
        direction : "rtl",
    },
    menuButton: {
      marginRight: theme.spacing(1),

    },
  }));


  export const StyledMenu = withStyles({
    paper: { border: '1px solid #d3d4d5', },})(props => (
    <Menu elevation={0} getContentAnchorEl={null} anchorOrigin={{ vertical: 'bottom', horizontal: 'center',}}
      transformOrigin={{ vertical: 'top', horizontal: 'center', }}
      {...props}
    />
  ));
  
  export  const StyledMenuItem = withStyles(theme => ({
    root: { 
      direction : "rtl", 
      textAlign : "center",
      '&:focus': { backgroundColor: theme.palette.primary.main, 
        '& .MuiListItemIcon-root, & .MuiListItemText-primary': { 
            color: theme.palette.common.white, // "#1de9b6" //theme.palette.common.white, 
      },},},
  }))(MenuItem);