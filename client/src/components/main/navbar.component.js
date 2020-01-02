import React, {useState, useEffect} from 'react'
import {useHistory} from 'react-router-dom'
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import AccountCircle from '@material-ui/icons/AccountCircle';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import {Sync, CreateOutlined} from '@material-ui/icons';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import {useStyles, StyledMenu, StyledMenuItem} from './appBarMenu.styles'

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import {SignupFormRedux} from '../signup/signupFormRedux'
import {reduxForm, getFormValues } from 'redux-form'
import {connect } from 'react-redux'
import { check_errors, validateForm, allFieldsExist } from '../signup/validationFields';
import get_mongo_api from '../mongo/paths.component'
import axios from 'axios'

function AccountMenu({handleSubmit, formValues, next_role, userDetails, navbar_operations_by_role, formSubmitButtonName}) {
  // console.log("userDetails: " , userDetails);
  const [open, setOpen] = useState(false);
  const onUpdateDetailsButton = () => { 
    setOpen(true);
  };

  const [wasUpdated, setUpdated] = useState(false)

  const handleDialogClose = () => { 
    setOpen(false); 
    setUpdated(false);
  };
  let history = useHistory();
  function onLogOut() {
    history.push("/");
  }

  useEffect(()=> {
    formValues = userDetails
  })
  function onChangeRole() {
    history.push({
      pathname: `/main/`, 
      next_role : next_role,
      state: userDetails
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
          {(userDetails.isStudent && userDetails.isTeacher) 
          && 
          <StyledMenuItem onClick={onChangeRole}>
            <ListItemIcon >
              <Sync fontSize="large" />
            </ListItemIcon>
            <ListItemText primary="החלף תפקיד" />
          </StyledMenuItem> }

          <StyledMenuItem onClick={onUpdateDetailsButton}>
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

  const httpPostRequestToUpdateUser = (formValues) => {
    let user = {
      _id : formValues._id, password : formValues.password
    }
    axios.post(get_mongo_api('sign_in'), user).then((response)=> {
        if (response.data.success) {
          return true
        } else {
            alert(response.data.message)
            return false
        }
    }).then(res => {
      if (res){
        axios.post(get_mongo_api(`users/update/${formValues._id}`), formValues).then((response)=>{
          if (response.data.success) {
            console.log("User updated");
            setUpdated(true)
          } else {
            alert("Couldn't update: ", response.data.message)
          }
        })
      }
    })
  }
  const [errors, setErrors] = useState({_id : null})
  const submitForm = (formValues) => {
      console.log('submitting form: ', formValues);
      if(!allFieldsExist(formValues)) {
          alert("אנא מלא את כל השדות")
      } else {
          let local_errors = check_errors(formValues)
          setErrors(local_errors)
          let validForm = validateForm(local_errors)
          if(!validForm) {
              console.log(local_errors);
          } else {
              httpPostRequestToUpdateUser(formValues)
          }
      }
  }

  return (
    <Toolbar variant="dense" className={classes.toolbar}>
      {accountMenuSection()}
      <Dialog open={open} onClose={handleDialogClose} aria-labelledby="form-dialog-title">
        <DialogTitle style={{direction : "rtl", textAlign:"right"}} id="form-dialog-title">עדכון פרטים</DialogTitle>
        <DialogContent style={{direction : "rtl", textAlign:"right"}}>
          <SignupFormRedux onSubmit={submitForm} handleSubmit={handleSubmit} errors={errors} formValues={formValues} idDisabled={true} formSubmitButtonName={formSubmitButtonName} submitDisabled={wasUpdated}/>
          {wasUpdated && <Button onClick={handleDialogClose} color="primary"> צא </Button>}
        </DialogContent>
      </Dialog>
      {fromListToOpterationsInNavBar}
    </Toolbar>
  )
}
  
const mapStateToProps = (state, ownProps) => {
  return (
    {
      formValues: getFormValues('updateDetails')(state),
      initialValues : ownProps.userDetails
    }
  )
}

const formConfiguration = {
  form : "updateDetails",
  enableReinitialize: true
}

const updateForm = connect(mapStateToProps)(
  reduxForm(formConfiguration)(AccountMenu)
);
export default updateForm
