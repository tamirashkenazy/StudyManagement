import React, { useState } from 'react';
import { Container } from 'react-bootstrap'
import { Icon } from 'semantic-ui-react';
import { Link, useHistory } from 'react-router-dom'
import '../../styles/signup-form.scss'
import '../../styles/general.scss'
import { SignupFormRedux } from './signupFormRedux'
import { reduxForm, getFormValues } from 'redux-form'
import { connect } from 'react-redux'
import { httpPostRequestToAddUser, httpPostRequestToAddStudent, httpPostRequestToAddTeacher } from './signupPostRequests'
import { check_errors, validateForm, allFieldsExist } from './validationFields';
import { Typography } from '@material-ui/core';

const SignupConatainer = ({ handleSubmit, formValues }) => {
    const history = useHistory()
    const [errors, setErrors] = useState({})
    const submitForm = async (formValues) => {
        if (!allFieldsExist(formValues)) {
            alert("אנא מלא את כל השדות")
        } else {
            let local_errors = check_errors(formValues)
            setErrors(local_errors)
            let validForm = validateForm(local_errors)
            if (validForm) {
                let is_user_added = await httpPostRequestToAddUser(formValues, history)
                if (is_user_added) {
                    if (formValues.isStudent) {
                        await httpPostRequestToAddStudent(formValues._id, formValues.first_name, formValues.last_name)
                    }
                    if (formValues.isTeacher) {
                        await httpPostRequestToAddTeacher(formValues._id, formValues.first_name, formValues.last_name)
                    }
                    history.push('/')
                    window.location.reload(true) 
                }
            }
        }

    }

    return (
        <div id="land-page" className="bg" style={{ direction: "rtl" }}>
            <Container id="signup-box" className="right-align">
                <Link to="/" style={{ textDecoration: 'none', color: '#3f51b5' }}>
                    <Icon size='big' name='arrow right' style={{ margin: "0 2% 2% 2%" }}></Icon>
                </Link>
                <Typography variant="h3" color="primary" display="inline" style={{margin:"0 30%"}} >טופס הרשמה</Typography>
                <SignupFormRedux onSubmit={submitForm} handleSubmit={handleSubmit} errors={errors} formValues={formValues} formSubmitButtonName="הרשמה" />
            </Container>
        </div>
    )
}


const emptyUser = {
    _id: "", password: "", email: "", first_name: "", last_name: "", tel_number: "", gender: "",
    isTeacher: false, isStudent: false, isAdmin: false, study_year: ""
}

const mapStateToProps = state => ({
    formValues: getFormValues('sign-up-form')(state),
    initialValues: emptyUser
});

const formConfiguration = {
    form: "sign-up-form",
    enableReinitialize: true
}

const signUpForm = connect(mapStateToProps)(
    reduxForm(formConfiguration)(SignupConatainer)
);
export default signUpForm