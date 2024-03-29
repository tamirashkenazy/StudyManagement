import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import AccountCircle from '@material-ui/icons/AccountCircle';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { Sync, CreateOutlined } from '@material-ui/icons';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { useStylesAppBar, StyledMenu, StyledMenuItem } from './appBarMenu.styles'
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { SignupFormRedux } from '../../signup/signupFormRedux'
import { reduxForm, getFormValues } from 'redux-form'
import { connect } from 'react-redux'
import { check_errors, validateForm, allFieldsExist } from '../../signup/validationFields';
import get_mongo_api from '../../mongo/paths.component'
import axios from 'axios'

function AccountMenu({ handleSubmit, formValues, next_role, userDetails, navbar_operations_by_role, props }) {
  const [open, setOpen] = useState(false);
  const [helpIsOpen, setOpenHelp] = useState(false);

  const onUpdateDetailsButton = () => {
    setOpen(true);
  };

  const onHelpButton = () => {
    setOpenHelp(true);
  };

  const [wasUpdated, setUpdated] = useState(false)

  const handleDialogClose = () => {
    setOpen(false);
    setUpdated(false);
  };

  const handleDialogCloseHelp = () => {
    setOpenHelp(false);
  };

  let history = useHistory();
  function onLogOut() {
    history.push("/");
  }

  function onChangeRole() {
    history.push({
      pathname: `/main/`,
      next_role: next_role,
      state: userDetails
    });
  }
  const classes = useStylesAppBar();
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
          <AccountCircle fontSize="large" />
        </IconButton>

        <StyledMenu id="account-appbar" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
          {(userDetails.isStudent && userDetails.isTeacher)
            &&
            <StyledMenuItem onClick={onChangeRole}>
              <ListItemIcon >
                <Sync fontSize="large" />
              </ListItemIcon>
              <ListItemText primary="החלף תפקיד" />
            </StyledMenuItem>}

          <StyledMenuItem onClick={onUpdateDetailsButton}>
            <ListItemIcon>
              <CreateOutlined fontSize="large" />
            </ListItemIcon>
            <ListItemText primary="עדכון פרטים" />
          </StyledMenuItem>

          <StyledMenuItem onClick={onHelpButton}>
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
        <div style={{ margin: "1%", textAlign: "right" }}>
          שלום<br /> {userDetails.first_name} {userDetails.last_name}
        </div>
      </>
    )
  }

  const fromListToOpterationsInNavBar = navbar_operations_by_role.map(menu_item =>
    <StyledMenuItem style={{ marginRight: "6%" }} onClick={menu_item.on_click} key={menu_item.key} >
      <ListItemIcon>
        {menu_item.icon}
      </ListItemIcon>
      <h4>
        {menu_item.header}
      </h4>
    </StyledMenuItem>
  )
  const httpPostRequestToUpdateUser = (formValues, was_teacher, was_student) => {
    let user = {
      _id: formValues._id, password: formValues.password
    }
    axios.post(get_mongo_api('sign_in'), user).then((response) => {
      if (response.data.success) {
        return true
      } else {
        alert(response.data.message)
        return false
      }
    }).then(res => {
      if (res) {
        axios.post(get_mongo_api(`users/update/${formValues._id}`), formValues).then((response) => {
          if (response.data.success) {
            alert("המשתמש עודכן, השינויים ייכנסו לתוקף בהתחברות מחדש למשתמש");
            setUpdated(true)
          } else {
            alert(":בעיה בעדכון" ,response.data.message)
          }
        })
        if (formValues.isTeacher) {
          // if the teacher exists in teachers collection - there will be a failure, so nothing will be changed
          axios.post(get_mongo_api(`teachers/add`), { _id: formValues._id }).then(res => {
            if (!res.data.success) {
              console.log('not adding');
              // alert(res.data.message)
            }
          })
        } else if (was_teacher && formValues.isTeacher){
          let name = `${formValues.first_name} ${formValues.last_name}`
          axios.post(get_mongo_api(`teachers/update/name`), {_id : formValues._id , name }).then(res => {
            if (!res.data.success) {
              alert(res.data.message)
            }
          })
        } else if (was_teacher && !formValues.isTeacher){
          // if the teacher doesn't exist there will be a fuilure - again, nothing will be changed
          axios.delete(get_mongo_api(`teachers/${formValues._id}`)).then(res => {
            if (!res.data.success) {
              alert(res.data.message)
            }
          })
        }
        if (!was_student && formValues.isStudent) {
          // same as the teacher
          axios.post(get_mongo_api(`students/add`), { _id: formValues._id }).then(res => {
            if (!res.data.success) {
              // alert(res.data.message)
              console.log('not adding');
            }
          })
        } else if (was_student && formValues.isStudent) {
          let name = `${formValues.first_name} ${formValues.last_name}`
          axios.post(get_mongo_api(`students/update/name`), {_id : formValues._id , name } ).then(res => {
            if (!res.data.success) {
              alert(res.data.message)
            }
          })
        } else if (was_student && !formValues.isStudent){
          axios.delete(get_mongo_api(`students/${formValues._id}`)).then(res => {
            if (!res.data.success) {
              alert(res.data.message)
            }
          })
        }
      }
    })
  }
  const [errors, setErrors] = useState({ _id: null })
  const submitForm = (formValues) => {
    if (!allFieldsExist(formValues)) {
      alert("אנא מלא את כל השדות")
    } else {
      let local_errors = check_errors(formValues)
      setErrors(local_errors)
      let validForm = validateForm(local_errors)
      if (!validForm) {
        alert(local_errors);
      } else {
        httpPostRequestToUpdateUser(formValues, userDetails.isTeacher, userDetails.isStudent)
      }
    }
  }

  return (
    <Toolbar variant="dense" className={classes.toolbar}>
      {accountMenuSection()}
      <Dialog open={open} onClose={handleDialogClose} aria-labelledby="form-dialog-title">
        <DialogTitle style={{ direction: "rtl", textAlign: "right" }} id="form-dialog-title"><CreateOutlined> </CreateOutlined>עדכון פרטים</DialogTitle>
        <DialogContent style={{ direction: "rtl", textAlign: "right", width: "60rem" }}>
          <SignupFormRedux onSubmit={submitForm} handleSubmit={handleSubmit} errors={errors} formValues={formValues} idDisabled={true} formSubmitButtonName={props.formSubmitButtonName} submitDisabled={wasUpdated} />
          {wasUpdated && <Button onClick={handleDialogClose} color="primary"> צא </Button>}
        </DialogContent>
      </Dialog>
      <Dialog open={helpIsOpen} onClose={handleDialogCloseHelp} aria-labelledby="form-dialog-title">
        <DialogTitle style={{ direction: "rtl", textAlign: "right" }} id="form-dialog-title"> <HelpOutlineIcon> </HelpOutlineIcon> עזרה </DialogTitle>
        <DialogContent style={{ direction: "rtl", textAlign: "right" }}>
          אנא צור קשר עם האחראים על שעות החונכות במחלקה
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
      initialValues: ownProps.userDetails
    }
  )
}

const formConfiguration = {
  form: "updateDetails",
  enableReinitialize: true
}

const updateForm = connect(mapStateToProps)(
  reduxForm(formConfiguration)(AccountMenu)
);
export default updateForm
